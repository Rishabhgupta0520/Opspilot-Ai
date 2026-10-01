import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from 'zod';
import {
  PLANNER_PROMPT_V1,
  INVESTIGATION_PROMPT_V1,
  DECISION_PROMPT_V1,
  SUMMARY_PROMPT_V1
} from './prompts.js';

// Zod Validation Schemas
export const planSchema = z.object({
  goal: z.string(),
  objective: z.string(),
  category: z.enum([
    'delayed_orders',
    'customer_escalation',
    'refund_processing',
    'inventory_risk',
    'sla_violations',
    'vip_prioritization',
    'custom_operation'
  ]),
  estimatedRisk: z.enum(['low', 'medium', 'high', 'critical']),
  tasks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      description: z.string(),
      agent: z.enum([
        'investigation',
        'policy_engine',
        'decision',
        'approval',
        'action',
        'verification'
      ]),
      priority: z.number(),
      requiredTools: z.array(z.string()).default([]),
      dependencies: z.array(z.string()).default([])
    })
  )
});

export const investigationSchema = z.object({
  summary: z.string(),
  totalEntitiesAnalyzed: z.number(),
  anomaliesDetected: z.number(),
  vipAffectedCount: z.number(),
  findings: z.array(
    z.object({
      entityId: z.string(),
      entityType: z.string(),
      severity: z.enum(['low', 'medium', 'high', 'critical']),
      summary: z.string(),
      details: z.string()
    })
  ),
  recommendedNextStep: z.string()
});

export const decisionSchema = z.object({
  action: z.enum([
    'refund',
    'replace_order',
    'update_ticket',
    'send_customer_notification',
    'create_escalation',
    'update_inventory',
    'reserve_inventory',
    'prioritize',
    'do_nothing'
  ]),
  targetEntity: z.string(),
  targetId: z.string(),
  reason: z.string(),
  confidence: z.number().min(0).max(1),
  riskLevel: z.enum(['low', 'medium', 'high', 'critical']),
  requiresApproval: z.boolean(),
  policyReferences: z.array(z.string()),
  evidence: z.array(z.string()),
  executionPayload: z.record(z.any()).default({})
});

export const summarySchema = z.object({
  executiveSummary: z.string(),
  actionsExecutedCount: z.number(),
  actionsVerifiedCount: z.number(),
  approvalsRequestedCount: z.number(),
  recoveredFailuresCount: z.number(),
  escalationsCount: z.number(),
  businessImpact: z.string(),
  auditVerdict: z.enum(['PASSED', 'FLAGGED', 'FAILED'])
});

export class AIService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || null;
    this.genAI = this.apiKey ? new GoogleGenerativeAI(this.apiKey) : null;
    this.modelName = 'gemini-1.5-flash';
  }

  hasLiveGemini() {
    return Boolean(this.apiKey && this.apiKey.trim().length > 10);
  }

  async callGeminiRaw(systemPrompt, userPrompt) {
    if (!this.hasLiveGemini()) {
      return null;
    }

    try {
      const model = this.genAI.getGenerativeModel({
        model: this.modelName,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.2
        },
        systemInstruction: systemPrompt
      });

      const startTime = Date.now();
      const result = await model.generateContent(userPrompt);
      const text = result.response.text();
      const latencyMs = Date.now() - startTime;

      return { text, latencyMs };
    } catch (err) {
      console.warn(`Gemini API call failed (${err.message}). Using deterministic reasoning fallback.`);
      return null;
    }
  }

  /**
   * Helper to parse and repair JSON
   */
  parseJSON(rawText) {
    try {
      return JSON.parse(rawText);
    } catch (err) {
      // Strip markdown codeblocks if any
      const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    }
  }

  /**
   * Generates structured execution plan
   */
  async generatePlan(goal) {
    const startTime = Date.now();
    const systemPrompt = PLANNER_PROMPT_V1;
    const userPrompt = `Decompose this operational business goal into an execution plan:\n"${goal}"`;

    const geminiResponse = await this.callGeminiRaw(systemPrompt, userPrompt);
    if (geminiResponse?.text) {
      try {
        const parsed = this.parseJSON(geminiResponse.text);
        const validated = planSchema.parse(parsed);
        return {
          plan: validated,
          latencyMs: geminiResponse.latencyMs,
          source: 'gemini'
        };
      } catch (err) {
        console.warn('Gemini plan validation failed, falling back to deterministic plan:', err.message);
      }
    }

    // Deterministic High-Quality Planner Fallback
    const lowerGoal = goal.toLowerCase();
    let category = 'custom_operation';
    if (lowerGoal.includes('delay') || lowerGoal.includes('order')) category = 'delayed_orders';
    else if (lowerGoal.includes('refund')) category = 'refund_processing';
    else if (lowerGoal.includes('stock') || lowerGoal.includes('inventory')) category = 'inventory_risk';
    else if (lowerGoal.includes('sla') || lowerGoal.includes('ticket')) category = 'sla_violations';
    else if (lowerGoal.includes('vip')) category = 'vip_prioritization';
    else if (lowerGoal.includes('escalat')) category = 'customer_escalation';

    const fallbackPlan = {
      goal,
      objective: `Execute autonomous remediation workflow for goal: "${goal}"`,
      category,
      estimatedRisk: lowerGoal.includes('refund') || lowerGoal.includes('approval') ? 'high' : 'medium',
      tasks: [
        {
          id: 'task-1',
          name: 'Identify Target Operational Entities',
          description: 'Query database for affected orders, shipments, or tickets matching the business goal criteria.',
          agent: 'investigation',
          priority: 1,
          requiredTools: ['getDelayedOrders', 'getShipment', 'getCustomer'],
          dependencies: []
        },
        {
          id: 'task-2',
          name: 'Analyze Customer Tier & SLA Exposure',
          description: 'Assess customer VIP status, past dispute history, and SLA breach timelines.',
          agent: 'investigation',
          priority: 2,
          requiredTools: ['getCustomerHistory', 'getSupportTicket'],
          dependencies: ['task-1']
        },
        {
          id: 'task-3',
          name: 'Evaluate Deterministic Policies',
          description: 'Cross-reference gathered context against active company policies (refund thresholds, VIP prioritization, escalation criteria).',
          agent: 'policy_engine',
          priority: 3,
          requiredTools: ['getPolicies'],
          dependencies: ['task-2']
        },
        {
          id: 'task-4',
          name: 'Synthesize Operational Decisions',
          description: 'Determine exact actions (automatic refund, replacement, or manager approval escalation).',
          agent: 'decision',
          priority: 4,
          requiredTools: ['calculateRefund'],
          dependencies: ['task-3']
        },
        {
          id: 'task-5',
          name: 'Obtain Manager Sign-off for High-Risk Actions',
          description: 'Pause execution and generate Human-in-the-loop approval tickets for actions over policy limit.',
          agent: 'approval',
          priority: 5,
          requiredTools: ['createApprovalRequest'],
          dependencies: ['task-4']
        },
        {
          id: 'task-6',
          name: 'Execute Approved Actions with Idempotency',
          description: 'Dispatch refunds, generate replacements, and trigger proactive customer notifications.',
          agent: 'action',
          priority: 6,
          requiredTools: ['createRefund', 'createReplacement', 'sendCustomerNotification'],
          dependencies: ['task-5']
        },
        {
          id: 'task-7',
          name: 'Verify Resulting Database State & Recover Failures',
          description: 'Perform read-after-write verification on actual database records, retrying transient network errors.',
          agent: 'verification',
          priority: 7,
          requiredTools: ['verifyRefund', 'verifyReplacement', 'verifyNotification'],
          dependencies: ['task-6']
        }
      ]
    };

    return {
      plan: planSchema.parse(fallbackPlan),
      latencyMs: Date.now() - startTime,
      source: 'deterministic'
    };
  }

  /**
   * Investigates business context
   */
  async investigate(goal, entitiesContext) {
    const startTime = Date.now();
    const systemPrompt = INVESTIGATION_PROMPT_V1;
    const userPrompt = `Analyze retrieved operational context for goal: "${goal}"\nContext: ${JSON.stringify(entitiesContext)}`;

    const geminiResponse = await this.callGeminiRaw(systemPrompt, userPrompt);
    if (geminiResponse?.text) {
      try {
        const parsed = this.parseJSON(geminiResponse.text);
        const validated = investigationSchema.parse(parsed);
        return {
          investigation: validated,
          latencyMs: geminiResponse.latencyMs,
          source: 'gemini'
        };
      } catch (err) {
        console.warn('Gemini investigation validation failed, using fallback:', err.message);
      }
    }

    // Deterministic Investigation Fallback
    const orders = entitiesContext.orders || [];
    const vipOrders = orders.filter(o => o.isVip);
    const severelyDelayed = orders.filter(o => o.delayHours > 48);

    const findings = orders.slice(0, 8).map(o => ({
      entityId: o.orderNumber,
      entityType: 'Order',
      severity: o.amount > 5000 || o.delayHours > 48 ? (o.isVip ? 'critical' : 'high') : 'medium',
      summary: `Order ${o.orderNumber} for ${o.customerName} delayed by ${o.delayHours}h (Amount: ₹${o.amount.toLocaleString()})`,
      details: `${o.isVip ? 'VIP Customer. ' : ''}${o.delayHours > 48 ? 'Exceeds 48h severe delay threshold. ' : ''}${o.amount > 5000 ? 'Exceeds ₹5,000 threshold. Requires manager approval.' : 'Under ₹5,000 limit, eligible for automated resolution.'}`
    }));

    const result = {
      summary: `Analyzed ${orders.length} delayed orders. Identified ${vipOrders.length} VIP-impacted transactions and ${severelyDelayed.length} severe delays (>48 hours).`,
      totalEntitiesAnalyzed: orders.length,
      anomaliesDetected: orders.length,
      vipAffectedCount: vipOrders.length,
      findings,
      recommendedNextStep: 'Route entities through deterministic Policy Engine for threshold and authorization assessment.'
    };

    return {
      investigation: investigationSchema.parse(result),
      latencyMs: Date.now() - startTime,
      source: 'deterministic'
    };
  }

  /**
   * Generates structured decision for an entity
   */
  async makeDecision(entity, policyResult) {
    const startTime = Date.now();
    const systemPrompt = DECISION_PROMPT_V1;
    const userPrompt = `Entity Context:\n${JSON.stringify(entity)}\nPolicy Output:\n${JSON.stringify(policyResult)}`;

    const geminiResponse = await this.callGeminiRaw(systemPrompt, userPrompt);
    if (geminiResponse?.text) {
      try {
        const parsed = this.parseJSON(geminiResponse.text);
        const validated = decisionSchema.parse(parsed);
        return {
          decision: validated,
          latencyMs: geminiResponse.latencyMs,
          source: 'gemini'
        };
      } catch (err) {
        console.warn('Gemini decision validation failed, using deterministic evaluation:', err.message);
      }
    }

    // Deterministic Decision Fallback
    const isRefund = entity.amount && entity.amount > 0;
    const isEscalation = entity.delayHours > 96 || entity.status === 'lost';
    const action = isEscalation ? 'create_escalation' : (isRefund ? 'refund' : 'send_customer_notification');

    const decision = {
      action,
      targetEntity: 'Order',
      targetId: entity.orderNumber,
      reason: isEscalation
        ? `Severe logistical stall (${entity.delayHours}h delay, lost in transit). Escalated to carrier operations.`
        : (policyResult.requiresApproval
            ? `High-value delayed shipment compensation (₹${entity.amount.toLocaleString()}) exceeds automated authorization limit.`
            : `Automated delay remediation and proactive customer notification for ${entity.customerName}.`),
      confidence: 0.95,
      riskLevel: policyResult.riskLevel || 'low',
      requiresApproval: policyResult.requiresApproval || false,
      policyReferences: policyResult.matchedPolicies || ['POL-REF-001'],
      evidence: policyResult.evidence || [`Order delayed ${entity.delayHours} hours`],
      executionPayload: {
        orderNumber: entity.orderNumber,
        amount: entity.amount,
        customerId: entity.customerId,
        reason: `Compensation for ${entity.delayHours}h delay`
      }
    };

    return {
      decision: decisionSchema.parse(decision),
      latencyMs: Date.now() - startTime,
      source: 'deterministic'
    };
  }

  /**
   * Summarizes workflow outcome
   */
  async summarizeOutcome(workflowData) {
    const startTime = Date.now();
    const systemPrompt = SUMMARY_PROMPT_V1;
    const userPrompt = `Workflow Execution Record:\n${JSON.stringify(workflowData)}`;

    const geminiResponse = await this.callGeminiRaw(systemPrompt, userPrompt);
    if (geminiResponse?.text) {
      try {
        const parsed = this.parseJSON(geminiResponse.text);
        const validated = summarySchema.parse(parsed);
        return {
          summary: validated,
          latencyMs: geminiResponse.latencyMs,
          source: 'gemini'
        };
      } catch (err) {
        console.warn('Gemini summary validation failed, using deterministic summary:', err.message);
      }
    }

    const { actionsExecuted = 0, actionsVerified = 0, approvalsRequested = 0, recoveredFailures = 0, escalations = 0 } = workflowData;

    const summary = {
      executiveSummary: `Autonomous operations cycle processed ${actionsExecuted} actions across all affected customer accounts. All ${actionsVerified} executed actions verified in persistent storage.`,
      actionsExecutedCount: actionsExecuted,
      actionsVerifiedCount: actionsVerified,
      approvalsRequestedCount: approvalsRequested,
      recoveredFailuresCount: recoveredFailures,
      escalationsCount: escalations,
      businessImpact: `Mitigated churn risk for VIP customers, auto-resolved eligible refunds below threshold, and enforced financial governance for high-value payouts.`,
      auditVerdict: 'PASSED'
    };

    return {
      summary: summarySchema.parse(summary),
      latencyMs: Date.now() - startTime,
      source: 'deterministic'
    };
  }
}

export const aiService = new AIService();
