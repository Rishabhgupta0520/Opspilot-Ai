# OpsPilot AI — Security & Financial Safety Architecture

OpsPilot AI is designed from the ground up for high-trust enterprise and financial operations.

---

## 1. The Core Authority Model

```text
THE LLM REASONS.
THE APPLICATION CONTROLS AUTHORITY.
```

The system strictly enforces that:
- **No Direct Database Access**: The LLM never writes raw SQL or MongoDB queries. All access is mediated through deterministic JavaScript functions in the Tool Registry.
- **Strict Zod Parameter Validation**: Every argument passed to a tool must pass schema validation before execution.
- **Financial Threshold Policy**: Even if an LLM is instructed to "automatically process all refunds", the application-layer Policy Engine intercepts any transaction above ₹5,000 and forces a Human-in-the-Loop pause.
- **Role-Based Authorization (RBAC)**: Only users with `manager` or `admin` roles can approve high-risk tickets. Standard operators cannot approve high-risk financial actions.

---

## 2. Idempotency & Duplicate Protection

Every mutation requires an `idempotencyKey` formatted as:
```text
${workflowId}-${actionType}-${targetEntityId}
```

When an action is initiated:
1. The Tool Registry queries the persistent `Action` collection for an existing record with the same key.
2. If found with status `executed` or `verified`, the tool immediately returns the cached result without modifying state or issuing duplicate financial credits.
3. This prevents double-refunds during retries or concurrent network dispatches.

---

## 3. Secret Isolation & Zero API Key Leakage

- The `GEMINI_API_KEY` exists exclusively in the backend environment variables (`backend/.env`).
- Vite and React bundle zero AI keys, ensuring client-side security.
- Security headers are enforced using `helmet`.
- Authentication uses salted `bcrypt` password hashes and cryptographically signed JWT tokens with 7-day expiration.
