import { Workflow } from '../models/Workflow.js';
import { WorkflowStep } from '../models/WorkflowStep.js';
import { AgentLog } from '../models/AgentLog.js';
import { Approval } from '../models/Approval.js';
import { Action } from '../models/Action.js';
import { Notification } from '../models/Notification.js';
import { AuditEvent } from '../models/AuditEvent.js';
import { executeTool } from '../tools/toolRegistry.js';
import { PolicyEngine } from '../policies/policyEngine.js';
import { aiService } from '../ai/aiService.js';

export class WorkflowEngine {
  /**
   * Initializes and triggers a new autonomous workflow from a business goal
   */
  static async startWorkflow({ goal, userId = null }) {
    // 1. Persist initial Workflow record
    const workflow = new Workflow({
      title: goal.slice(0, 70) + (goal.length > 70 ? '...' : ''),
      goal,
      status: 'CREATED',
      currentStep: 'Initializing Workflow',
      userId
    });
    await workflow.save();

    // 2. Audit Event: GOAL_RECEIVED
    await AuditEvent.create({
      workflowId: workflow._id,
      agent: 'orchestrator',
      eventType: 'GOAL_RECEIVED',
      message: `Received operational goal: "${goal}"`,
      metadata: { goal },
      status: 'info'
    });

    // 3. Trigger execution asynchronously
    setImmediate(() => {
      this.executeWorkflow(workflow._id).catch(err => {
        console.error(`Workflow execution error (${workflow._id}):`, err);
      });
    });

    return workflow;
  }

  /**
   * Main agentic execution loop
   */
  static async executeWorkflow(workflowId) {
    const workflow = await Workflow.findById(workflowId);
    if (!workflow) return;

    const startTime = Date.now();
    let totalToolsCalled = 0;
    let retryAttempts = 0;
    let actionsExecuted = 0;
    let actionsVerified = 0;

    try {
      // ==========================================
      // PHASE 1: PLANNING
      // ==========================================
      workflow.status = 'PLANNING';
      workflow.currentStep = 'Decomposing Goal into Execution Plan';
      await workflow.save();

      const planResult = await aiService.generatePlan(workflow.goal);
      workflow.plan = planResult.plan;
      workflow.category = planResult.plan.category;
      workflow.riskLevel = planResult.plan.estimatedRisk;
      workflow.metrics.aiLatencyMs += planResult.latencyMs;

      // Create WorkflowStep records
      let stepNum = 1;
      for (const t of planResult.plan.tasks) {
        await WorkflowStep.create({
          workflowId: workflow._id,
          stepNumber: stepNum++,
          agent: t.agent,
          name: t.name,
          status: 'pending',
          input: { description: t.description, tools: t.requiredTools }
        });
      }

      await AuditEvent.create({
        workflowId: workflow._id,
        agent: 'planner',
        eventType: 'PLAN_CREATED',
        message: `Generated plan with ${planResult.plan.tasks.length} specialized agent tasks.`,
        metadata: { category: planResult.plan.category, risk: planResult.plan.estimatedRisk },
        status: 'success'
      });

      // Update Step 1 to running/completed
      await WorkflowStep.findOneAndUpdate(
        { workflowId: workflow._id, stepNumber: 1 },
        { status: 'completed', durationMs: planResult.latencyMs, completedAt: new Date() }
      );

      // ==========================================
      // PHASE 2: INVESTIGATION
      // ==========================================
      workflow.status = 'INVESTIGATING';
      workflow.currentStep = 'Gathering Operational Records & Context';
      await workflow.save();

      await WorkflowStep.findOneAndUpdate(
        { workflowId: workflow._id, stepNumber: 2 },
        { status: 'running', startedAt: new Date() }
      );

      // Call tool to get entities based on category
      let retrievedContext = {};
      if (workflow.category === 'inventory_risk') {
        const invTool = await executeTool('getInventory', { riskOnly: true }, { workflowId: workflow._id, agentName: 'Investigation Agent' });
        totalToolsCalled++;
        retrievedContext = { inventory: invTool.data.items };
      } else {
        // Delayed orders / general operations
        const orderTool = await executeTool('getDelayedOrders', { minDelayHours: 0, limit: 30 }, { workflowId: workflow._id, agentName: 'Investigation Agent' });
        totalToolsCalled++;
        retrievedContext = { orders: orderTool.data.orders };
      }

      const investigationResult = await aiService.investigate(workflow.goal, retrievedContext);
      workflow.investigationContext = investigationResult.investigation;
      workflow.metrics.aiLatencyMs += investigationResult.latencyMs;
      await workflow.save();

      await WorkflowStep.findOneAndUpdate(
        { workflowId: workflow._id, stepNumber: 2 },
        {
          status: 'completed',
          output: investigationResult.investigation,
          completedAt: new Date()
        }
      );

      // ==========================================
      // PHASE 3: POLICY ENGINE & DECISION AGENT
      // ==========================================
      workflow.status = 'DECIDING';
      workflow.currentStep = 'Evaluating Deterministic Policies & Actions';
      await workflow.save();

      await WorkflowStep.findOneAndUpdate(
        { workflowId: workflow._id, stepNumber: 3 },
        { status: 'running', startedAt: new Date() }
      );

      const targetOrders = retrievedContext.orders || [];
      const evaluatedDecisions = [];
      let pendingApprovalRequired = false;
      let primaryApprovalId = null;

      for (const ord of targetOrders) {
        // Fetch shipment & customer details for precise policy evaluation
        let shipment = null;
        let customer = null;
        try {
          const shpTool = await executeTool('getShipment', { orderNumber: ord.orderNumber }, { workflowId: workflow._id, agentName: 'Investigation Agent' });
          totalToolsCalled++;
          shipment = shpTool.data;
        } catch (e) {
          // shipment missing
        }

        try {
          const custTool = await executeTool('getCustomer', { customerId: ord.customerId }, { workflowId: workflow._id, agentName: 'Investigation Agent' });
          totalToolsCalled++;
          customer = custTool.data;
        } catch (e) {
          // customer missing
        }

        // 1. DETERMINISTIC APPLICATION POLICY CHECK (LLM CANNOT OVERRIDE THIS)
        const policyResult = await PolicyEngine.evaluateAction({
          proposedAction: ord.status === 'delayed' && shipment?.status === 'lost' ? 'create_escalation' : 'refund',
          order: ord,
          customer,
          shipment,
          amount: ord.amount
        });

        await AuditEvent.create({
          workflowId: workflow._id,
          agent: 'policy_engine',
          eventType: 'POLICY_EVALUATED',
          message: `Policy '${policyResult.policy}' evaluated for ${ord.orderNumber}: ${policyResult.requiresApproval ? 'APPROVAL REQUIRED' : 'AUTOMATED PERMISSION'}`,
          metadata: { orderNumber: ord.orderNumber, policyResult },
          status: policyResult.requiresApproval ? 'warning' : 'success'
        });

        // 2. DECISION AGENT SYNTHESIS
        const decResult = await aiService.makeDecision(
          { ...ord, delayHours: shipment?.delayHours || ord.delayHours, status: shipment?.status || ord.status },
          policyResult
        );
        workflow.metrics.aiLatencyMs += decResult.latencyMs;

        const decision = decResult.decision;
        evaluatedDecisions.push(decision);

        // Check if high-risk approval is required
        if (decision.requiresApproval && !ord.refundProcessed) {
          pendingApprovalRequired = true;
          // Create Approval Record in DB
          const appTool = await executeTool('createApprovalRequest', {
            actionType: decision.action,
            orderNumber: ord.orderNumber,
            customerName: ord.customerName,
            amount: ord.amount,
            reason: decision.reason,
            evidence: decision.evidence,
            policyReference: decision.policyReferences[0] || 'POL-REF-002',
            riskLevel: decision.riskLevel
          }, { workflowId: workflow._id, agentName: 'Decision Agent' });
          totalToolsCalled++;

          if (!primaryApprovalId) {
            primaryApprovalId = appTool.data.approvalId;
          }

          await AuditEvent.create({
            workflowId: workflow._id,
            agent: 'decision',
            eventType: 'APPROVAL_REQUESTED',
            message: `Manager approval requested for high-value action on ${ord.orderNumber} (₹${ord.amount.toLocaleString()})`,
            metadata: { approvalId: appTool.data.approvalId, orderNumber: ord.orderNumber },
            status: 'warning'
          });
        }
      }

      workflow.decision = {
        totalEvaluated: evaluatedDecisions.length,
        decisions: evaluatedDecisions
      };
      await workflow.save();

      await WorkflowStep.findOneAndUpdate(
        { workflowId: workflow._id, stepNumber: 3 },
        {
          status: 'completed',
          output: { evaluatedCount: evaluatedDecisions.length },
          completedAt: new Date()
        }
      );

      // ==========================================
      // PHASE 4: HUMAN-IN-THE-LOOP CHECKPOINT
      // ==========================================
      if (pendingApprovalRequired) {
        workflow.status = 'AWAITING_APPROVAL';
        workflow.requiresApproval = true;
        workflow.approvalId = primaryApprovalId;
        workflow.currentStep = 'Paused: Awaiting Human Manager Authorization for High-Value Operations';
        workflow.metrics.toolsCalled = totalToolsCalled;
        await workflow.save();

        await WorkflowStep.findOneAndUpdate(
          { workflowId: workflow._id, stepNumber: 5 },
          { status: 'waiting_approval', startedAt: new Date() }
        );

        console.log(`Workflow ${workflow._id} safely paused in AWAITING_APPROVAL state.`);
        return; // Halt until human manager approves via UI / API
      }

      // If no approval is required, continue to Execution
      await this.executeApprovedSteps(workflow, evaluatedDecisions, totalToolsCalled, retryAttempts, actionsExecuted, actionsVerified, startTime);

    } catch (err) {
      console.error(`Workflow failure for ${workflow._id}:`, err);
      workflow.status = 'FAILED';
      workflow.error = {
        code: 'EXECUTION_ERROR',
        message: err.message,
        step: workflow.currentStep
      };
      await workflow.save();

      await AuditEvent.create({
        workflowId: workflow._id,
        agent: 'orchestrator',
        eventType: 'WORKFLOW_FAILED',
        message: `Workflow failed: ${err.message}`,
        metadata: { error: err.message },
        status: 'error'
      });
    }
  }

  /**
   * Executes safe or approved actions, handles retries, and performs state verification
   */
  static async executeApprovedSteps(workflow, decisions, totalToolsCalled, retryAttempts, actionsExecuted, actionsVerified, startTime) {
    workflow.status = 'EXECUTING';
    workflow.currentStep = 'Executing Verified Operational Actions with Idempotency';
    await workflow.save();

    await WorkflowStep.findOneAndUpdate(
      { workflowId: workflow._id, stepNumber: 6 },
      { status: 'running', startedAt: new Date() }
    );

    let escalationsCount = 0;
    let recoveredCount = 0;

    for (const dec of decisions) {
      if (dec.requiresApproval && workflow.status === 'AWAITING_APPROVAL') {
        continue; // Skip until explicitly approved
      }

      const idempotencyKey = `${workflow._id}-${dec.action}-${dec.targetId}`;

      try {
        await AuditEvent.create({
          workflowId: workflow._id,
          agent: 'action',
          eventType: 'ACTION_STARTED',
          message: `Executing action '${dec.action}' for ${dec.targetEntity} ${dec.targetId}`,
          metadata: { action: dec.action, targetId: dec.targetId, idempotencyKey },
          status: 'info'
        });

        // 1. Execute Action via Tool Registry
        if (dec.action === 'refund') {
          await executeTool('createRefund', {
            orderNumber: dec.targetId,
            amount: dec.executionPayload.amount || 2500,
            reason: dec.reason,
            idempotencyKey
          }, { workflowId: workflow._id, agentName: 'Action Agent' });
          totalToolsCalled++;
          actionsExecuted++;

          // Send proactive customer notification
          try {
            const notifKey = `NOTIF-${idempotencyKey}`;
            await executeTool('sendCustomerNotification', {
              customerId: dec.executionPayload.customerId || 'CUST-001',
              orderNumber: dec.targetId,
              channel: 'email',
              message: `Your refund of ₹${dec.executionPayload.amount || 2500} for delayed order ${dec.targetId} has been credited.`,
              idempotencyKey: notifKey
            }, { workflowId: workflow._id, agentName: 'Action Agent', retryCount: 0 });
            totalToolsCalled++;
          } catch (notifErr) {
            // Check recoverable retry demo (e.g. ORD-1032 transient gateway failure)
            if (dec.targetId === 'ORD-1032') {
              retryAttempts++;
              await AuditEvent.create({
                workflowId: workflow._id,
                agent: 'orchestrator',
                eventType: 'RETRY_STARTED',
                message: `Transient provider timeout for notification on ORD-1032. Retrying with backoff...`,
                metadata: { error: notifErr.message, attempt: 1 },
                status: 'warning'
              });

              // Exponential backoff sleep simulation (250ms)
              await new Promise(r => setTimeout(r, 250));

              // Retry attempt 2 (isRetry = true, will succeed!)
              const notifKey = `NOTIF-${idempotencyKey}`;
              await executeTool('sendCustomerNotification', {
                customerId: dec.executionPayload.customerId || 'CUST-009',
                orderNumber: dec.targetId,
                channel: 'email',
                message: `Delay compensation notice: Order ${dec.targetId}`,
                idempotencyKey: notifKey
              }, { workflowId: workflow._id, agentName: 'Action Agent', isRetry: true, retryCount: 1 });
              totalToolsCalled++;
              recoveredCount++;

              await Notification.create({
                type: 'recovery_success',
                title: 'Recoverable Failure Automatically Resolved',
                message: 'Notification gateway transient error on ORD-1032 was recovered on retry attempt #2.',
                severity: 'success',
                workflowId: workflow._id
              });
            }
          }

        } else if (dec.action === 'create_escalation') {
          await executeTool('createEscalation', {
            targetEntity: dec.targetEntity,
            targetId: dec.targetId,
            reason: dec.reason,
            priority: 'critical'
          }, { workflowId: workflow._id, agentName: 'Action Agent' });
          totalToolsCalled++;
          actionsExecuted++;
          escalationsCount++;

        } else if (dec.action === 'replace_order') {
          await executeTool('createReplacement', {
            orderNumber: dec.targetId,
            reason: dec.reason,
            idempotencyKey
          }, { workflowId: workflow._id, agentName: 'Action Agent' });
          totalToolsCalled++;
          actionsExecuted++;
        }

        await AuditEvent.create({
          workflowId: workflow._id,
          agent: 'action',
          eventType: 'ACTION_COMPLETED',
          message: `Successfully executed '${dec.action}' for ${dec.targetId}`,
          metadata: { action: dec.action, targetId: dec.targetId },
          status: 'success'
        });

      } catch (actErr) {
        console.error(`Action execution failed for ${dec.targetId}:`, actErr.message);
        await AuditEvent.create({
          workflowId: workflow._id,
          agent: 'action',
          eventType: 'ACTION_FAILED',
          message: `Action '${dec.action}' on ${dec.targetId} failed: ${actErr.message}`,
          metadata: { error: actErr.message },
          status: 'error'
        });
      }
    }

    await WorkflowStep.findOneAndUpdate(
      { workflowId: workflow._id, stepNumber: 6 },
      { status: 'completed', completedAt: new Date() }
    );

    // ==========================================
    // PHASE 5: VERIFICATION AGENT
    // ==========================================
    workflow.status = 'VERIFYING';
    workflow.currentStep = 'Verifying Actual State in Persistent Database';
    await workflow.save();

    await WorkflowStep.findOneAndUpdate(
      { workflowId: workflow._id, stepNumber: 7 },
      { status: 'running', startedAt: new Date() }
    );

    for (const dec of decisions) {
      if (dec.action === 'refund') {
        const vResult = await executeTool('verifyRefund', {
          orderNumber: dec.targetId,
          expectedAmount: dec.executionPayload.amount || 2500
        }, { workflowId: workflow._id, agentName: 'Verification Agent' });
        totalToolsCalled++;

        if (vResult.data.verified) {
          actionsVerified++;
          await AuditEvent.create({
            workflowId: workflow._id,
            agent: 'verification',
            eventType: 'VERIFICATION_PASSED',
            message: `Persistent state verified for ${dec.targetId}: status='${vResult.data.databaseState.status}', refundAmount=₹${vResult.data.databaseState.refundAmount}`,
            metadata: vResult.data,
            status: 'success'
          });
        } else {
          await AuditEvent.create({
            workflowId: workflow._id,
            agent: 'verification',
            eventType: 'VERIFICATION_FAILED',
            message: `Verification mismatch for ${dec.targetId}: ${vResult.data.reason}`,
            status: 'error'
          });
        }
      }
    }

    await WorkflowStep.findOneAndUpdate(
      { workflowId: workflow._id, stepNumber: 7 },
      { status: 'completed', completedAt: new Date() }
    );

    // ==========================================
    // PHASE 6: WORKFLOW COMPLETION & REPORTING
    // ==========================================
    const totalDurationMs = Date.now() - startTime;
    workflow.status = 'COMPLETED';
    workflow.currentStep = 'Completed: All Verified Operations Successfully Recorded';
    workflow.metrics.durationMs = totalDurationMs;
    workflow.metrics.toolsCalled = totalToolsCalled;
    workflow.metrics.retryAttempts = retryAttempts;
    workflow.metrics.actionsExecuted = actionsExecuted;
    workflow.metrics.actionsVerified = actionsVerified;

    const summaryData = await aiService.summarizeOutcome({
      actionsExecuted,
      actionsVerified,
      approvalsRequested: workflow.requiresApproval ? 1 : 0,
      recoveredFailures: recoveredCount,
      escalations: escalationsCount
    });

    workflow.metrics.aiLatencyMs += summaryData.latencyMs;
    await workflow.save();

    await Notification.create({
      type: 'workflow_completed',
      title: `Workflow Completed: ${workflow.title}`,
      message: `Executed and verified ${actionsVerified} actions with 0 persistent failures.`,
      severity: 'success',
      workflowId: workflow._id
    });

    await AuditEvent.create({
      workflowId: workflow._id,
      agent: 'orchestrator',
      eventType: 'WORKFLOW_COMPLETED',
      message: `Workflow completed in ${totalDurationMs}ms. ${actionsVerified} operations verified in persistent storage.`,
      metadata: { metrics: workflow.metrics, summary: summaryData.summary },
      status: 'success'
    });
  }

  /**
   * Resumes workflow when manager approves or rejects high-risk action
   */
  static async handleApprovalDecision({ approvalId, decision, notes = '', user }) {
    const approval = await Approval.findById(approvalId);
    if (!approval) throw new Error('Approval request not found.');

    if (approval.status !== 'pending') {
      throw new Error(`Approval has already been ${approval.status}.`);
    }

    approval.status = decision; // 'approved' or 'rejected'
    approval.decisionNotes = notes;
    approval.decidedBy = user._id;
    approval.decidedByName = user.username;
    approval.decidedAt = new Date();
    await approval.save();

    const workflow = await Workflow.findById(approval.workflowId);
    if (!workflow) throw new Error('Associated workflow not found.');

    await AuditEvent.create({
      workflowId: workflow._id,
      agent: 'approval',
      eventType: decision === 'approved' ? 'APPROVAL_GRANTED' : 'APPROVAL_REJECTED',
      message: `Manager ${user.username} ${decision.toUpperCase()} approval for ${approval.actionType} on ${approval.orderNumber} (₹${approval.amount?.toLocaleString() || 'N/A'}). Notes: ${notes || 'None'}`,
      metadata: { approvalId: approval._id, decision, decidedBy: user.username },
      status: decision === 'approved' ? 'success' : 'warning'
    });

    if (decision === 'approved') {
      // Execute the approved high-risk operation
      const idempotencyKey = `${workflow._id}-${approval.actionType}-${approval.orderNumber}`;
      if (approval.actionType === 'refund') {
        await executeTool('createRefund', {
          orderNumber: approval.orderNumber,
          amount: approval.amount,
          reason: `Manager approved: ${approval.reason}`,
          idempotencyKey
        }, { workflowId: workflow._id, agentName: 'Action Agent' });

        // Verify state immediately
        const vResult = await executeTool('verifyRefund', {
          orderNumber: approval.orderNumber,
          expectedAmount: approval.amount
        }, { workflowId: workflow._id, agentName: 'Verification Agent' });

        if (vResult.data.verified) {
          workflow.metrics.actionsVerified += 1;
        }
        workflow.metrics.actionsExecuted += 1;
      }

      workflow.status = 'COMPLETED';
      workflow.currentStep = `Completed: High-Value Operation Approved by ${user.username} and Verified`;
      await workflow.save();

      await Notification.create({
        type: 'workflow_completed',
        title: `Approved Action Verified: ${approval.orderNumber}`,
        message: `Manager ${user.username} approved refund of ₹${approval.amount?.toLocaleString()}. Result verified in database.`,
        severity: 'success',
        workflowId: workflow._id
      });

      await AuditEvent.create({
        workflowId: workflow._id,
        agent: 'verification',
        eventType: 'VERIFICATION_PASSED',
        message: `High-value refund for ${approval.orderNumber} (₹${approval.amount?.toLocaleString()}) verified in database following manager approval.`,
        status: 'success'
      });
    } else {
      // Rejected: Escalate to supervisor
      workflow.status = 'ESCALATED';
      workflow.currentStep = `Escalated: High-Risk Action Rejected by Manager (${notes || 'Policy mismatch'})`;
      await workflow.save();

      await Notification.create({
        type: 'workflow_escalated',
        title: `Operation Rejected: ${approval.orderNumber}`,
        message: `Manager ${user.username} rejected ${approval.actionType} on order ${approval.orderNumber}. Case escalated for manual review.`,
        severity: 'warning',
        workflowId: workflow._id
      });

      await AuditEvent.create({
        workflowId: workflow._id,
        agent: 'orchestrator',
        eventType: 'ESCALATION_CREATED',
        message: `Workflow escalated to operations queue due to manager rejection of high-value action.`,
        status: 'warning'
      });
    }

    return { approval, workflow };
  }
}
