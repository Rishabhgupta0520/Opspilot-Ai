# OpsPilot AI — REST API Reference

Base URL: `http://localhost:5001/api`

---

## 1. Authentication

### `POST /auth/register`
Create a new operator account.
```json
{
  "username": "rahul_ops",
  "email": "rahul@company.com",
  "password": "SecurePassword123",
  "role": "operator"
}
```

### `POST /auth/login`
Sign in with credentials.
```json
{
  "email": "manager@opspilot.ai",
  "password": "Manager@123456"
}
```

### `GET /auth/me`
Retrieve currently authenticated profile. (Requires `Authorization: Bearer <token>`)

---

## 2. Workflows

### `POST /workflows`
Launch an autonomous workflow from a natural language goal.
```json
{
  "goal": "Resolve all delayed orders from today. Prioritize VIP customers. Automatically process refunds under ₹5,000. Refunds above ₹5,000 require manager approval. Verify every action and retry recoverable failures."
}
```

### `GET /workflows`
List workflows with filtering and pagination.
- Query params: `status`, `category`, `search`, `limit`, `page`.

### `GET /workflows/:id`
Retrieve comprehensive execution state including tasks, live agent timeline, logs, audit events, and decisions.

### `POST /workflows/:id/cancel`
Cancel an active workflow execution.

### `POST /workflows/:id/retry`
Re-trigger execution for a halted or failed workflow.

---

## 3. Human-in-the-Loop Approvals

### `GET /approvals`
List pending and historical approval requests.
- Query params: `status` (`pending` | `approved` | `rejected`), `riskLevel`.

### `POST /approvals/:id/approve`
Authorize a high-risk operation. *(Requires role: `admin` or `manager`)*
```json
{
  "notes": "Approved delayed shipment refund following evidence verification."
}
```

### `POST /approvals/:id/reject`
Reject and escalate a high-risk operation. *(Requires role: `admin` or `manager`)*
```json
{
  "notes": "Rejected due to lack of photo verification."
}
```

---

## 4. Operational Data

- `GET /orders`: List orders (filters: `status`, `isVip`, `minDelay`, `search`).
- `GET /customers`: List customer accounts with LTV, tier, and dispute history.
- `GET /inventory`: List inventory items with real-time stock-out days remaining.
- `GET /policies`: Retrieve active deterministic business policies.
- `PATCH /policies/:id/toggle`: Enable/disable a policy rule. *(Admin/Manager only)*
- `GET /agents/activity`: Retrieve granular agent and tool execution logs.
- `GET /analytics`: Compute real-time KPIs (automation rate, verification rate, resolution time).
- `GET /notifications`: Retrieve unread operational alerts.
- `PATCH /notifications/:id/read`: Mark an alert as read.
- `POST /demo/reset`: Reset database to the deterministic hackathon seed baseline.
- `GET /health`: Engine health check.
