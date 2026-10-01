import dotenv from 'dotenv';
dotenv.config();

import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Policy } from '../models/Policy.js';
import { Customer } from '../models/Customer.js';
import { InventoryItem } from '../models/InventoryItem.js';
import { Order } from '../models/Order.js';
import { Shipment } from '../models/Shipment.js';
import { SupportTicket } from '../models/SupportTicket.js';
import { Workflow } from '../models/Workflow.js';
import { WorkflowStep } from '../models/WorkflowStep.js';
import { AgentLog } from '../models/AgentLog.js';
import { Approval } from '../models/Approval.js';
import { Action } from '../models/Action.js';
import { Notification } from '../models/Notification.js';
import { AuditEvent } from '../models/AuditEvent.js';

import {
  usersData,
  policiesData,
  customersData,
  inventoryData,
  ordersData,
  shipmentsData,
  ticketsData
} from './seedData.js';

export const seedDatabase = async () => {
  console.log('--- Starting OpsPilot AI Database Seeding ---');

  // Clear previous data
  await Promise.all([
    User.deleteMany({}),
    Policy.deleteMany({}),
    Customer.deleteMany({}),
    InventoryItem.deleteMany({}),
    Order.deleteMany({}),
    Shipment.deleteMany({}),
    SupportTicket.deleteMany({}),
    Workflow.deleteMany({}),
    WorkflowStep.deleteMany({}),
    AgentLog.deleteMany({}),
    Approval.deleteMany({}),
    Action.deleteMany({}),
    Notification.deleteMany({}),
    AuditEvent.deleteMany({})
  ]);

  console.log('Cleared existing records.');

  // 1. Seed Users
  const users = [];
  for (const u of usersData) {
    const user = new User(u);
    await user.save();
    users.push(user);
  }
  console.log(`✓ Seeded ${users.length} Users`);

  // 2. Seed Policies
  const policies = await Policy.insertMany(policiesData);
  console.log(`✓ Seeded ${policies.length} Policies`);

  // 3. Seed Customers
  const customers = await Customer.insertMany(customersData);
  console.log(`✓ Seeded ${customers.length} Customers`);

  // 4. Seed Inventory
  const inventory = await InventoryItem.insertMany(inventoryData);
  console.log(`✓ Seeded ${inventory.length} Inventory Items`);

  // 5. Seed Orders
  const orders = await Order.insertMany(ordersData);
  console.log(`✓ Seeded ${orders.length} Orders (including 17 delayed orders)`);

  // 6. Seed Shipments
  const shipments = await Shipment.insertMany(shipmentsData);
  console.log(`✓ Seeded ${shipments.length} Shipments`);

  // 7. Seed Support Tickets
  const tickets = await SupportTicket.insertMany(ticketsData);
  console.log(`✓ Seeded ${tickets.length} Support Tickets`);

  // 8. Seed initial notifications
  const initialNotifications = [
    {
      type: 'vip_issue_detected',
      title: 'VIP Shipment Delayed: Amit Sharma (ORD-1042)',
      message: 'AirPro Max Active Noise Cancelling Headphones shipment delayed by 72 hours. Ticket #TCK-9001 requires attention.',
      severity: 'warning'
    },
    {
      type: 'approval_required',
      title: 'Manager Approval Pending: Refund ₹15,000',
      message: 'High-value refund policy threshold (₹5,000) exceeded for delayed order ORD-1042.',
      severity: 'error'
    },
    {
      type: 'workflow_completed',
      title: 'Daily Logistics Sanity Audit Completed',
      message: 'Autonomous scanner checked 30 active orders across 4 courier partners.',
      severity: 'info'
    }
  ];
  await Notification.insertMany(initialNotifications);
  console.log(`✓ Seeded ${initialNotifications.length} Initial Notifications`);

  console.log('--- OpsPilot AI Database Seeding Finished Successfully ---');
  return {
    users: users.length,
    policies: policies.length,
    customers: customers.length,
    inventory: inventory.length,
    orders: orders.length,
    shipments: shipments.length,
    tickets: tickets.length
  };
};

if (process.argv[1]?.endsWith('seed.js')) {
  (async () => {
    try {
      await connectDB();
      await seedDatabase();
      await disconnectDB();
      process.exit(0);
    } catch (err) {
      console.error('Seeding failed:', err);
      process.exit(1);
    }
  })();
}
