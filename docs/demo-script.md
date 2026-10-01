# OpsPilot AI — Hackathon Judging Demo Script

This script walks through the **WOW Moment** and demonstrates the entire autonomous agentic lifecycle in under 4 minutes.

---

## 🎙️ Step 1: The Pitch (30 seconds)

> *"Judges, businesses today are suffocating under manual operational coordination. When shipments get delayed or tickets spike, operators spend hours switching across five dashboards, copying order IDs, checking policies, and issuing refunds.*
>
> *Today, we present **OpsPilot AI: From Business Goal to Verified Action**.*
>
> *I am NOT going to give the system step-by-step instructions. I am only going to give it our business goal."*

---

## 🚀 Step 2: The Goal Submission (45 seconds)

1. Open the OpsPilot Command Center at `/dashboard`.
2. Select or paste the Master Hackathon Goal:
   > *"Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval. Verify every action and retry recoverable failures. Escalate anything that cannot be safely resolved."*
3. Click **Execute Autonomous Goal**.

---

## 🔍 Step 3: The Multi-Agent Autonomous Symphony (60 seconds)

Point to the live execution screen:
1. **Planner Agent**: Decomposes the goal into 7 dependency-aware tasks.
2. **Investigation Agent**: Queries the real database via controlled tools (`getDelayedOrders`, `getShipment`), detecting **17 delayed orders**.
3. **Policy Engine**: Evaluates application rules deterministically:
   - 12 orders &le; ₹5,000 &rarr; Auto-resolution approved.
   - 3 orders &gt; ₹5,000 (e.g. Amit Sharma ORD-1042 ₹15,000) &rarr; **Approval Mandated**.
   - 1 lost shipment (ORD-1088) &rarr; **Escalation required**.
4. **Human-in-the-Loop Checkpoint**: The workflow safely pauses in `AWAITING_APPROVAL`.

---

## 🛡️ Step 4: The Human-in-the-Loop Approval (45 seconds)

1. Notice the golden **HITL Authorization Banner**.
2. Click **Approve & Execute** on the ₹15,000 refund for VIP customer Amit Sharma.
3. Show how the engine immediately resumes:
   - Action Agent executes refund with `idempotencyKey`.
   - Verification Agent re-queries the database and verifies the refund record.
   - Transient failure on ORD-1032 automatically triggers retry attempt #2 and succeeds!

---

## 📊 Step 5: Proof & Observability (30 seconds)

1. Open **Orders Page**: Show orders updated to `refunded` with real timestamps.
2. Open **Analytics Page**: Point to **88.5% Automation Rate** and **100% Verification Rate**.
3. Conclude with:
   > *"The LLM reasoned, the application controlled authority, and every action was verified. This is true agentic AI."*
