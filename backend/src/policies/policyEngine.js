import { Policy } from '../models/Policy.js';

export class PolicyEngine {
  /**
   * Deterministically evaluates business policies against target entity & proposed action.
   * Note: The LLM cannot bypass or alter this deterministic logic.
   */
  static async evaluateAction({ proposedAction, order, customer, shipment, ticket, amount }) {
    const activePolicies = await Policy.find({ active: true }).sort({ priority: 1 }).lean();
    const evidence = [];
    const matchedPolicies = [];

    let allowed = true;
    let requiresApproval = false;
    let riskLevel = 'low';
    let primaryPolicyCode = 'DEFAULT-PERMITTED';

    // 1. VIP Prioritization Policy Check
    const isVip = customer?.tier === 'VIP' || order?.isVip === true;
    if (isVip) {
      evidence.push('Customer has VIP Priority status.');
      matchedPolicies.push('POL-VIP-001');
    }

    // 2. Delay Assessment
    const delayHours = shipment?.delayHours || order?.delayHours || 0;
    if (delayHours > 48) {
      evidence.push(`Shipment severely delayed (${delayHours} hours > 48-hour threshold).`);
      matchedPolicies.push('POL-SHP-001');
      if (riskLevel === 'low') riskLevel = 'medium';
    } else if (delayHours > 0) {
      evidence.push(`Shipment delayed by ${delayHours} hours.`);
    }

    // 3. Lost Shipment Evaluation
    if (shipment?.status === 'lost') {
      evidence.push('Shipment is confirmed lost by carrier terminal.');
      matchedPolicies.push('POL-SHP-002');
      riskLevel = 'high';
    }

    // 4. Financial & Refund Policy Evaluation
    if (proposedAction === 'refund') {
      const refundAmount = amount || order?.amount || 0;

      // Look up DB refund threshold policy
      const thresholdPolicy = activePolicies.find(p => p.code === 'POL-REF-001');
      const maxAutoThreshold = thresholdPolicy?.thresholdValue || 5000;

      if (refundAmount <= maxAutoThreshold) {
        allowed = true;
        requiresApproval = false;
        riskLevel = isVip ? 'low' : 'low';
        primaryPolicyCode = 'POL-REF-001';
        evidence.push(`Refund amount (₹${refundAmount.toLocaleString()}) is at or below the auto-resolution threshold (₹${maxAutoThreshold.toLocaleString()}).`);
        matchedPolicies.push('POL-REF-001');
      } else {
        allowed = true;
        requiresApproval = true;
        riskLevel = 'high';
        primaryPolicyCode = 'POL-REF-002';
        evidence.push(`Refund amount (₹${refundAmount.toLocaleString()}) exceeds the auto-resolution limit (₹${maxAutoThreshold.toLocaleString()}). Mandatory Manager Approval required.`);
        matchedPolicies.push('POL-REF-002');
      }

      // Check duplicate refund protection
      if (order?.refundProcessed) {
        allowed = false;
        evidence.push(`Order ${order.orderNumber} was previously refunded for ₹${order.refundAmount}. Duplicate refund blocked.`);
        primaryPolicyCode = 'POL-SEC-001';
        matchedPolicies.push('POL-SEC-001');
      }
    }

    // 5. Replacement Policy Evaluation
    if (proposedAction === 'replace_order') {
      if (shipment?.status === 'lost' || delayHours > 72) {
        allowed = true;
        requiresApproval = false;
        primaryPolicyCode = 'POL-SHP-002';
        evidence.push('Eligible for immediate expedited order replacement under Lost Package Policy.');
      } else {
        requiresApproval = true;
        riskLevel = 'medium';
        evidence.push('Replacement requested before carrier confirmation of package loss.');
      }
    }

    // 6. Escalation Evaluation
    if (proposedAction === 'escalate') {
      allowed = true;
      requiresApproval = false;
      riskLevel = 'high';
      primaryPolicyCode = 'POL-SLA-001';
      evidence.push(`Unresolvable operational condition requires senior logistics escalation.`);
      matchedPolicies.push('POL-SLA-001');
    }

    return {
      allowed,
      requiresApproval,
      riskLevel,
      policy: primaryPolicyCode,
      evidence,
      matchedPolicies,
      evaluatedAt: new Date().toISOString()
    };
  }
}
