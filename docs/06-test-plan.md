# 06 - Test Plan

## Acceptance criteria
- No critical action executes with low confidence.
- No double allocation of the last slot.
- FIFO waitlist ordering is preserved.
- Every critical action is logged in `audit_log`.

## Functional scenarios
1. Standard player registration to open match.
2. Full match => waitlist entry.
3. Staff-approved cancellation => waitlist offer.
4. Offer timeout (30 min) => escalation.
5. Manual staff escalation.
6. Data deletion request and completion.

## Robustness scenarios
1. Duplicate webhook event (idempotency).
2. Two users race for last slot (concurrency).
3. AI provider timeout/failure (safe degradation).
4. Temporary DB outage (controlled retry behavior).

## Shadow mode
Duration: 1 week.
- Bot suggests and logs.
- Staff executes final decision.
- Compare discrepancies to refine rules.
