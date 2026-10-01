import { test, before, after, describe } from 'node:test';
import assert from 'node:assert/strict';
import { connectDB, disconnectDB } from '../config/db.js';
import { seedDatabase } from '../seed/seed.js';
import { User } from '../models/User.js';
import { Policy } from '../models/Policy.js';
import { Order } from '../models/Order.js';
import { generateToken } from '../middleware/auth.js';
import { PolicyEngine } from '../policies/policyEngine.js';
import { executeTool } from '../tools/toolRegistry.js';
import { WorkflowEngine } from '../orchestrator/workflowEngine.js';
import { Workflow } from '../models/Workflow.js';
import { Action } from '../models/Action.js';

describe('OpsPilot AI Autonomous System Tests', () => {
  before(async () => {
    await connectDB();
    await seedDatabase();
  });

  after(async () => {
    await disconnectDB();
  });

  // 1. Auth & Security Tests
  test('Auth: User password hashing and verification', async () => {
    const adminUser = await User.findOne({ email: 'admin@opspilot.ai' });
    assert.ok(adminUser, 'Admin user should exist in DB');
    const isCorrect = await adminUser.comparePassword('Admin@123456');
    assert.equal(isCorrect, true, 'Valid password should verify');
    const isWrong = await adminUser.comparePassword('WrongPassword');
    assert.equal(isWrong, false, 'Invalid password must fail verification');

    const token = generateToken(adminUser._id, adminUser.role);
    assert.ok(typeof token === 'string' && token.length > 20, 'JWT token must be generated');
  });

  // 2. Policy Engine Deterministic Tests
  test('Policy Engine: Enforces ₹5,000 threshold deterministically', async () => {
    // Under threshold: ₹2,499
    const lowValueOrder = await Order.findOne({ orderNumber: 'ORD-1001' });
    const lowResult = await PolicyEngine.evaluateAction({
      proposedAction: 'refund',
      order: lowValueOrder,
      amount: lowValueOrder.amount
    });

    assert.equal(lowResult.allowed, true, 'Low value refund must be allowed');
    assert.equal(lowResult.requiresApproval, false, 'Refund <= ₹5,000 must NOT require approval');
    assert.equal(lowResult.policy, 'POL-REF-001');

    // Over threshold: ₹15,000
    const highValueOrder = await Order.findOne({ orderNumber: 'ORD-1042' });
    const highResult = await PolicyEngine.evaluateAction({
      proposedAction: 'refund',
      order: highValueOrder,
      amount: highValueOrder.amount
    });

    assert.equal(highResult.allowed, true);
    assert.equal(highResult.requiresApproval, true, 'Refund > ₹5,000 MUST require manager approval');
    assert.equal(highResult.riskLevel, 'high');
    assert.equal(highResult.policy, 'POL-REF-002');
  });

  // 3. Tool Registry Validation & Idempotency Tests
  test('Tool Registry: Zod parameter validation and idempotency protection', async () => {
    // Validation error on missing required params
    await assert.rejects(
      async () => {
        await executeTool('getOrder', {});
      },
      /Tool validation failed/
    );

    // Controlled query tool execution
    const delayedResult = await executeTool('getDelayedOrders', { minDelayHours: 0, limit: 10 });
    assert.equal(delayedResult.success, true);
    assert.ok(delayedResult.data.count > 0, 'Should find delayed orders');

    // Idempotency: execute refund once then replay with same idempotencyKey
    const testOrderNumber = 'ORD-1003';
    const testKey = `IDEMP-TEST-${Date.now()}`;
    const firstExec = await executeTool('createRefund', {
      orderNumber: testOrderNumber,
      amount: 1899,
      reason: 'Automated delayed shipment refund',
      idempotencyKey: testKey
    });

    assert.equal(firstExec.data.status, 'PROCESSED');

    // Second execution with same idempotency key
    const secondExec = await executeTool('createRefund', {
      orderNumber: testOrderNumber,
      amount: 1899,
      reason: 'Automated delayed shipment refund duplicate attempt',
      idempotencyKey: testKey
    });

    assert.equal(secondExec.data.idempotentReplay, true, 'Duplicate execution must be blocked by idempotency key');
  });

  // 4. Verification Agent Database Query Test
  test('Verification Agent: Directly verifies persistent database state', async () => {
    const vResult = await executeTool('verifyRefund', {
      orderNumber: 'ORD-1003',
      expectedAmount: 1899
    });

    assert.equal(vResult.data.verified, true, 'Should verify that order status changed to refunded in MongoDB');
    assert.equal(vResult.data.databaseState.refundAmount, 1899);
  });

  // 5. Full Autonomous Workflow Execution Test
  test('Workflow Engine: Autonomous Goal-to-Execution lifecycle', async () => {
    const goal = 'Resolve delayed orders for standard customers under ₹5,000 threshold';
    const workflow = await WorkflowEngine.startWorkflow({ goal });

    assert.ok(workflow._id, 'Workflow record should be created');
    assert.equal(workflow.status, 'CREATED');

    // Wait 2.5s for asynchronous agents to execute plan, investigate, check policies, and execute
    await new Promise(r => setTimeout(r, 2500));

    const updatedWorkflow = await Workflow.findById(workflow._id);
    assert.ok(
      ['COMPLETED', 'AWAITING_APPROVAL', 'EXECUTING'].includes(updatedWorkflow.status),
      `Workflow status should progress, current: ${updatedWorkflow.status}`
    );
    assert.ok(updatedWorkflow.plan, 'Plan must be populated');
    assert.ok(updatedWorkflow.plan.tasks.length > 0, 'Plan must have decomposition tasks');
  });
});
