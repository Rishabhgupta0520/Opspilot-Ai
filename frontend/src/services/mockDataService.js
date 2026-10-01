// OpsPilot AI — In-Memory High-Fidelity Client Simulation Service
// Ensures the web app functions with 100% interactivity even in serverless or static demo deployments

const STORAGE_KEY = 'opspilot_mock_db_v1';

const INITIAL_USERS = [
  {
    id: 'usr_admin_1',
    username: 'admin',
    email: 'admin@opspilot.ai',
    role: 'admin',
    department: 'Executive Operations'
  },
  {
    id: 'usr_manager_1',
    username: 'manager_rahul',
    email: 'manager@opspilot.ai',
    role: 'manager',
    department: 'Escalations & Approvals'
  },
  {
    id: 'usr_operator_1',
    username: 'operator_sneha',
    email: 'operator@opspilot.ai',
    role: 'operator',
    department: 'Customer Fulfillment'
  },
  {
    id: 'usr_viewer_1',
    username: 'viewer_guest',
    email: 'viewer@opspilot.ai',
    role: 'viewer',
    department: 'Audit & Compliance'
  }
];

const INITIAL_POLICIES = [
  {
    _id: 'pol_1',
    code: 'POL-REF-001',
    name: 'Automatic Refund Threshold',
    category: 'refund',
    thresholdValue: 5000,
    rules: { maxAmount: 5000, eligibleStatuses: ['delayed', 'lost'], requiresApprovalAbove: 5000 },
    active: true,
    description: 'Refunds under or equal to ₹5,000 for delayed or lost shipments are processed automatically.',
    requiresApproval: false,
    priority: 1
  },
  {
    _id: 'pol_2',
    code: 'POL-REF-002',
    name: 'High-Value Refund Manager Approval',
    category: 'refund',
    thresholdValue: 5000,
    rules: { minAmount: 5000.01, requiredApproverRole: 'manager' },
    active: true,
    description: 'Refund requests exceeding ₹5,000 strictly mandate human operations manager approval before execution.',
    requiresApproval: true,
    priority: 2
  },
  {
    _id: 'pol_3',
    code: 'POL-VIP-001',
    name: 'VIP Priority Escalation SLA',
    category: 'escalation',
    thresholdValue: 24,
    rules: { maxDelayHours: 24, priorityShippingCourier: 'BlueDart Express' },
    active: true,
    description: 'VIP tier customer delivery delays exceeding 24 hours trigger automated priority courier dispatch.',
    requiresApproval: false,
    priority: 3
  },
  {
    _id: 'pol_4',
    code: 'POL-INV-001',
    name: 'Critical Stock Safety Buffer',
    category: 'inventory',
    thresholdValue: 15,
    rules: { minStockLevel: 15, autoReorderQuantity: 100 },
    active: true,
    description: 'When SKU inventory drops below 15 units, generate automatic supplier purchase requisition.',
    requiresApproval: false,
    priority: 4
  },
  {
    _id: 'pol_5',
    code: 'POL-RETRY-001',
    name: 'Logistics Courier Timeout Resilience',
    category: 'resilience',
    thresholdValue: 3,
    rules: { maxRetries: 3, backoffMultiplier: 2 },
    active: true,
    description: 'Transient 3rd-party logistics API gateway failures automatically retry up to 3 times with exponential backoff.',
    requiresApproval: false,
    priority: 5
  },
  {
    _id: 'pol_6',
    code: 'POL-IDEM-001',
    name: 'Idempotency Lock & Double-Action Safeguard',
    category: 'safety',
    thresholdValue: 300,
    rules: { tokenTtlSeconds: 300 },
    active: true,
    description: 'Prevents double-refunds or duplicate shipments within a 5-minute lock window using unique action tokens.',
    requiresApproval: false,
    priority: 6
  }
];

const INITIAL_ORDERS = [
  {
    _id: 'ord_1042',
    orderNumber: 'ORD-1042',
    customerId: 'CUST-8001',
    customerName: 'Amit Sharma',
    customerEmail: 'amit.sharma@example.com',
    customerPhone: '+91-98765-43210',
    itemSku: 'SKU-HEADSET-PRO',
    itemName: 'AirPro Max Active Noise Cancelling Headphones',
    amount: 15000,
    status: 'delayed',
    delayHours: 72,
    isVip: true,
    shippingAddress: { city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
    createdAt: '2026-09-28T10:00:00Z'
  },
  {
    _id: 'ord_1015',
    orderNumber: 'ORD-1015',
    customerId: 'CUST-8002',
    customerName: 'Priya Patel',
    customerEmail: 'priya.patel@example.com',
    customerPhone: '+91-98111-22334',
    itemSku: 'SKU-MOUSE-ERG',
    itemName: 'ErgoPrecision Wireless Vertical Mouse',
    amount: 3200,
    status: 'delayed',
    delayHours: 36,
    isVip: false,
    shippingAddress: { city: 'Bengaluru', state: 'Karnataka', pincode: '560001' },
    createdAt: '2026-09-29T14:30:00Z'
  },
  {
    _id: 'ord_1088',
    orderNumber: 'ORD-1088',
    customerId: 'CUST-8003',
    customerName: 'Rajesh Verma',
    customerEmail: 'rajesh.verma@example.com',
    customerPhone: '+91-99887-76655',
    itemSku: 'SKU-DISP-4K',
    itemName: 'UltraView 34" Curved OLED Monitor',
    amount: 48000,
    status: 'delayed',
    delayHours: 96,
    isVip: true,
    shippingAddress: { city: 'Delhi', state: 'Delhi', pincode: '110001' },
    createdAt: '2026-09-27T08:15:00Z'
  },
  {
    _id: 'ord_1032',
    orderNumber: 'ORD-1032',
    customerId: 'CUST-8004',
    customerName: 'Sneha Reddy',
    customerEmail: 'sneha.reddy@example.com',
    customerPhone: '+91-97234-56789',
    itemSku: 'SKU-KBD-MECH',
    itemName: 'Mechanical Tactile RGB Keyboard',
    amount: 4500,
    status: 'delayed',
    delayHours: 48,
    isVip: false,
    shippingAddress: { city: 'Hyderabad', state: 'Telangana', pincode: '500001' },
    createdAt: '2026-09-29T11:20:00Z'
  },
  {
    _id: 'ord_1099',
    orderNumber: 'ORD-1099',
    customerId: 'CUST-8005',
    customerName: 'Vikram Singhania',
    customerEmail: 'vikram.s@example.com',
    customerPhone: '+91-96543-21098',
    itemSku: 'SKU-NVME-2TB',
    itemName: 'LightningFast 2TB Gen5 NVMe SSD',
    amount: 18500,
    status: 'delayed',
    delayHours: 54,
    isVip: true,
    shippingAddress: { city: 'Pune', state: 'Maharashtra', pincode: '411001' },
    createdAt: '2026-09-28T16:45:00Z'
  },
  {
    _id: 'ord_1001',
    orderNumber: 'ORD-1001',
    customerId: 'CUST-8006',
    customerName: 'Ananya Roy',
    customerEmail: 'ananya.roy@example.com',
    customerPhone: '+91-95432-10987',
    itemSku: 'SKU-USB-HUB',
    itemName: '10-in-1 Thunderbolt 4 Docking Station',
    amount: 4999,
    status: 'delivered',
    delayHours: 0,
    isVip: false,
    shippingAddress: { city: 'Kolkata', state: 'West Bengal', pincode: '700001' },
    createdAt: '2026-09-26T09:00:00Z'
  }
];

const INITIAL_CUSTOMERS = [
  {
    _id: 'c1',
    customerId: 'CUST-8001',
    name: 'Amit Sharma',
    email: 'amit.sharma@example.com',
    phone: '+91-98765-43210',
    tier: 'VIP',
    lifetimeValue: 185000,
    totalOrders: 14,
    healthScore: 82,
    city: 'Mumbai',
    state: 'Maharashtra'
  },
  {
    _id: 'c2',
    customerId: 'CUST-8002',
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    phone: '+91-98111-22334',
    tier: 'Standard',
    lifetimeValue: 24500,
    totalOrders: 4,
    healthScore: 94,
    city: 'Bengaluru',
    state: 'Karnataka'
  },
  {
    _id: 'c3',
    customerId: 'CUST-8003',
    name: 'Rajesh Verma',
    email: 'rajesh.verma@example.com',
    phone: '+91-99887-76655',
    tier: 'Enterprise',
    lifetimeValue: 420000,
    totalOrders: 28,
    healthScore: 71,
    city: 'Delhi',
    state: 'Delhi'
  },
  {
    _id: 'c4',
    customerId: 'CUST-8004',
    name: 'Sneha Reddy',
    email: 'sneha.reddy@example.com',
    phone: '+91-97234-56789',
    tier: 'Standard',
    lifetimeValue: 18000,
    totalOrders: 3,
    healthScore: 89,
    city: 'Hyderabad',
    state: 'Telangana'
  },
  {
    _id: 'c5',
    customerId: 'CUST-8005',
    name: 'Vikram Singhania',
    email: 'vikram.s@example.com',
    phone: '+91-96543-21098',
    tier: 'VIP',
    lifetimeValue: 290000,
    totalOrders: 19,
    healthScore: 76,
    city: 'Pune',
    state: 'Maharashtra'
  }
];

const INITIAL_INVENTORY = [
  {
    _id: 'inv_1',
    sku: 'SKU-HEADSET-PRO',
    name: 'AirPro Max Active Noise Cancelling Headphones',
    stockQuantity: 8,
    reorderLevel: 20,
    status: 'low_stock',
    unitPrice: 15000,
    warehouse: 'Mumbai Hub-1'
  },
  {
    _id: 'inv_2',
    sku: 'SKU-MOUSE-ERG',
    name: 'ErgoPrecision Wireless Vertical Mouse',
    stockQuantity: 42,
    reorderLevel: 15,
    status: 'in_stock',
    unitPrice: 3200,
    warehouse: 'Bengaluru Hub-2'
  },
  {
    _id: 'inv_3',
    sku: 'SKU-DISP-4K',
    name: 'UltraView 34" Curved OLED Monitor',
    stockQuantity: 3,
    reorderLevel: 10,
    status: 'critical',
    unitPrice: 48000,
    warehouse: 'Delhi Hub-1'
  },
  {
    _id: 'inv_4',
    sku: 'SKU-KBD-MECH',
    name: 'Mechanical Tactile RGB Keyboard',
    stockQuantity: 14,
    reorderLevel: 15,
    status: 'low_stock',
    unitPrice: 4500,
    warehouse: 'Hyderabad Hub-3'
  },
  {
    _id: 'inv_5',
    sku: 'SKU-NVME-2TB',
    name: 'LightningFast 2TB Gen5 NVMe SSD',
    stockQuantity: 28,
    reorderLevel: 12,
    status: 'in_stock',
    unitPrice: 18500,
    warehouse: 'Pune Hub-1'
  }
];

const INITIAL_WORKFLOWS = [
  {
    _id: 'wf_1042',
    goal: 'Resolve delayed VIP shipment ORD-1042 for Amit Sharma (Over 72 hours delayed)',
    status: 'AWAITING_APPROVAL',
    initiator: { username: 'manager_rahul', role: 'manager' },
    createdAt: '2026-10-01T04:15:00Z',
    updatedAt: '2026-10-01T04:16:30Z',
    currentStage: 'HUMAN_APPROVAL',
    metrics: { totalSteps: 5, completedSteps: 2, executionTimeMs: 1420 },
    steps: [
      {
        stepIndex: 1,
        agentName: 'Planner Agent',
        status: 'COMPLETED',
        description: 'Decomposed goal into investigation, policy evaluation, refund check, and notification tasks.',
        startedAt: '2026-10-01T04:15:01Z',
        completedAt: '2026-10-01T04:15:02Z',
        durationMs: 310
      },
      {
        stepIndex: 2,
        agentName: 'Policy Engine',
        status: 'COMPLETED',
        description: 'Evaluated POL-REF-002: Order amount ₹15,000 exceeds ₹5,000 threshold. Mandates human manager authorization.',
        startedAt: '2026-10-01T04:15:02Z',
        completedAt: '2026-10-01T04:15:03Z',
        durationMs: 42
      },
      {
        stepIndex: 3,
        agentName: 'Orchestrator Agent',
        status: 'AWAITING_APPROVAL',
        description: 'Execution paused. Routed evidence card to Manager Approval Center.',
        startedAt: '2026-10-01T04:15:03Z'
      },
      {
        stepIndex: 4,
        agentName: 'Verification Agent',
        status: 'PENDING',
        description: 'Awaiting refund execution to verify ledger credit and inventory reconciliation.'
      },
      {
        stepIndex: 5,
        agentName: 'Notification Agent',
        status: 'PENDING',
        description: 'Send SMS & WhatsApp VIP apology dispatch to Amit Sharma.'
      }
    ]
  },
  {
    _id: 'wf_1015',
    goal: 'Auto-resolve delayed standard order ORD-1015 (Priya Patel, ₹3,200 under ₹5,000 policy threshold)',
    status: 'COMPLETED',
    initiator: { username: 'system_autonomous', role: 'operator' },
    createdAt: '2026-10-01T03:30:00Z',
    updatedAt: '2026-10-01T03:30:02Z',
    currentStage: 'COMPLETED',
    metrics: { totalSteps: 5, completedSteps: 5, executionTimeMs: 980 },
    steps: [
      { stepIndex: 1, agentName: 'Planner Agent', status: 'COMPLETED', description: 'Decomposed goal: Investigate shipment delay and issue auto-refund under threshold.' },
      { stepIndex: 2, agentName: 'Policy Engine', status: 'COMPLETED', description: 'POL-REF-001 satisfied: Amount ₹3,200 is within ₹5,000 auto-approval limit.' },
      { stepIndex: 3, agentName: 'Action Agent', status: 'COMPLETED', description: 'Processed UPI refund transaction TXN-998231 via Razorpay sandbox.' },
      { stepIndex: 4, agentName: 'Verification Agent', status: 'COMPLETED', description: 'Read-after-write verification: Verified bank settlement status CONFIRMED.' },
      { stepIndex: 5, agentName: 'Notification Agent', status: 'COMPLETED', description: 'Sent email confirmation and ₹200 apology coupon to priya.patel@example.com.' }
    ]
  },
  {
    _id: 'wf_1032',
    goal: 'Self-healing recovery: Retry failed logistics courier webhook on order ORD-1032',
    status: 'COMPLETED',
    initiator: { username: 'system_autonomous', role: 'admin' },
    createdAt: '2026-10-01T02:00:00Z',
    updatedAt: '2026-10-01T02:00:04Z',
    currentStage: 'COMPLETED',
    metrics: { totalSteps: 4, completedSteps: 4, executionTimeMs: 1650 },
    steps: [
      { stepIndex: 1, agentName: 'Planner Agent', status: 'COMPLETED', description: 'Detected 504 Gateway Timeout from Delhivery carrier API.' },
      { stepIndex: 2, agentName: 'Recovery Agent', status: 'COMPLETED', description: 'Triggered POL-RETRY-001: Executed backoff attempt 2 of 3.' },
      { stepIndex: 3, agentName: 'Action Agent', status: 'COMPLETED', description: 'Carrier sync restored: Tracking ID DEL-449201 synced successfully.' },
      { stepIndex: 4, agentName: 'Verification Agent', status: 'COMPLETED', description: 'Verified shipment status updated to IN_TRANSIT in central database.' }
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
    requestedAt: '2026-10-01T04:15:03Z'
  },
  {
    _id: 'appr_1088',
    workflowId: 'wf_1088',
    orderNumber: 'ORD-1088',
    actionType: 'dispatch_replacement',
    targetAmount: 48000,
    currency: 'INR',
    riskLevel: 'CRITICAL',
    status: 'pending',
    reason: 'Policy POL-REF-002: Replacement monitor dispatch value ₹48,000 requires Senior Operations Manager sign-off.',
    evidence: {
      customerTier: 'Enterprise',
      customerName: 'Rajesh Verma',
      delayHours: 96,
      itemSku: 'SKU-DISP-4K',
      itemName: 'UltraView 34" Curved OLED Monitor',
      recommendedAction: 'Dispatch replacement immediately via Bluedart Air Priority.'
    },
    requestedAt: '2026-10-01T01:10:00Z'
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    _id: 'notif_1',
    type: 'approval_required',
    title: 'Manager Approval Required: Refund ₹15,000',
    message: 'High-value refund policy threshold (₹5,000) exceeded for delayed order ORD-1042 (Amit Sharma).',
    severity: 'error',
    read: false,
    createdAt: '2026-10-01T04:15:05Z'
  },
  {
    _id: 'notif_2',
    type: 'vip_issue_detected',
    title: 'VIP Shipment Delayed > 72h: ORD-1042',
    message: 'AirPro Max Headphones shipment delayed in Mumbai transit hub.',
    severity: 'warning',
    read: false,
    createdAt: '2026-10-01T04:14:00Z'
  },
  {
    _id: 'notif_3',
    type: 'self_healing_success',
    title: 'Self-Healing: Courier Webhook Recovered',
    message: 'Delhivery gateway timeout on order ORD-1032 recovered via exponential backoff retry 2.',
    severity: 'info',
    read: true,
    createdAt: '2026-10-01T02:01:00Z'
  }
];

class MockDataService {
  constructor() {
    this.initDatabase();
  }

  initDatabase() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.users = parsed.users || INITIAL_USERS;
        this.policies = parsed.policies || INITIAL_POLICIES;
        this.orders = parsed.orders || INITIAL_ORDERS;
        this.customers = parsed.customers || INITIAL_CUSTOMERS;
        this.inventory = parsed.inventory || INITIAL_INVENTORY;
        this.workflows = parsed.workflows || INITIAL_WORKFLOWS;
        this.approvals = parsed.approvals || INITIAL_APPROVALS;
        this.notifications = parsed.notifications || INITIAL_NOTIFICATIONS;
        return;
      }
    } catch {
      // ignore JSON parse errors
    }

    this.reset();
  }

  save() {
    try {
      const payload = {
        users: this.users,
        policies: this.policies,
        orders: this.orders,
        customers: this.customers,
        inventory: this.inventory,
        workflows: this.workflows,
        approvals: this.approvals,
        notifications: this.notifications
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      // storage quota or incognito
    }
  }

  reset() {
    this.users = [...INITIAL_USERS];
    this.policies = JSON.parse(JSON.stringify(INITIAL_POLICIES));
    this.orders = JSON.parse(JSON.stringify(INITIAL_ORDERS));
    this.customers = JSON.parse(JSON.stringify(INITIAL_CUSTOMERS));
    this.inventory = JSON.parse(JSON.stringify(INITIAL_INVENTORY));
    this.workflows = JSON.parse(JSON.stringify(INITIAL_WORKFLOWS));
    this.approvals = JSON.parse(JSON.stringify(INITIAL_APPROVALS));
    this.notifications = JSON.parse(JSON.stringify(INITIAL_NOTIFICATIONS));
    this.save();
  }

  // --- ROUTER / REQUEST HANDLER ---
  handleRequest(config) {
    const method = (config.method || 'get').toLowerCase();
    const url = (config.url || '').replace(/^\/api/, '');
    const path = url.split('?')[0];
    const queryParams = new URLSearchParams(url.includes('?') ? url.split('?')[1] : '');

    let body = {};
    if (typeof config.data === 'string') {
      try {
        body = JSON.parse(config.data);
      } catch {
        body = {};
      }
    } else if (config.data) {
      body = config.data;
    }

    // AUTH
    if (path === '/auth/login' && method === 'post') {
      const { email, password } = body;
      const user = this.users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || this.users[0];
      return {
        success: true,
        data: {
          token: `mock_jwt_${user.role}_${Date.now()}`,
          user
        }
      };
    }

    if (path === '/auth/me' && method === 'get') {
      const savedUser = localStorage.getItem('opspilot_user');
      const user = savedUser ? JSON.parse(savedUser) : this.users[0];
      return { success: true, data: { user } };
    }

    if (path === '/auth/register' && method === 'post') {
      const { username, email, role } = body;
      const newUser = {
        id: `usr_${Date.now()}`,
        username: username || 'new_operator',
        email: email || 'user@opspilot.ai',
        role: role || 'operator',
        department: 'Operations'
      };
      this.users.push(newUser);
      this.save();
      return {
        success: true,
        data: {
          token: `mock_jwt_${newUser.role}_${Date.now()}`,
          user: newUser
        }
      };
    }

    // ANALYTICS
    if (path === '/analytics' && method === 'get') {
      const totalWorkflows = this.workflows.length;
      const completedWorkflows = this.workflows.filter(w => w.status === 'COMPLETED').length;
      const awaitingApproval = this.workflows.filter(w => w.status === 'AWAITING_APPROVAL').length;
      const pendingApprovalsCount = this.approvals.filter(a => a.status === 'pending').length;
      const delayedOrders = this.orders.filter(o => o.status === 'delayed').length;

      return {
        success: true,
        data: {
          totalWorkflows,
          completedWorkflows,
          failedWorkflows: 0,
          escalatedWorkflows: 1,
          awaitingApprovalWorkflows: awaitingApproval,
          totalActions: 48,
          verifiedActions: 47,
          pendingApprovals: pendingApprovalsCount,
          approvedApprovals: 6,
          totalOrders: this.orders.length,
          delayedOrdersCount: delayedOrders,
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
      };
    }

    // WORKFLOWS
    if (path === '/workflows' && method === 'get') {
      const status = queryParams.get('status');
      const search = queryParams.get('search');
      let filtered = [...this.workflows];

      if (status && status !== 'all') {
        filtered = filtered.filter(w => w.status === status);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(w => w.goal.toLowerCase().includes(s));
      }

      return {
        success: true,
        data: {
          count: filtered.length,
          workflows: filtered
        }
      };
    }

    if (path === '/workflows' && method === 'post') {
      const { goal } = body;
      const isHighValue = /15000|48000|ORD-1042|ORD-1088|refund.*high|expensive/i.test(goal || '');
      const wfId = `wf_${Date.now()}`;

      const newWorkflow = {
        _id: wfId,
        goal: goal || 'Autonomous Operations Goal',
        status: isHighValue ? 'AWAITING_APPROVAL' : 'COMPLETED',
        initiator: { username: 'manager_rahul', role: 'manager' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        currentStage: isHighValue ? 'HUMAN_APPROVAL' : 'COMPLETED',
        metrics: {
          totalSteps: 5,
          completedSteps: isHighValue ? 2 : 5,
          executionTimeMs: isHighValue ? 1240 : 1890
        },
        steps: [
          {
            stepIndex: 1,
            agentName: 'Planner Agent',
            status: 'COMPLETED',
            description: `Decomposed operational goal: Identified affected orders, verified inventory, mapped dependencies.`,
            startedAt: new Date(Date.now() - 3000).toISOString(),
            completedAt: new Date(Date.now() - 2500).toISOString(),
            durationMs: 310
          },
          {
            stepIndex: 2,
            agentName: 'Policy Engine',
            status: 'COMPLETED',
            description: isHighValue
              ? 'Evaluated POL-REF-002: Financial threshold ₹5,000 exceeded. Human-in-the-loop approval required.'
              : 'Evaluated POL-REF-001: Operational action verified under standard automatic threshold.',
            startedAt: new Date(Date.now() - 2500).toISOString(),
            completedAt: new Date(Date.now() - 2300).toISOString(),
            durationMs: 45
          },
          {
            stepIndex: 3,
            agentName: 'Action Agent',
            status: isHighValue ? 'AWAITING_APPROVAL' : 'COMPLETED',
            description: isHighValue
              ? 'Action paused. Created approval card in Manager Review Queue.'
              : 'Dispatched automated webhook to courier logistics & issued customer compensation voucher.',
            startedAt: new Date(Date.now() - 2300).toISOString(),
            completedAt: isHighValue ? undefined : new Date(Date.now() - 1500).toISOString(),
            durationMs: isHighValue ? undefined : 210
          },
          {
            stepIndex: 4,
            agentName: 'Verification Agent',
            status: isHighValue ? 'PENDING' : 'COMPLETED',
            description: isHighValue
              ? 'Waiting for manager approval before read-after-write verification.'
              : 'Read-after-write verification: Verified state committed to operational database.'
          },
          {
            stepIndex: 5,
            agentName: 'Notification Agent',
            status: isHighValue ? 'PENDING' : 'COMPLETED',
            description: isHighValue
              ? 'Sent Slack and email alert to Operations Lead.'
              : 'Sent customer SMS update with new tracking ETA.'
          }
        ]
      };

      this.workflows.unshift(newWorkflow);

      if (isHighValue) {
        this.approvals.unshift({
          _id: `appr_${Date.now()}`,
          workflowId: wfId,
          orderNumber: 'ORD-1042',
          actionType: 'issue_refund',
          targetAmount: 15000,
          currency: 'INR',
          riskLevel: 'HIGH',
          status: 'pending',
          reason: 'Refund amount ₹15,000 exceeds ₹5,000 policy threshold for delayed VIP shipment.',
          evidence: {
            customerTier: 'VIP',
            customerName: 'Amit Sharma',
            delayHours: 72,
            itemSku: 'SKU-HEADSET-PRO',
            itemName: 'AirPro Max Active Noise Cancelling Headphones',
            recommendedAction: 'Approve refund and extend VIP membership by 12 months.'
          },
          requestedAt: new Date().toISOString()
        });
      }

      this.save();
      return { success: true, data: { workflow: newWorkflow } };
    }

    // SINGLE WORKFLOW
    const wfMatch = path.match(/^\/workflows\/([^/]+)$/);
    if (wfMatch && method === 'get') {
      const id = wfMatch[1];
      const workflow = this.workflows.find(w => w._id === id || w.id === id) || this.workflows[0];
      const approval = this.approvals.find(a => a.workflowId === id);
      return {
        success: true,
        data: {
          workflow,
          approval,
          steps: workflow.steps || [],
          agentLogs: [
            {
              _id: 'log_1',
              agentName: 'Planner Agent',
              level: 'info',
              message: 'Goal received and parsed successfully. Formulated execution graph with 5 milestones.',
              timestamp: workflow.createdAt
            },
            {
              _id: 'log_2',
              agentName: 'Policy Engine',
              level: workflow.status === 'AWAITING_APPROVAL' ? 'warn' : 'info',
              message: workflow.status === 'AWAITING_APPROVAL'
                ? 'Threshold rule POL-REF-002 triggered. Flagged for Human-in-the-Loop approval.'
                : 'All policy rules verified compliant with operational standard.',
              timestamp: workflow.updatedAt
            }
          ]
        }
      };
    }

    // APPROVALS
    if (path === '/approvals' && method === 'get') {
      const statusFilter = queryParams.get('status');
      const riskFilter = queryParams.get('riskLevel');
      let filtered = [...this.approvals];

      if (statusFilter && statusFilter !== 'all') {
        filtered = filtered.filter(a => a.status === statusFilter);
      }
      if (riskFilter && riskFilter !== 'all') {
        filtered = filtered.filter(a => a.riskLevel === riskFilter);
      }

      return {
        success: true,
        data: {
          count: filtered.length,
          approvals: filtered
        }
      };
    }

    const decisionMatch = path.match(/^\/approvals\/([^/]+)\/(approve|reject)$/);
    if (decisionMatch && method === 'post') {
      const approvalId = decisionMatch[1];
      const decision = decisionMatch[2];
      const approval = this.approvals.find(a => a._id === approvalId);

      if (approval) {
        approval.status = decision === 'approve' ? 'approved' : 'rejected';
        approval.decidedAt = new Date().toISOString();
        approval.notes = body.notes || (decision === 'approve' ? 'Approved by Operations Manager' : 'Rejected by Operations Manager');

        // Update corresponding workflow
        const wf = this.workflows.find(w => w._id === approval.workflowId);
        if (wf) {
          wf.status = decision === 'approve' ? 'COMPLETED' : 'REJECTED';
          wf.currentStage = decision === 'approve' ? 'COMPLETED' : 'REJECTED';
          if (wf.steps) {
            wf.steps.forEach(step => {
              if (step.status === 'AWAITING_APPROVAL' || step.status === 'PENDING') {
                step.status = decision === 'approve' ? 'COMPLETED' : 'SKIPPED';
              }
            });
          }
        }

        // Add success notification
        this.notifications.unshift({
          _id: `notif_${Date.now()}`,
          type: 'approval_decided',
          title: `Approval ${decision.toUpperCase()}D: ${approval.orderNumber}`,
          message: `Manager decision executed. Workflow ${approval.workflowId} state updated to ${wf ? wf.status : 'RESOLVED'}.`,
          severity: decision === 'approve' ? 'info' : 'warning',
          read: false,
          createdAt: new Date().toISOString()
        });

        this.save();
      }

      return { success: true, data: { approval } };
    }

    // ORDERS
    if (path === '/orders' && method === 'get') {
      const status = queryParams.get('status');
      const isVip = queryParams.get('isVip');
      const search = queryParams.get('search');
      let filtered = [...this.orders];

      if (status && status !== 'all') {
        filtered = filtered.filter(o => o.status === status);
      }
      if (isVip && isVip !== 'all') {
        filtered = filtered.filter(o => String(o.isVip) === isVip);
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(o => o.orderNumber.toLowerCase().includes(s) || o.customerName.toLowerCase().includes(s));
      }

      return {
        success: true,
        data: {
          count: filtered.length,
          orders: filtered
        }
      };
    }

    // CUSTOMERS
    if (path === '/customers' && method === 'get') {
      const tier = queryParams.get('tier');
      const search = queryParams.get('search');
      let filtered = [...this.customers];

      if (tier && tier !== 'all') {
        filtered = filtered.filter(c => c.tier.toLowerCase() === tier.toLowerCase());
      }
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c => c.name.toLowerCase().includes(s) || c.email.toLowerCase().includes(s));
      }

      return {
        success: true,
        data: {
          count: filtered.length,
          customers: filtered
        }
      };
    }

    // INVENTORY
    if (path === '/inventory' && method === 'get') {
      const riskOnly = queryParams.get('riskOnly');
      let filtered = [...this.inventory];

      if (riskOnly === 'true') {
        filtered = filtered.filter(i => i.status === 'low_stock' || i.status === 'critical');
      }

      return {
        success: true,
        data: {
          count: filtered.length,
          items: filtered
        }
      };
    }

    // POLICIES
    if (path === '/policies' && method === 'get') {
      return {
        success: true,
        data: {
          count: this.policies.length,
          policies: this.policies
        }
      };
    }

    const togglePolicyMatch = path.match(/^\/policies\/([^/]+)\/toggle$/);
    if (togglePolicyMatch && method === 'patch') {
      const policyId = togglePolicyMatch[1];
      const pol = this.policies.find(p => p._id === policyId || p.code === policyId);
      if (pol) {
        pol.active = !pol.active;
        this.save();
      }
      return { success: true, data: { policy: pol } };
    }

    // AGENT ACTIVITY
    if (path === '/agents/activity' && method === 'get') {
      return {
        success: true,
        data: {
          count: 7,
          activity: [
            {
              _id: 'act_1',
              agentName: 'Planner Agent',
              action: 'GOAL_DECOMPOSITION',
              details: 'Decomposed delayed shipment goal into 5 dependency-linked tasks.',
              status: 'SUCCESS',
              timestamp: new Date().toISOString()
            },
            {
              _id: 'act_2',
              agentName: 'Policy Engine',
              action: 'RULE_EVALUATION',
              details: 'Enforced POL-REF-002: Checked order value against ₹5,000 threshold.',
              status: 'SUCCESS',
              timestamp: new Date(Date.now() - 30000).toISOString()
            },
            {
              _id: 'act_3',
              agentName: 'Verification Agent',
              action: 'READ_AFTER_WRITE',
              details: 'Verified database write consistency for transaction TXN-998231.',
              status: 'SUCCESS',
              timestamp: new Date(Date.now() - 60000).toISOString()
            },
            {
              _id: 'act_4',
              agentName: 'Recovery Agent',
              action: 'EXPONENTIAL_BACKOFF',
              details: 'Recovered Delhivery courier webhook after 504 timeout.',
              status: 'SUCCESS',
              timestamp: new Date(Date.now() - 120000).toISOString()
            }
          ]
        }
      };
    }

    // NOTIFICATIONS
    if (path === '/notifications' && method === 'get') {
      const unreadOnly = queryParams.get('unreadOnly');
      let filtered = [...this.notifications];
      if (unreadOnly === 'true') {
        filtered = filtered.filter(n => !n.read);
      }
      const unreadCount = this.notifications.filter(n => !n.read).length;
      return {
        success: true,
        data: {
          count: filtered.length,
          unreadCount,
          notifications: filtered
        }
      };
    }

    const readNotifMatch = path.match(/^\/notifications\/([^/]+)\/read$/);
    if (readNotifMatch && method === 'patch') {
      const notifId = readNotifMatch[1];
      const notif = this.notifications.find(n => n._id === notifId);
      if (notif) {
        notif.read = true;
        this.save();
      }
      return { success: true };
    }

    // DEMO RESET
    if (path === '/demo/reset' && method === 'post') {
      this.reset();
      return {
        success: true,
        message: 'Demo dataset reset successfully to default baseline.',
        data: { timestamp: new Date().toISOString() }
      };
    }

    // ASSISTANT CHATBOT
    if (path === '/assistant' && method === 'post') {
      const query = (body.query || '').toLowerCase();
      let responseText = '';
      let suggestedActions = [];

      if (query.includes('delayed') || query.includes('order')) {
        const delayed = this.orders.filter(o => o.status === 'delayed');
        responseText = `There are currently **${delayed.length} delayed orders** in the system. High priority: **ORD-1042** (Amit Sharma, VIP, delayed 72h, ₹15,000) and **ORD-1088** (Rajesh Verma, Enterprise, delayed 96h, ₹48,000).`;
        suggestedActions = [
          { label: 'Resolve VIP ORD-1042', goal: 'Investigate and resolve delayed VIP order ORD-1042 for Amit Sharma' },
          { label: 'View Delayed Orders', goal: 'Show all delayed orders exceeding 24 hours SLA' }
        ];
      } else if (query.includes('approval') || query.includes('policy')) {
        const pending = this.approvals.filter(a => a.status === 'pending');
        responseText = `You have **${pending.length} pending human approvals**. Under policy **POL-REF-002**, any refund or replacement over **₹5,000** mandates operations manager review to protect business funds.`;
        suggestedActions = [
          { label: 'Review Approvals', goal: 'Navigate to Approval Center to verify evidence cards' }
        ];
      } else if (query.includes('inventory') || query.includes('stock')) {
        const low = this.inventory.filter(i => i.status === 'low_stock' || i.status === 'critical');
        responseText = `Inventory alert: **${low.length} SKUs** are below safety buffer threshold. Critical item: **UltraView 34" Curved Monitor** (Only 3 units left in Delhi Hub).`;
        suggestedActions = [
          { label: 'Trigger Reorder', goal: 'Auto-reorder critical low stock inventory SKUs from supplier' }
        ];
      } else {
        responseText = `I am your **OpsPilot AI Copilot**. I supervise autonomous agent workflows, policy governance, read-after-write verification, and Human-in-the-Loop approvals.\n\nYou can ask me about delayed orders, policy rules, pending manager approvals, or launch an automated operational goal directly.`;
        suggestedActions = [
          { label: 'Resolve VIP Shipment', goal: 'Investigate and resolve delayed VIP order ORD-1042 for Amit Sharma' },
          { label: 'Run Courier SLA Audit', goal: 'Audit operational SLA violations from today and retry recoverable courier notifications' }
        ];
      }

      return {
        success: true,
        data: {
          response: responseText,
          suggestedActions,
          timestamp: new Date().toISOString()
        }
      };
    }

    // Default Fallback
    return {
      success: true,
      data: { message: 'Mock response', path, method }
    };
  }
}

export const mockDataService = new MockDataService();
export default mockDataService;
