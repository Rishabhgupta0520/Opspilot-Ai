import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  sku: { type: String, required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true }
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    customerId: {
      type: String,
      required: true,
      index: true
    },
    customerName: {
      type: String,
      required: true
    },
    isVip: {
      type: Boolean,
      default: false,
      index: true
    },
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'INR'
    },
    status: {
      type: String,
      enum: ['pending', 'processing', 'delayed', 'delivered', 'cancelled', 'refunded', 'replacement_ordered'],
      default: 'pending',
      index: true
    },
    delayHours: {
      type: Number,
      default: 0
    },
    items: [orderItemSchema],
    refundProcessed: {
      type: Boolean,
      default: false
    },
    refundAmount: {
      type: Number,
      default: 0
    },
    replacementOrderNumber: {
      type: String,
      default: null
    },
    lastActionTaken: {
      type: String,
      default: null
    },
    lastActionAt: {
      type: Date,
      default: null
    }
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
