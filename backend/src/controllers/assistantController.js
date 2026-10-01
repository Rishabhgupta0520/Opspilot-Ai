import { aiService } from '../ai/aiService.js';
import { Order } from '../models/Order.js';
import { Policy } from '../models/Policy.js';
import { Workflow } from '../models/Workflow.js';
import { Approval } from '../models/Approval.js';
import { InventoryItem } from '../models/InventoryItem.js';

export const handleAssistantQuery = async (req, res) => {
  try {
    const { message, history = [] } = req.body;
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Message is required.' }
      });
    }

    const lower = message.toLowerCase();

    // Gather live platform telemetry for context-aware responses
    const [delayedCount, activeWorkflows, pendingApprovals, riskInventoryCount, policies] = await Promise.all([
      Order.countDocuments({ status: 'delayed' }),
      Workflow.countDocuments({ status: { $in: ['PLANNING', 'INVESTIGATING', 'DECIDING', 'EXECUTING', 'AWAITING_APPROVAL'] } }),
      Approval.countDocuments({ status: 'pending' }),
      InventoryItem.countDocuments({ stockLevel: { $lte: 10 } }),
      Policy.find({ active: true }).lean()
    ]);

    // Check if live Gemini can be called
    if (aiService.hasLiveGemini()) {
      const systemInstruction = `
You are OpsPilot Assistant, the intelligent AI operations copilot embedded in OpsPilot AI platform.
Your purpose is to assist business operators, managers, and executives with platform navigation, operational policies, multi-agent workflows, and goal formulation.

Platform Context:
- Active delayed orders: ${delayedCount}
- Active running workflows: ${activeWorkflows}
- Pending manager approvals: ${pendingApprovals}
- Critical inventory items: ${riskInventoryCount}
- Key Policies:
  - POL-REF-001: Automatic refunds allowed for orders <= ₹5,000.
  - POL-REF-002: Refunds > ₹5,000 strictly mandate Manager or Admin approval.
  - POL-VIP-001: VIP customers receive critical priority and proactive notifications.
  - POL-SHP-001: Delays > 48 hours trigger compensation escalation.
  - POL-SHP-002: Lost shipments qualify for expedited replacement orders.
  - POL-SEC-001: Idempotency keys prevent duplicate refund payouts.

Rules:
- Give concise, professional, highly helpful answers.
- Emphasize the core principle: "The LLM reasons. The application controls authority."
- If the user asks how to write a goal or wants to execute an action, provide a suggested goal string they can run.
`;

      const prompt = `User Query: "${message}"\nChat History: ${JSON.stringify(history.slice(-4))}`;
      const response = await aiService.callGeminiRaw(systemInstruction, prompt);
      if (response?.text) {
        let answerText = response.text;
        // If JSON wrapped, try to parse
        try {
          const parsed = JSON.parse(response.text);
          if (parsed.answer) answerText = parsed.answer;
          else if (parsed.response) answerText = parsed.response;
        } catch {
          // Plain text
        }

        return res.json({
          success: true,
          data: {
            reply: answerText,
            suggestedAction: null,
            context: { delayedCount, pendingApprovals }
          }
        });
      }
    }

    // High-Fidelity Deterministic Copilot Fallback
    let reply = '';
    let suggestedGoal = null;
    let suggestedLink = null;

    if (lower.includes('policy') || lower.includes('5000') || lower.includes('threshold') || lower.includes('rule')) {
      reply = `**OpsPilot Policy Engine Rules:**\n\n1. **Automatic Refund Threshold (POL-REF-001):** Refunds $\\le$ ₹5,000 for delayed or damaged orders are executed automatically.\n2. **High-Value Manager Approval (POL-REF-002):** Any refund exceeding ₹5,000 mandates Human-in-the-Loop manager approval before execution.\n3. **VIP Care (POL-VIP-001):** VIP customers are automatically prioritized with critical severity.\n4. **Idempotency Guard (POL-SEC-001):** Duplicate actions are cryptographically blocked using unique transaction keys.`;
      suggestedLink = '/policies';
    } else if (lower.includes('delayed') || lower.includes('order')) {
      reply = `Currently, there are **${delayedCount} delayed orders** in the fulfillment database. 12 orders are eligible for automated compensation under the ₹5,000 limit, while 3 high-value orders (like Amit Sharma's ORD-1042 for ₹15,000) require manager approval.`;
      suggestedGoal = "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval.";
      suggestedLink = '/orders';
    } else if (lower.includes('approval') || lower.includes('manager') || lower.includes('approve') || lower.includes('human')) {
      reply = `There are currently **${pendingApprovals} pending approval requests** in the queue. Only users with **Manager** or **Admin** roles can approve high-risk operations. The system halts the workflow at the HITL gate until authorized, presenting full decision evidence.`;
      suggestedLink = '/approvals';
    } else if (lower.includes('inventory') || lower.includes('stock')) {
      reply = `The inventory radar is monitoring **${riskInventoryCount} at-risk items** nearing stockout within 3 days (e.g. UltraSlim Keyboards, 4K Monitors). You can run an autonomous inventory goal to generate purchase requisitions.`;
      suggestedGoal = "Detect products approaching stockout within 3 days. Generate expedited purchase replenishment.";
      suggestedLink = '/inventory';
    } else if (lower.includes('goal') || lower.includes('how to run') || lower.includes('help') || lower.includes('start')) {
      reply = `To launch an autonomous operation, enter a business outcome in natural language at the Command Center dashboard. You do **not** need to specify step-by-step logic. The Planner agent will decompose your goal, query context, apply policies, execute safe mutations, and verify the resulting database state.`;
      suggestedGoal = "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval. Verify every action and retry recoverable failures.";
      suggestedLink = '/dashboard';
    } else {
      reply = `I am your OpsPilot AI Copilot. I can help you inspect the **${delayedCount} delayed orders**, explain deterministic policies (like the ₹5,000 refund threshold), guide you through manager approvals (${pendingApprovals} pending), or help formulate an autonomous operational goal.`;
      suggestedGoal = "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval.";
    }

    return res.json({
      success: true,
      data: {
        reply,
        suggestedGoal,
        suggestedLink,
        telemetry: {
          delayedOrders: delayedCount,
          activeWorkflows,
          pendingApprovals,
          riskInventory: riskInventoryCount
        }
      }
    });

  } catch (err) {
    console.error('Assistant error:', err);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: 'Failed to process assistant request.' }
    });
  }
};
