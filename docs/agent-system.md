# OpsPilot AI — Specialized Agent System

OpsPilot AI replaces monolithic prompt chains with specialized autonomous agents coordinating through structured state.

---

## 1. The Multi-Agent Hierarchy

### 1.1 Planner Agent
- **Responsibility**: Takes the user's natural language goal and outputs a structured directed acyclic task graph.
- **Output Schema**:
  ```json
  {
    "goal": "...",
    "objective": "...",
    "category": "delayed_orders",
    "estimatedRisk": "high",
    "tasks": [
      {
        "id": "task-1",
        "name": "Identify Target Operational Entities",
        "agent": "investigation",
        "priority": 1,
        "requiredTools": ["getDelayedOrders", "getShipment"]
      }
    ]
  }
  ```

### 1.2 Investigation Agent
- **Responsibility**: Gathers real business context from MongoDB through the Tool Registry.
- **Constraints**: Never executes arbitrary database queries. Uses controlled tools: `getDelayedOrders`, `getOrder`, `getCustomer`, `getCustomerHistory`, `getShipment`, `getInventory`.

### 1.3 Deterministic Policy Engine
- **Responsibility**: Enforces hard-coded business rules that the LLM cannot override:
  - Refund <= ₹5,000 &rarr; Automated execution permitted.
  - Refund > ₹5,000 &rarr; Mandatory manager authorization required.
  - Delay > 48h &rarr; Severe delay policy triggered.
  - Lost package &rarr; Replacement order eligible.
  - Duplicate action check &rarr; Blocked.

### 1.4 Decision Agent
- **Responsibility**: Synthesizes investigation context and policy evaluation into structured action proposals:
  - Allowed actions: `refund`, `replace_order`, `update_ticket`, `send_customer_notification`, `create_escalation`, `update_inventory`, `reserve_inventory`, `prioritize`, `do_nothing`.
  - Attaches confidence scores and human-readable evidence points.

### 1.5 Approval Agent (Human-in-the-Loop)
- **Responsibility**: Automatically halts execution whenever `requiresApproval: true`.
- Generates an approval request containing evidence, policy reference, amount, and customer context.
- Resumes execution upon manager sign-off.

### 1.6 Action Agent
- **Responsibility**: Dispatches mutations via safe tools: `createRefund`, `createReplacement`, `sendCustomerNotification`, `createEscalation`.
- **Idempotency**: Issues a unique `idempotencyKey` per action to ensure duplicate invocations never trigger duplicate financial payouts.

### 1.7 Verification Agent
- **Responsibility**: Executes read-after-write verification (`verifyRefund`, `verifyReplacement`, `verifyTicketUpdate`, `verifyNotification`) by querying the database state to ensure the mutation was persisted.

### 1.8 Failure Recovery Engine
- **Responsibility**: Intercepts recoverable errors (e.g. transient gateway 504 timeouts).
- Applies exponential backoff and retries up to 3 times before escalating.
