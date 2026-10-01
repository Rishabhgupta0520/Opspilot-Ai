import mongoose from 'mongoose';

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: {
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
    orderNumber: {
      type: String,
      default: null,
      index: true
    },
    issue: {
      type: String,
      required: true
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium',
      index: true
    },
    status: {
      type: String,
      enum: ['open', 'in_progress', 'resolved', 'escalated'],
      default: 'open',
      index: true
    },
    slaHoursRemaining: {
      type: Number,
      default: 24
    },
    isSlaBreached: {
      type: Boolean,
      default: false
    },
    assignedAgent: {
      type: String,
      default: 'OpsPilot Support Queue'
    },
    resolutionNotes: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

export const SupportTicket = mongoose.model('SupportTicket', supportTicketSchema);
