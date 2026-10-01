// Vercel Serverless Function: Unified OpsPilot AI API Engine
// Handles all /api/* requests with zero external DB dependencies for seamless cloud deployment

const INITIAL_USERS = [
  { id: 'usr_admin_1', username: 'admin', email: 'admin@opspilot.ai', role: 'admin', department: 'Executive Operations' },
  { id: 'usr_manager_1', username: 'manager_rahul', email: 'manager@opspilot.ai', role: 'manager', department: 'Escalations & Approvals' },
  { id: 'usr_operator_1', username: 'operator_sneha', email: 'operator@opspilot.ai', role: 'operator', department: 'Customer Fulfillment' },
  { id: 'usr_viewer_1', username: 'viewer_guest', email: 'viewer@opspilot.ai', role: 'viewer', department: 'Audit & Compliance' }
];

const INITIAL_ORDERS = [
  { _id: 'ord_1042', orderNumber: 'ORD-1042', customerName: 'Amit Sharma', customerEmail: 'amit.sharma@example.com', itemName: 'AirPro Max Active Noise Cancelling Headphones', amount: 15000, status: 'delayed', delayHours: 72, isVip: true },
  { _id: 'ord_1015', orderNumber: 'ORD-1015', customerName: 'Priya Patel', customerEmail: 'priya.patel@example.com', itemName: 'ErgoPrecision Wireless Vertical Mouse', amount: 3200, status: 'delayed', delayHours: 36, isVip: false },
  { _id: 'ord_1088', orderNumber: 'ORD-1088', customerName: 'Rajesh Verma', customerEmail: 'rajesh.verma@example.com', itemName: 'UltraView 34" Curved OLED Monitor', amount: 48000, status: 'delayed', delayHours: 96, isVip: true },
  { _id: 'ord_1032', orderNumber: 'ORD-1032', customerName: 'Sneha Reddy', customerEmail: 'sneha.reddy@example.com', itemName: 'Mechanical Tactile RGB Keyboard', amount: 4500, status: 'delayed', delayHours: 48, isVip: false },
  { _id: 'ord_1099', orderNumber: 'ORD-1099', customerName: 'Vikram Singhania', customerEmail: 'vikram.s@example.com', itemName: 'LightningFast 2TB Gen5 NVMe SSD', amount: 18500, status: 'delayed', delayHours: 54, isVip: true },
  { _id: 'ord_1001', orderNumber: 'ORD-1001', customerName: 'Ananya Roy', customerEmail: 'ananya.roy@example.com', itemName: '10-in-1 Thunderbolt 4 Docking Station', amount: 4999, status: 'delivered', delayHours: 0, isVip: false }
];

const INITIAL_POLICIES = [
  { _id: 'pol_1', code: 'POL-REF-001', name: 'Automatic Refund Threshold', category: 'refund', thresholdValue: 5000, active: true, description: 'Refunds under or equal to ₹5,000 for delayed shipments are processed automatically.' },
  { _id: 'pol_2', code: 'POL-REF-002', name: 'High-Value Refund Manager Approval', category: 'refund', thresholdValue: 5000, active: true, description: 'Refund requests exceeding ₹5,000 strictly mandate human operations manager approval before execution.' },
  { _id: 'pol_3', code: 'POL-VIP-001', name: 'VIP Priority Escalation SLA', category: 'escalation', thresholdValue: 24, active: true, description: 'VIP tier customer delivery delays exceeding 24 hours trigger automated priority courier dispatch.' },
  { _id: 'pol_4', code: 'POL-INV-001', name: 'Critical Stock Safety Buffer', category: 'inventory', thresholdValue: 15, active: true, description: 'When SKU inventory drops below 15 units, generate automatic supplier purchase requisition.' },
  { _id: 'pol_5', code: 'POL-RETRY-001', name: 'Logistics Courier Timeout Resilience', category: 'resilience', thresholdValue: 3, active: true, description: 'Transient 3rd-party logistics API gateway failures automatically retry up to 3 times with exponential backoff.' },
  { _id: 'pol_6', code: 'POL-IDEM-001', name: 'Idempotency Lock & Double-Action Safeguard', category: 'safety', thresholdValue: 300, active: true, description: 'Prevents double-refunds or duplicate shipments within a 5-minute lock window.' }
];

const INITIAL_WORKFLOWS = [
  {
    _id: 'wf_1042',
    goal: 'Resolve delayed VIP shipment ORD-1042 for Amit Sharma (Over 72 hours delayed)',
    status: 'AWAITING_APPROVAL',
    initiator: { username: 'manager_rahul', role: 'manager' },
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    currentStage: 'HUMAN_APPROVAL',
    metrics: { totalSteps: 5, completedSteps: 2, executionTimeMs: 1420 },
    steps: [
      { stepIndex: 1, agentName: 'Planner Agent', status: 'COMPLETED', description: 'Decomposed goal into investigation, policy evaluation, and compensation steps.' },
      { stepIndex: 2, agentName: 'Policy Engine', status: 'COMPLETED', description: 'Evaluated POL-REF-002: Order amount ₹15,000 exceeds ₹5,000 threshold. Mandates manager approval.' },
      { stepIndex: 3, agentName: 'Orchestrator Agent', status: 'AWAITING_APPROVAL', description: 'Execution paused. Routed evidence card to Manager Approval Center.' },
      { stepIndex: 4, agentName: 'Verification Agent', status: 'PENDING', description: 'Awaiting refund execution to verify ledger credit and inventory balance.' },
      { stepIndex: 5, agentName: 'Notification Agent', status: 'PENDING', description: 'Send SMS & WhatsApp VIP apology dispatch to Amit Sharma.' }
    ]
  },
  {
    _id: 'wf_1015',
    goal: 'Auto-resolve delayed standard order ORD-1015 (Priya Patel, ₹3,200 under ₹5,000 policy threshold)',
    status: 'COMPLETED',
    initiator: { username: 'system_autonomous', role: 'operator' },
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    currentStage: 'COMPLETED',
    metrics: { totalSteps: 5, completedSteps: 5, executionTimeMs: 980 },
    steps: [
      { stepIndex: 1, agentName: 'Planner Agent', status: 'COMPLETED', description: 'Decomposed goal: Investigate shipment delay and issue auto-refund under threshold.' },
      { stepIndex: 2, agentName: 'Policy Engine', status: 'COMPLETED', description: 'POL-REF-001 satisfied: Amount ₹3,200 is within ₹5,000 auto-approval limit.' },
      { stepIndex: 3, agentName: 'Action Agent', status: 'COMPLETED', description: 'Processed UPI refund transaction TXN-998231 via Razorpay sandbox.' },
      { stepIndex: 4, agentName: 'Verification Agent', status: 'COMPLETED', description: 'Read-after-write verification: Verified bank settlement status CONFIRMED.' },
      { stepIndex: 5, agentName: 'Notification Agent', status: 'COMPLETED', description: 'Sent email confirmation and ₹200 apology coupon to priya.patel@example.com.' }
    ]
  }
];

const INITIAL_APPROVALS = [
  {
    _id: 'appr_1042',
    workflowId: 'wf_1042',
    orderNumber: 'ORD-1042',
    actionType: 'issue_refund',
    targetAmount: 15000,
    currency: 'INR',
    riskLevel: 'HIGH',
    status: 'pending',
    reason: 'Policy POL-REF-002: Refund amount ₹15,000 exceeds ₹5,000 automated limit. VIP customer delayed > 72 hours.',
    evidence: {
      customerTier: 'VIP',
      customerName: 'Amit Sharma',
      delayHours: 72,
      itemSku: 'SKU-HEADSET-PRO',
      itemName: 'AirPro Max Active Noise Cancelling Headphones',
      recommendedAction: 'Approve full refund of ₹15,000 and issue complimentary 1-year VIP status extension.'
    },
    requestedAt: new Date(Date.now() - 3600000).toISOString()
  }
];

// Ephemeral in-memory state for serverless instances
let users = [...INITIAL_USERS];
let orders = [...INITIAL_ORDERS];
let policies = [...INITIAL_POLICIES];
let workflows = [...INITIAL_WORKFLOWS];
let approvals = [...INITIAL_APPROVALS];

export default async function handler(req, res) {
  // Global CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const rawUrl = req.url || '';
  const cleanUrl = rawUrl.replace(/^\/api/, '');
  const [path, queryString] = cleanUrl.split('?');
  const params = new URLSearchParams(queryString || '');
  const method = (req.method || 'GET').toUpperCase();
  const body = req.body || {};

  // HEALTH CHECK
  if (path === '/health') {
    return res.status(200).json({ status: 'ok', service: 'OpsPilot AI Serverless Engine', timestamp: new Date().toISOString() });
  }

  // AUTH: REGISTER
  if (path === '/auth/register' && method === 'POST') {
    const { username, email, role } = body;
    const newUser = {
      id: `usr_${Date.now()}`,
      username: username || 'new_operator',
      email: email || 'user@opspilot.ai',
      role: role || 'operator',
      department: 'Operations'
    };
    users.push(newUser);
    return res.status(200).json({
      success: true,
      data: {
        token: `mock_jwt_${newUser.role}_${Date.now()}`,
        user: newUser
      }
    });
  }

  // AUTH: LOGIN
  if (path === '/auth/login' && method === 'POST') {
    const { email } = body;
    const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || users[0];
    return res.status(200).json({
      success: true,
      data: {
        token: `mock_jwt_${user.role}_${Date.now()}`,
        user
      }
    });
  }

  // AUTH: ME
  if (path === '/auth/me') {
    return res.status(200).json({ success: true, data: { user: users[0] } });
  }

  // ASSISTANT CHATBOT
  if (path === '/assistant' && method === 'POST') {
    const message = (body.message || body.query || '').toLowerCase();
    let reply = '';
    let suggestedGoal = 'Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval.';
    let suggestedLink = '/dashboard';

    if (message.includes('delayed') || message.includes('order')) {
      reply = `There are currently **${orders.filter(o => o.status === 'delayed').length} delayed shipments**. High priority: **ORD-1042** (Amit Sharma, VIP, delayed 72h, ₹15,000) and **ORD-1088** (Rajesh Verma, Enterprise, delayed 96h, ₹48,000).`;
      suggestedGoal = 'Investigate and resolve delayed VIP order ORD-1042 for Amit Sharma.';
      suggestedLink = '/orders';
    } else if (message.includes('approval') || message.includes('policy') || message.includes('threshold') || message.includes('5k')) {
      reply = `Under deterministic policy **POL-REF-002**, any refund or replacement over **₹5,000** strictly requires human operations manager authorization to safeguard business capital. Automated refunds under ₹5,000 process instantly via **POL-REF-001**.`;
      suggestedGoal = 'Inspect and approve high-value refund for delayed order ORD-1042.';
      suggestedLink = '/approvals';
    } else if (message.includes('inventory') || message.includes('stock')) {
      reply = `The inventory radar tracks **3 at-risk SKUs** nearing threshold. Critical item: **UltraView 34" Curved Monitor** (Only 3 units left in Delhi Hub).`;
      suggestedGoal = 'Auto-reorder critical low stock inventory SKUs from supplier.';
      suggestedLink = '/inventory';
    } else {
      reply = `Hello! I am your **OpsPilot AI Copilot**. I supervise autonomous multi-agent workflows, enforce deterministic policy governance, and manage Human-in-the-Loop approvals.\n\nYou can ask me about delayed shipments, policy rules, pending approvals, or click below to launch an autonomous operations goal directly.`;
      suggestedGoal = 'Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000.';
      suggestedLink = '/dashboard';
    }

    return res.status(200).json({
      success: true,
      data: {
        reply,
        response: reply,
        suggestedGoal,
        suggestedLink,
        telemetry: {
          delayedOrders: orders.filter(o => o.status === 'delayed').length,
          activeWorkflows: workflows.length,
          pendingApprovals: approvals.filter(a => a.status === 'pending').length,
          riskInventory: 3
        }
      }
    });
  }

  // ANALYTICS
  if (path === '/analytics') {
    return res.status(200).json({
      success: true,
      data: {
        totalWorkflows: workflows.length,
        completedWorkflows: workflows.filter(w => w.status === 'COMPLETED').length,
        failedWorkflows: 0,
        escalatedWorkflows: 1,
        awaitingApprovalWorkflows: workflows.filter(w => w.status === 'AWAITING_APPROVAL').length,
        totalActions: 48,
        verifiedActions: 47,
        pendingApprovals: approvals.filter(a => a.status === 'pending').length,
        approvedApprovals: 6,
        totalOrders: orders.length,
        delayedOrdersCount: orders.filter(o => o.status === 'delayed').length,
        automationRate: 88.5,
        verificationSuccessRate: 98.4,
        failureRecoveryRate: 94.2,
        avgResolutionTimeMs: 1420,
        volumeTimeline: [
          { time: '09:00', workflows: 4, automated: 4, humanReview: 0 },
          { time: '10:00', workflows: 8, automated: 7, humanReview: 1 },
          { time: '11:00', workflows: 15, automated: 13, humanReview: 2 },
          { time: '12:00', workflows: 12, automated: 11, humanReview: 1 },
          { time: '13:00', workflows: 19, automated: 17, humanReview: 2 },
          { time: '14:00', workflows: 22, automated: 20, humanReview: 2 }
        ],
        agentBreakdown: [
          { name: 'Planner Agent', calls: 38, avgDurationMs: 310 },
          { name: 'Investigation Agent', calls: 86, avgDurationMs: 145 },
          { name: 'Policy Engine', calls: 92, avgDurationMs: 42 },
          { name: 'Decision Agent', calls: 84, avgDurationMs: 280 },
          { name: 'Action Agent', calls: 65, avgDurationMs: 190 },
          { name: 'Verification Agent', calls: 61, avgDurationMs: 115 },
          { name: 'Recovery Agent', calls: 14, avgDurationMs: 520 }
        ]
      }
    });
  }

  // WORKFLOWS: GET & POST
  if (path === '/workflows' && method === 'GET') {
    return res.status(200).json({ success: true, data: { count: workflows.length, workflows } });
  }

  if (path === '/workflows' && method === 'POST') {
    const { goal } = body;
    const isHighValue = /15000|48000|ORD-1042|ORD-1088|refund.*high|expensive/i.test(goal || '');
    const newWf = {
      _id: `wf_${Date.now()}`,
      goal: goal || 'Autonomous Operations Goal',
      status: isHighValue ? 'AWAITING_APPROVAL' : 'COMPLETED',
      initiator: { username: 'manager_rahul', role: 'manager' },
      createdAt: new Date().toISOString(),
      currentStage: isHighValue ? 'HUMAN_APPROVAL' : 'COMPLETED',
      metrics: { totalSteps: 5, completedSteps: isHighValue ? 2 : 5, executionTimeMs: 1420 },
      steps: [
        { stepIndex: 1, agentName: 'Planner Agent', status: 'COMPLETED', description: 'Decomposed goal into operational tasks.' },
        { stepIndex: 2, agentName: 'Policy Engine', status: 'COMPLETED', description: isHighValue ? 'POL-REF-002: Amount exceeds ₹5,000 limit. Mandates manager sign-off.' : 'POL-REF-001 satisfied: Action within automatic limit.' },
        { stepIndex: 3, agentName: 'Action Agent', status: isHighValue ? 'AWAITING_APPROVAL' : 'COMPLETED', description: isHighValue ? 'Execution paused. Routed evidence card to Manager Review Queue.' : 'Processed automated refund and customer notification.' },
        { stepIndex: 4, agentName: 'Verification Agent', status: isHighValue ? 'PENDING' : 'COMPLETED', description: 'Read-after-write verification on database state.' },
        { stepIndex: 5, agentName: 'Notification Agent', status: isHighValue ? 'PENDING' : 'COMPLETED', description: 'Customer notification dispatch.' }
      ]
    };
    workflows.unshift(newWf);
    return res.status(200).json({ success: true, data: { workflow: newWf } });
  }

  const singleWf = path.match(/^\/workflows\/([^/]+)$/);
  if (singleWf) {
    const wf = workflows.find(w => w._id === singleWf[1]) || workflows[0];
    const app = approvals.find(a => a.workflowId === wf._id);
    return res.status(200).json({ success: true, data: { workflow: wf, approval: app, steps: wf.steps || [], agentLogs: [] } });
  }

  // APPROVALS
  if (path === '/approvals' && method === 'GET') {
    return res.status(200).json({ success: true, data: { count: approvals.length, approvals } });
  }

  const decisionMatch = path.match(/^\/approvals\/([^/]+)\/(approve|reject)$/);
  if (decisionMatch && method === 'POST') {
    const apprId = decisionMatch[1];
    const decision = decisionMatch[2];
    const appr = approvals.find(a => a._id === apprId);
    if (appr) {
      appr.status = decision === 'approve' ? 'approved' : 'rejected';
      const wf = workflows.find(w => w._id === appr.workflowId);
      if (wf) wf.status = decision === 'approve' ? 'COMPLETED' : 'REJECTED';
    }
    return res.status(200).json({ success: true, data: { approval: appr } });
  }

  // ORDERS
  if (path === '/orders') {
    return res.status(200).json({ success: true, data: { count: orders.length, orders } });
  }

  // CUSTOMERS
  if (path === '/customers') {
    return res.status(200).json({
      success: true,
      data: {
        count: 3,
        customers: [
          { customerId: 'CUST-8001', name: 'Amit Sharma', email: 'amit.sharma@example.com', tier: 'VIP', lifetimeValue: 185000, totalOrders: 14, healthScore: 82 },
          { customerId: 'CUST-8002', name: 'Priya Patel', email: 'priya.patel@example.com', tier: 'Standard', lifetimeValue: 24500, totalOrders: 4, healthScore: 94 },
          { customerId: 'CUST-8003', name: 'Rajesh Verma', email: 'rajesh.verma@example.com', tier: 'Enterprise', lifetimeValue: 420000, totalOrders: 28, healthScore: 71 }
        ]
      }
    });
  }

  // INVENTORY
  if (path === '/inventory') {
    return res.status(200).json({
      success: true,
      data: {
        count: 3,
        items: [
          { sku: 'SKU-HEADSET-PRO', name: 'AirPro Max Active Noise Cancelling Headphones', stockQuantity: 8, reorderLevel: 20, status: 'low_stock', unitPrice: 15000 },
          { sku: 'SKU-DISP-4K', name: 'UltraView 34" Curved OLED Monitor', stockQuantity: 3, reorderLevel: 10, status: 'critical', unitPrice: 48000 },
          { sku: 'SKU-MOUSE-ERG', name: 'ErgoPrecision Wireless Vertical Mouse', stockQuantity: 42, reorderLevel: 15, status: 'in_stock', unitPrice: 3200 }
        ]
      }
    });
  }

  // POLICIES
  if (path === '/policies') {
    return res.status(200).json({ success: true, data: { count: policies.length, policies } });
  }

  const togglePolicy = path.match(/^\/policies\/([^/]+)\/toggle$/);
  if (togglePolicy && method === 'PATCH') {
    const pol = policies.find(p => p._id === togglePolicy[1] || p.code === togglePolicy[1]);
    if (pol) pol.active = !pol.active;
    return res.status(200).json({ success: true, data: { policy: pol } });
  }

  // NOTIFICATIONS
  if (path === '/notifications') {
    return res.status(200).json({
      success: true,
      data: {
        count: 2,
        unreadCount: 2,
        notifications: [
          { _id: 'notif_1', type: 'approval_required', title: 'Manager Approval Required: Refund ₹15,000', message: 'High-value refund policy threshold (₹5,000) exceeded for delayed order ORD-1042.', severity: 'error', read: false },
          { _id: 'notif_2', type: 'vip_issue_detected', title: 'VIP Shipment Delayed: Amit Sharma (ORD-1042)', message: 'Shipment delayed by 72 hours in Mumbai transit hub.', severity: 'warning', read: false }
        ]
      }
    });
  }

  // AGENTS ACTIVITY
  if (path === '/agents/activity') {
    return res.status(200).json({
      success: true,
      data: {
        count: 4,
        activity: [
          { _id: 'act_1', agentName: 'Planner Agent', action: 'GOAL_DECOMPOSITION', details: 'Decomposed delayed shipment goal into 5 dependency-linked tasks.', status: 'SUCCESS', timestamp: new Date().toISOString() },
          { _id: 'act_2', agentName: 'Policy Engine', action: 'RULE_EVALUATION', details: 'Enforced POL-REF-002: Checked order value against ₹5,000 threshold.', status: 'SUCCESS', timestamp: new Date(Date.now() - 30000).toISOString() },
          { _id: 'act_3', agentName: 'Verification Agent', action: 'READ_AFTER_WRITE', details: 'Verified database write consistency for transaction TXN-998231.', status: 'SUCCESS', timestamp: new Date(Date.now() - 60000).toISOString() },
          { _id: 'act_4', agentName: 'Recovery Agent', action: 'EXPONENTIAL_BACKOFF', details: 'Recovered Delhivery courier webhook after 504 timeout.', status: 'SUCCESS', timestamp: new Date(Date.now() - 120000).toISOString() }
        ]
      }
    });
  }

  // RESET
  if (path === '/demo/reset' && method === 'POST') {
    users = [...INITIAL_USERS];
    orders = [...INITIAL_ORDERS];
    policies = [...INITIAL_POLICIES];
    workflows = [...INITIAL_WORKFLOWS];
    approvals = [...INITIAL_APPROVALS];
    return res.status(200).json({ success: true, message: 'Demo dataset reset successfully.' });
  }

  // CATCH-ALL
  return res.status(200).json({ success: true, data: { message: 'OpsPilot API Serverless Gateway', path, method } });
}
