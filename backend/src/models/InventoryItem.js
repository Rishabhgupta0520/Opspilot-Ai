import mongoose from 'mongoose';

const inventoryItemSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    name: {
      type: String,
      required: true
    },
    category: {
      type: String,
      default: 'General'
    },
    stockLevel: {
      type: Number,
      required: true,
      default: 0
    },
    reservedStock: {
      type: Number,
      default: 0
    },
    dailyDemand: {
      type: Number,
      required: true,
      default: 5
    },
    reorderPoint: {
      type: Number,
      required: true,
      default: 20
    },
    unitPrice: {
      type: Number,
      required: true
    },
    supplier: {
      type: String,
      default: 'Premier Logistics Supplies'
    },
    leadTimeDays: {
      type: Number,
      default: 3
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

inventoryItemSchema.virtual('daysRemaining').get(function () {
  if (!this.dailyDemand || this.dailyDemand <= 0) return 999;
  return Number((this.stockLevel / this.dailyDemand).toFixed(1));
});

inventoryItemSchema.virtual('riskLevel').get(function () {
  const days = this.dailyDemand > 0 ? this.stockLevel / this.dailyDemand : 999;
  if (days <= 2 || this.stockLevel <= 5) return 'critical';
  if (days <= 4 || this.stockLevel <= this.reorderPoint) return 'high';
  if (days <= 7) return 'medium';
  return 'low';
});

export const InventoryItem = mongoose.model('InventoryItem', inventoryItemSchema);
