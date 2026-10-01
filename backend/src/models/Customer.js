import mongoose from 'mongoose';

const customerSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ''
    },
    tier: {
      type: String,
      enum: ['VIP', 'Enterprise', 'Standard'],
      default: 'Standard',
      index: true
    },
    lifetimeValue: {
      type: Number,
      default: 0
    },
    openTickets: {
      type: Number,
      default: 0
    },
    riskLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'low'
    },
    totalOrders: {
      type: Number,
      default: 0
    },
    refundCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export const Customer = mongoose.model('Customer', customerSchema);
