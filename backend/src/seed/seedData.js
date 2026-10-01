export const usersData = [
  {
    username: 'admin',
    email: 'admin@opspilot.ai',
    password: 'Admin@123456',
    role: 'admin',
    department: 'Executive Operations'
  },
  {
    username: 'manager_rahul',
    email: 'manager@opspilot.ai',
    password: 'Manager@123456',
    role: 'manager',
    department: 'Escalations & Approvals'
  },
  {
    username: 'operator_sneha',
    email: 'operator@opspilot.ai',
    password: 'Operator@123456',
    role: 'operator',
    department: 'Customer Fulfillment'
  },
  {
    username: 'viewer_guest',
    email: 'viewer@opspilot.ai',
    password: 'Viewer@123456',
    role: 'viewer',
    department: 'Audit & Compliance'
  }
];

export const policiesData = [
  {
    code: 'POL-REF-001',
    name: 'Automatic Refund Threshold',
    category: 'refund',
    thresholdValue: 5000,
    rules: {
      maxAmount: 5000,
      eligibleStatuses: ['delayed', 'lost'],
      requiresApprovalAbove: 5000
    },
    active: true,
    description: 'Refunds under or equal to ₹5,000 for delayed or lost shipments are processed automatically.',
    requiresApproval: false,
    priority: 1
  },
  {
    code: 'POL-REF-002',
    name: 'High-Value Refund Manager Approval',
    category: 'refund',
    thresholdValue: 5000,
    rules: {
      minAmount: 5000.01,
      requiredApproverRole: 'manager'
    },
    active: true,
    description: 'Refund requests exceeding ₹5,000 strictly mandate human operations manager approval before execution.',
    requiresApproval: true,
    priority: 2
  },
  {
    code: 'POL-VIP-001',
    name: 'VIP Priority Expedited Treatment',
    category: 'vip',
    thresholdValue: null,
    rules: {
      tier: 'VIP',
      priorityBoost: 'critical',
      expeditedCarrier: true
    },
    active: true,
    description: 'Any operational delay impacting VIP tier customers must be flagged with critical priority and proactive notification.',
    requiresApproval: false,
    priority: 1
  },
  {
    code: 'POL-SHP-001',
    name: 'Severe Shipment Delay Threshold',
    category: 'shipping',
    thresholdValue: 48,
    rules: {
      delayHoursThreshold: 48,
      action: 'escalate_and_compensate'
    },
    active: true,
    description: 'Shipments delayed by more than 48 hours require automatic compensation proposal and carrier escalation.',
    requiresApproval: false,
    priority: 2
  },
  {
    code: 'POL-SHP-002',
    name: 'Confirmed Lost Shipment Replacement',
    category: 'shipping',
    thresholdValue: null,
    rules: {
      shipmentStatus: 'lost',
      action: 'create_replacement'
    },
    active: true,
    description: 'Confirmed lost packages trigger immediate replacement dispatch or full refund option.',
    requiresApproval: false,
    priority: 3
  },
  {
    code: 'POL-INV-001',
    name: 'Stock-Out Critical Buffer Policy',
    category: 'inventory',
    thresholdValue: 3,
    rules: {
      daysRemainingThreshold: 3,
      action: 'auto_replenish_alert'
    },
    active: true,
    description: 'Inventory items with under 3 days of stock remaining must generate expedited purchase requisitions.',
    requiresApproval: false,
    priority: 1
  },
  {
    code: 'POL-SLA-001',
    name: 'SLA Breach Prevention Escalation',
    category: 'sla',
    thresholdValue: 4,
    rules: {
      hoursToSlaBreach: 4,
      action: 'escalate_ticket'
    },
    active: true,
    description: 'Open support tickets with fewer than 4 hours remaining to SLA breach are elevated to tier-2 engineers.',
    requiresApproval: false,
    priority: 2
  },
  {
    code: 'POL-SEC-001',
    name: 'Idempotency and Anti-Duplicate Guard',
    category: 'security',
    thresholdValue: null,
    rules: {
      lockDurationMinutes: 60,
      uniqueKeyConstraint: true
    },
    active: true,
    description: 'Financial transactions require unique cryptographic idempotency tokens to prevent duplicate payouts.',
    requiresApproval: false,
    priority: 1
  }
];

export const customersData = [
  { customerId: 'CUST-001', name: 'Amit Sharma', email: 'amit.sharma@example.com', phone: '+91 98201 11223', tier: 'VIP', lifetimeValue: 245000, openTickets: 1, riskLevel: 'medium', totalOrders: 34, refundCount: 0 },
  { customerId: 'CUST-002', name: 'Priya Patel', email: 'priya.patel@example.com', phone: '+91 98202 22334', tier: 'VIP', lifetimeValue: 189000, openTickets: 1, riskLevel: 'low', totalOrders: 28, refundCount: 1 },
  { customerId: 'CUST-003', name: 'Vikram Malhotra', email: 'vikram.m@example.com', phone: '+91 98203 33445', tier: 'Enterprise', lifetimeValue: 560000, openTickets: 2, riskLevel: 'high', totalOrders: 62, refundCount: 0 },
  { customerId: 'CUST-004', name: 'Ananya Deshmukh', email: 'ananya.d@example.com', phone: '+91 98204 44556', tier: 'Standard', lifetimeValue: 32000, openTickets: 0, riskLevel: 'low', totalOrders: 5, refundCount: 0 },
  { customerId: 'CUST-005', name: 'Rajesh Kothari', email: 'rajesh.k@example.com', phone: '+91 98205 55667', tier: 'VIP', lifetimeValue: 310000, openTickets: 1, riskLevel: 'medium', totalOrders: 41, refundCount: 0 },
  { customerId: 'CUST-006', name: 'Neha Chawla', email: 'neha.c@example.com', phone: '+91 98206 66778', tier: 'Standard', lifetimeValue: 48000, openTickets: 1, riskLevel: 'low', totalOrders: 8, refundCount: 1 },
  { customerId: 'CUST-007', name: 'Sanjay Reddy', email: 'sanjay.reddy@example.com', phone: '+91 98207 77889', tier: 'Enterprise', lifetimeValue: 780000, openTickets: 1, riskLevel: 'high', totalOrders: 95, refundCount: 0 },
  { customerId: 'CUST-008', name: 'Deepa Krishnan', email: 'deepa.k@example.com', phone: '+91 98208 88990', tier: 'VIP', lifetimeValue: 142000, openTickets: 0, riskLevel: 'low', totalOrders: 19, refundCount: 0 },
  { customerId: 'CUST-009', name: 'Rohan Mehra', email: 'rohan.m@example.com', phone: '+91 98209 99001', tier: 'Standard', lifetimeValue: 21000, openTickets: 1, riskLevel: 'medium', totalOrders: 4, refundCount: 0 },
  { customerId: 'CUST-010', name: 'Pooja Hegde', email: 'pooja.h@example.com', phone: '+91 98210 10112', tier: 'VIP', lifetimeValue: 195000, openTickets: 0, riskLevel: 'low', totalOrders: 26, refundCount: 0 },
  { customerId: 'CUST-011', name: 'Karan Johar', email: 'karan.j@example.com', phone: '+91 98211 11223', tier: 'Enterprise', lifetimeValue: 430000, openTickets: 2, riskLevel: 'medium', totalOrders: 54, refundCount: 2 },
  { customerId: 'CUST-012', name: 'Sunita Rao', email: 'sunita.rao@example.com', phone: '+91 98212 12334', tier: 'Standard', lifetimeValue: 18500, openTickets: 0, riskLevel: 'low', totalOrders: 3, refundCount: 0 },
  { customerId: 'CUST-013', name: 'Manish Verma', email: 'manish.v@example.com', phone: '+91 98213 13445', tier: 'Standard', lifetimeValue: 27000, openTickets: 1, riskLevel: 'low', totalOrders: 6, refundCount: 0 },
  { customerId: 'CUST-014', name: 'Gaurav Sen', email: 'gaurav.sen@example.com', phone: '+91 98214 14556', tier: 'VIP', lifetimeValue: 290000, openTickets: 1, riskLevel: 'low', totalOrders: 37, refundCount: 0 },
  { customerId: 'CUST-015', name: 'Ishita Bansal', email: 'ishita.b@example.com', phone: '+91 98215 15667', tier: 'Standard', lifetimeValue: 15400, openTickets: 0, riskLevel: 'low', totalOrders: 2, refundCount: 0 }
];

export const inventoryData = [
  { sku: 'SKU-LOG-01', name: 'AirPro Max Active Noise Cancelling Headphones', category: 'Electronics', stockLevel: 14, dailyDemand: 6, reorderPoint: 20, unitPrice: 14999, supplier: 'Acoustic Sound Labs' },
  { sku: 'SKU-LOG-02', name: 'UltraSlim Mechanical Bluetooth Keyboard', category: 'Accessories', stockLevel: 8, dailyDemand: 5, reorderPoint: 25, unitPrice: 4299, supplier: 'KeyCraft Tech' },
  { sku: 'SKU-LOG-03', name: 'Precision Ergo Laser Wireless Mouse', category: 'Accessories', stockLevel: 42, dailyDemand: 8, reorderPoint: 25, unitPrice: 2499, supplier: 'Peripherals Hub' },
  { sku: 'SKU-LOG-04', name: 'ProGear 4K Ultra-Wide Monitor 34-inch', category: 'Electronics', stockLevel: 3, dailyDemand: 2, reorderPoint: 10, unitPrice: 38999, supplier: 'VisionDisplay Corp' },
  { sku: 'SKU-LOG-05', name: 'SmartDock Thunderbolt 4 Multi-Port Station', category: 'Hardware', stockLevel: 5, dailyDemand: 4, reorderPoint: 15, unitPrice: 12499, supplier: 'ConnectTech' },
  { sku: 'SKU-LOG-06', name: 'EchoFlow ANC Wireless Earbuds Gen 3', category: 'Electronics', stockLevel: 65, dailyDemand: 12, reorderPoint: 40, unitPrice: 4999, supplier: 'Acoustic Sound Labs' },
  { sku: 'SKU-LOG-07', name: 'AeroGlide Ergonomic Mesh Office Chair', category: 'Furniture', stockLevel: 2, dailyDemand: 2, reorderPoint: 8, unitPrice: 24500, supplier: 'Apex Furniture' },
  { sku: 'SKU-LOG-08', name: 'HyperDrive NVMe 2TB External Rugged SSD', category: 'Storage', stockLevel: 19, dailyDemand: 6, reorderPoint: 15, unitPrice: 15999, supplier: 'Silicon Fast Storage' },
  { sku: 'SKU-LOG-09', name: 'Lumina Smart Ambient Desk Lamp', category: 'Lifestyle', stockLevel: 38, dailyDemand: 7, reorderPoint: 20, unitPrice: 3199, supplier: 'Lumina Design' },
  { sku: 'SKU-LOG-10', name: 'MagFast 3-in-1 Magnetic Wireless Charger', category: 'Accessories', stockLevel: 4, dailyDemand: 5, reorderPoint: 18, unitPrice: 3999, supplier: 'PowerGlow' },
  { sku: 'SKU-LOG-11', name: 'StudioMic Broadcast USB Condenser Mic', category: 'Audio', stockLevel: 22, dailyDemand: 4, reorderPoint: 15, unitPrice: 8499, supplier: 'SoundWave Inc' },
  { sku: 'SKU-LOG-12', name: 'ClearView FHD 1080p 60fps Pro Webcam', category: 'Electronics', stockLevel: 11, dailyDemand: 5, reorderPoint: 20, unitPrice: 5499, supplier: 'VisionDisplay Corp' },
  { sku: 'SKU-LOG-13', name: 'SecurePass FIDO2 Hardware Security Key', category: 'Security', stockLevel: 80, dailyDemand: 10, reorderPoint: 30, unitPrice: 2999, supplier: 'CyberArmor' },
  { sku: 'SKU-LOG-14', name: 'PowerVault 25,000mAh 100W Laptop Power Bank', category: 'Power', stockLevel: 6, dailyDemand: 4, reorderPoint: 15, unitPrice: 6999, supplier: 'PowerGlow' },
  { sku: 'SKU-LOG-15', name: 'ThermalArmor Sleeve for 16-inch Laptop', category: 'Accessories', stockLevel: 45, dailyDemand: 5, reorderPoint: 20, unitPrice: 1899, supplier: 'Apex Fabric' }
];

export const ordersData = [
  // 17 DELAYED ORDERS FOR THE PRIMARY HACKATHON DEMO:
  // 12 Automatically resolvable (refunds under 5000 or priority notifications)
  { orderNumber: 'ORD-1001', customerId: 'CUST-004', customerName: 'Ananya Deshmukh', isVip: false, amount: 2499, status: 'delayed', delayHours: 28, items: [{ sku: 'SKU-LOG-03', name: 'Precision Ergo Laser Wireless Mouse', quantity: 1, price: 2499 }] },
  { orderNumber: 'ORD-1002', customerId: 'CUST-006', customerName: 'Neha Chawla', isVip: false, amount: 3999, status: 'delayed', delayHours: 32, items: [{ sku: 'SKU-LOG-10', name: 'MagFast 3-in-1 Magnetic Wireless Charger', quantity: 1, price: 3999 }] },
  { orderNumber: 'ORD-1003', customerId: 'CUST-009', customerName: 'Rohan Mehra', isVip: false, amount: 1899, status: 'delayed', delayHours: 26, items: [{ sku: 'SKU-LOG-15', name: 'ThermalArmor Sleeve', quantity: 1, price: 1899 }] },
  { orderNumber: 'ORD-1004', customerId: 'CUST-012', customerName: 'Sunita Rao', isVip: false, amount: 4999, status: 'delayed', delayHours: 36, items: [{ sku: 'SKU-LOG-06', name: 'EchoFlow ANC Wireless Earbuds', quantity: 1, price: 4999 }] },
  { orderNumber: 'ORD-1005', customerId: 'CUST-013', customerName: 'Manish Verma', isVip: false, amount: 3199, status: 'delayed', delayHours: 25, items: [{ sku: 'SKU-LOG-09', name: 'Lumina Smart Ambient Desk Lamp', quantity: 1, price: 3199 }] },
  { orderNumber: 'ORD-1006', customerId: 'CUST-015', customerName: 'Ishita Bansal', isVip: false, amount: 2999, status: 'delayed', delayHours: 29, items: [{ sku: 'SKU-LOG-13', name: 'SecurePass FIDO2 Hardware Key', quantity: 1, price: 2999 }] },
  { orderNumber: 'ORD-1007', customerId: 'CUST-002', customerName: 'Priya Patel', isVip: true, amount: 4299, status: 'delayed', delayHours: 27, items: [{ sku: 'SKU-LOG-02', name: 'UltraSlim Mechanical Bluetooth Keyboard', quantity: 1, price: 4299 }] },
  { orderNumber: 'ORD-1008', customerId: 'CUST-008', customerName: 'Deepa Krishnan', isVip: true, amount: 3999, status: 'delayed', delayHours: 30, items: [{ sku: 'SKU-LOG-10', name: 'MagFast 3-in-1 Magnetic Wireless Charger', quantity: 1, price: 3999 }] },
  { orderNumber: 'ORD-1009', customerId: 'CUST-010', customerName: 'Pooja Hegde', isVip: true, amount: 2499, status: 'delayed', delayHours: 34, items: [{ sku: 'SKU-LOG-03', name: 'Precision Ergo Laser Wireless Mouse', quantity: 1, price: 2499 }] },
  { orderNumber: 'ORD-1010', customerId: 'CUST-004', customerName: 'Ananya Deshmukh', isVip: false, amount: 4500, status: 'delayed', delayHours: 49, items: [{ sku: 'SKU-LOG-06', name: 'EchoFlow ANC Earbuds', quantity: 1, price: 4500 }] },
  { orderNumber: 'ORD-1011', customerId: 'CUST-006', customerName: 'Neha Chawla', isVip: false, amount: 2800, status: 'delayed', delayHours: 31, items: [{ sku: 'SKU-LOG-09', name: 'Lumina Desk Lamp', quantity: 1, price: 2800 }] },
  { orderNumber: 'ORD-1012', customerId: 'CUST-014', customerName: 'Gaurav Sen', isVip: true, amount: 4800, status: 'delayed', delayHours: 25, items: [{ sku: 'SKU-LOG-06', name: 'EchoFlow ANC Wireless Earbuds', quantity: 1, price: 4800 }] },

  // 3 Approval-Required (> ₹5,000 threshold or high risk VIP):
  { orderNumber: 'ORD-1042', customerId: 'CUST-001', customerName: 'Amit Sharma', isVip: true, amount: 15000, status: 'delayed', delayHours: 72, items: [{ sku: 'SKU-LOG-01', name: 'AirPro Max Active Noise Cancelling Headphones', quantity: 1, price: 15000 }] },
  { orderNumber: 'ORD-1055', customerId: 'CUST-005', customerName: 'Rajesh Kothari', isVip: true, amount: 25000, status: 'delayed', delayHours: 56, items: [{ sku: 'SKU-LOG-07', name: 'AeroGlide Ergonomic Mesh Office Chair', quantity: 1, price: 25000 }] },
  { orderNumber: 'ORD-1078', customerId: 'CUST-003', customerName: 'Vikram Malhotra', isVip: true, amount: 12499, status: 'delayed', delayHours: 64, items: [{ sku: 'SKU-LOG-05', name: 'SmartDock Thunderbolt 4 Multi-Port Station', quantity: 1, price: 12499 }] },

  // 1 Recoverable Failure (e.g. transient notification gateway error on ORD-1032, retried and verified):
  { orderNumber: 'ORD-1032', customerId: 'CUST-009', customerName: 'Rohan Mehra', isVip: false, amount: 3500, status: 'delayed', delayHours: 38, items: [{ sku: 'SKU-LOG-11', name: 'StudioMic Broadcast USB Mic', quantity: 1, price: 3500 }] },

  // 1 Unrecoverable Escalation (ORD-1088, delay > 96h, lost package):
  { orderNumber: 'ORD-1088', customerId: 'CUST-007', customerName: 'Sanjay Reddy', isVip: true, amount: 38999, status: 'delayed', delayHours: 104, items: [{ sku: 'SKU-LOG-04', name: 'ProGear 4K Ultra-Wide Monitor 34-inch', quantity: 1, price: 38999 }] },

  // Additional 13 normal / non-delayed orders to complete realistic varied pool:
  { orderNumber: 'ORD-2001', customerId: 'CUST-001', customerName: 'Amit Sharma', isVip: true, amount: 15999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-08', name: 'HyperDrive NVMe 2TB SSD', quantity: 1, price: 15999 }] },
  { orderNumber: 'ORD-2002', customerId: 'CUST-002', customerName: 'Priya Patel', isVip: true, amount: 4999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-06', name: 'EchoFlow ANC Wireless Earbuds', quantity: 1, price: 4999 }] },
  { orderNumber: 'ORD-2003', customerId: 'CUST-003', customerName: 'Vikram Malhotra', isVip: true, amount: 77998, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-04', name: 'ProGear 4K Monitor', quantity: 2, price: 38999 }] },
  { orderNumber: 'ORD-2004', customerId: 'CUST-005', customerName: 'Rajesh Kothari', isVip: true, amount: 12499, status: 'processing', delayHours: 0, items: [{ sku: 'SKU-LOG-05', name: 'SmartDock Thunderbolt 4', quantity: 1, price: 12499 }] },
  { orderNumber: 'ORD-2005', customerId: 'CUST-008', customerName: 'Deepa Krishnan', isVip: true, amount: 8499, status: 'processing', delayHours: 0, items: [{ sku: 'SKU-LOG-11', name: 'StudioMic Broadcast Mic', quantity: 1, price: 8499 }] },
  { orderNumber: 'ORD-2006', customerId: 'CUST-010', customerName: 'Pooja Hegde', isVip: true, amount: 6999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-14', name: 'PowerVault Power Bank', quantity: 1, price: 6999 }] },
  { orderNumber: 'ORD-2007', customerId: 'CUST-011', customerName: 'Karan Johar', isVip: false, amount: 5499, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-12', name: 'ClearView FHD Webcam', quantity: 1, price: 5499 }] },
  { orderNumber: 'ORD-2008', customerId: 'CUST-013', customerName: 'Manish Verma', isVip: false, amount: 2999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-13', name: 'SecurePass Hardware Key', quantity: 1, price: 2999 }] },
  { orderNumber: 'ORD-2009', customerId: 'CUST-014', customerName: 'Gaurav Sen', isVip: true, amount: 14999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-01', name: 'AirPro Max Headphones', quantity: 1, price: 14999 }] },
  { orderNumber: 'ORD-2010', customerId: 'CUST-007', customerName: 'Sanjay Reddy', isVip: true, amount: 49000, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-07', name: 'AeroGlide Ergonomic Chair', quantity: 2, price: 24500 }] },
  { orderNumber: 'ORD-2011', customerId: 'CUST-002', customerName: 'Priya Patel', isVip: true, amount: 15999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-08', name: 'HyperDrive SSD', quantity: 1, price: 15999 }] },
  { orderNumber: 'ORD-2012', customerId: 'CUST-004', customerName: 'Ananya Deshmukh', isVip: false, amount: 3999, status: 'delivered', delayHours: 0, items: [{ sku: 'SKU-LOG-10', name: 'MagFast Charger', quantity: 1, price: 3999 }] },
  { orderNumber: 'ORD-2013', customerId: 'CUST-015', customerName: 'Ishita Bansal', isVip: false, amount: 4299, status: 'processing', delayHours: 0, items: [{ sku: 'SKU-LOG-02', name: 'UltraSlim Mechanical Keyboard', quantity: 1, price: 4299 }] }
];

export const shipmentsData = [
  { trackingNumber: 'TRK-DEL-1001', orderNumber: 'ORD-1001', carrier: 'BlueDart', status: 'delayed', delayHours: 28, origin: 'Mumbai Hub', destination: 'Pune', lastLocation: 'Navi Mumbai Transit Yard' },
  { trackingNumber: 'TRK-DEL-1002', orderNumber: 'ORD-1002', carrier: 'Delhivery', status: 'delayed', delayHours: 32, origin: 'Bhiwandi Hub', destination: 'Ahmedabad', lastLocation: 'Vapi Checkpost' },
  { trackingNumber: 'TRK-DEL-1003', orderNumber: 'ORD-1003', carrier: 'Shadowfax', status: 'delayed', delayHours: 26, origin: 'Bengaluru Sort Hub', destination: 'Chennai', lastLocation: 'Hosur Terminal' },
  { trackingNumber: 'TRK-DEL-1004', orderNumber: 'ORD-1004', carrier: 'Ekart', status: 'delayed', delayHours: 36, origin: 'Delhi North Hub', destination: 'Jaipur', lastLocation: 'Gurgaon Toll Sorting' },
  { trackingNumber: 'TRK-DEL-1005', orderNumber: 'ORD-1005', carrier: 'Delhivery', status: 'delayed', delayHours: 25, origin: 'Mumbai Hub', destination: 'Indore', lastLocation: 'Nashik Transit Hub' },
  { trackingNumber: 'TRK-DEL-1006', orderNumber: 'ORD-1006', carrier: 'BlueDart', status: 'delayed', delayHours: 29, origin: 'Kolkata Hub', destination: 'Patna', lastLocation: 'Durgapur Express Bay' },
  { trackingNumber: 'TRK-DEL-1007', orderNumber: 'ORD-1007', carrier: 'BlueDart', status: 'delayed', delayHours: 27, origin: 'Bengaluru Sort Hub', destination: 'Hyderabad', lastLocation: 'Anantapur Transit' },
  { trackingNumber: 'TRK-DEL-1008', orderNumber: 'ORD-1008', carrier: 'Delhivery', status: 'delayed', delayHours: 30, origin: 'Mumbai Hub', destination: 'Kochi', lastLocation: 'Mangalore Yard' },
  { trackingNumber: 'TRK-DEL-1009', orderNumber: 'ORD-1009', carrier: 'Ekart', status: 'delayed', delayHours: 34, origin: 'Delhi North Hub', destination: 'Chandigarh', lastLocation: 'Ambala Transit' },
  { trackingNumber: 'TRK-DEL-1010', orderNumber: 'ORD-1010', carrier: 'Shadowfax', status: 'delayed', delayHours: 49, origin: 'Mumbai Hub', destination: 'Nagpur', lastLocation: 'Aurangabad Sorting' },
  { trackingNumber: 'TRK-DEL-1011', orderNumber: 'ORD-1011', carrier: 'Delhivery', status: 'delayed', delayHours: 31, origin: 'Bhiwandi Hub', destination: 'Surat', lastLocation: 'Navsari Route' },
  { trackingNumber: 'TRK-DEL-1012', orderNumber: 'ORD-1012', carrier: 'BlueDart', status: 'delayed', delayHours: 25, origin: 'Bengaluru Sort Hub', destination: 'Coimbatore', lastLocation: 'Salem Depot' },
  { trackingNumber: 'TRK-DEL-1042', orderNumber: 'ORD-1042', carrier: 'BlueDart Air', status: 'delayed', delayHours: 72, origin: 'Delhi Airport Hub', destination: 'Mumbai Bandra', lastLocation: 'Airport Cargo Terminal - Weather Hold' },
  { trackingNumber: 'TRK-DEL-1055', orderNumber: 'ORD-1055', carrier: 'Delhivery Freight', status: 'delayed', delayHours: 56, origin: 'Chennai Warehouse', destination: 'Bengaluru Koramangala', lastLocation: 'Hosur Border Clearance' },
  { trackingNumber: 'TRK-DEL-1078', orderNumber: 'ORD-1078', carrier: 'BlueDart', status: 'delayed', delayHours: 64, origin: 'Mumbai Hub', destination: 'Delhi Connaught Place', lastLocation: 'Jaipur Junction Depot' },
  { trackingNumber: 'TRK-DEL-1032', orderNumber: 'ORD-1032', carrier: 'Shadowfax', status: 'delayed', delayHours: 38, origin: 'Pune Hub', destination: 'Mumbai Andheri', lastLocation: 'Vashi Sorting Bay' },
  { trackingNumber: 'TRK-DEL-1088', orderNumber: 'ORD-1088', carrier: 'Delhivery Freight', status: 'lost', delayHours: 104, origin: 'Kolkata Hub', destination: 'Hyderabad Banjara Hills', lastLocation: 'Unknown - Container Missing at Bilaspur Station' },
  { trackingNumber: 'TRK-DEL-2001', orderNumber: 'ORD-2001', carrier: 'BlueDart', status: 'delivered', delayHours: 0, origin: 'Mumbai Hub', destination: 'Mumbai Bandra', lastLocation: 'Delivered' },
  { trackingNumber: 'TRK-DEL-2002', orderNumber: 'ORD-2002', carrier: 'Delhivery', status: 'delivered', delayHours: 0, origin: 'Bengaluru Hub', destination: 'Bengaluru Indiranagar', lastLocation: 'Delivered' },
  { trackingNumber: 'TRK-DEL-2003', orderNumber: 'ORD-2003', carrier: 'BlueDart Air', status: 'delivered', delayHours: 0, origin: 'Delhi Hub', destination: 'Delhi Vasant Vihar', lastLocation: 'Delivered' }
];

export const ticketsData = [
  { ticketNumber: 'TCK-9001', customerId: 'CUST-001', customerName: 'Amit Sharma', orderNumber: 'ORD-1042', issue: 'AirPro Max headphones shipment stalled for 3 days. Need expedited delivery or refund.', priority: 'critical', status: 'open', slaHoursRemaining: 3 },
  { ticketNumber: 'TCK-9002', customerId: 'CUST-002', customerName: 'Priya Patel', orderNumber: 'ORD-1007', issue: 'Bluetooth keyboard delayed past promised SLA date.', priority: 'high', status: 'open', slaHoursRemaining: 5 },
  { ticketNumber: 'TCK-9003', customerId: 'CUST-003', customerName: 'Vikram Malhotra', orderNumber: 'ORD-1078', issue: 'SmartDock Thunderbolt shipment delayed 64+ hours. VIP escalated.', priority: 'critical', status: 'escalated', slaHoursRemaining: 1 },
  { ticketNumber: 'TCK-9004', customerId: 'CUST-005', customerName: 'Rajesh Kothari', orderNumber: 'ORD-1055', issue: 'Ergonomic chair stuck at Hosur border for 2+ days.', priority: 'high', status: 'open', slaHoursRemaining: 4 },
  { ticketNumber: 'TCK-9005', customerId: 'CUST-006', customerName: 'Neha Chawla', orderNumber: 'ORD-1002', issue: 'Wireless charger package delayed past delivery date.', priority: 'medium', status: 'open', slaHoursRemaining: 12 },
  { ticketNumber: 'TCK-9006', customerId: 'CUST-007', customerName: 'Sanjay Reddy', orderNumber: 'ORD-1088', issue: 'ProGear 4K Monitor missing in transit for over 4 days. Urgently require escalation.', priority: 'critical', status: 'escalated', slaHoursRemaining: 0, isSlaBreached: true },
  { ticketNumber: 'TCK-9007', customerId: 'CUST-009', customerName: 'Rohan Mehra', orderNumber: 'ORD-1032', issue: 'StudioMic tracking status not updating.', priority: 'medium', status: 'open', slaHoursRemaining: 8 },
  { ticketNumber: 'TCK-9008', customerId: 'CUST-011', customerName: 'Karan Johar', orderNumber: null, issue: 'Inquiry on corporate volume order discount tiers.', priority: 'low', status: 'in_progress', slaHoursRemaining: 20 },
  { ticketNumber: 'TCK-9009', customerId: 'CUST-013', customerName: 'Manish Verma', orderNumber: 'ORD-1005', issue: 'Lumina Desk Lamp tracking indicates delayed at Nashik hub.', priority: 'medium', status: 'open', slaHoursRemaining: 14 },
  { ticketNumber: 'TCK-9010', customerId: 'CUST-014', customerName: 'Gaurav Sen', orderNumber: 'ORD-1012', issue: 'EchoFlow earbuds promised express delivery delayed by 25h.', priority: 'high', status: 'open', slaHoursRemaining: 6 },
  { ticketNumber: 'TCK-9011', customerId: 'CUST-004', customerName: 'Ananya Deshmukh', orderNumber: 'ORD-1010', issue: 'Order delayed 49h, customer requesting status or refund.', priority: 'high', status: 'open', slaHoursRemaining: 2 },
  { ticketNumber: 'TCK-9012', customerId: 'CUST-008', customerName: 'Deepa Krishnan', orderNumber: 'ORD-1008', issue: 'VIP delivery inquiry - shipment update required.', priority: 'medium', status: 'resolved', slaHoursRemaining: 24 },
  { ticketNumber: 'TCK-9013', customerId: 'CUST-010', customerName: 'Pooja Hegde', orderNumber: 'ORD-1009', issue: 'Delivery address confirmation for delayed item.', priority: 'medium', status: 'resolved', slaHoursRemaining: 24 },
  { ticketNumber: 'TCK-9014', customerId: 'CUST-012', customerName: 'Sunita Rao', orderNumber: 'ORD-1004', issue: 'Earbuds delivery delay notification follow up.', priority: 'medium', status: 'open', slaHoursRemaining: 9 },
  { ticketNumber: 'TCK-9015', customerId: 'CUST-015', customerName: 'Ishita Bansal', orderNumber: 'ORD-1006', issue: 'Security key delivery timeline query.', priority: 'low', status: 'open', slaHoursRemaining: 18 }
];
