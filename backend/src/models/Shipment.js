import mongoose from 'mongoose';

const shipmentSchema = new mongoose.Schema(
  {
    trackingNumber: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    orderNumber: {
      type: String,
      required: true,
      index: true
    },
    carrier: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['in_transit', 'delayed', 'lost', 'delivered', 'returned'],
      default: 'in_transit',
      index: true
    },
    delayHours: {
      type: Number,
      default: 0
    },
    origin: {
      type: String,
      default: 'Mumbai Hub'
    },
    destination: {
      type: String,
      required: true
    },
    lastLocation: {
      type: String,
      default: 'In Transit'
    },
    estimatedDelivery: {
      type: Date
    },
    carrierContact: {
      type: String,
      default: 'support@delhivery.com'
    }
  },
  { timestamps: true }
);

export const Shipment = mongoose.model('Shipment', shipmentSchema);
