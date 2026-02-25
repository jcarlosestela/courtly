# 02 - Functional Spec

## Key rules
- Staff is final authority in any conflict.
- Only staff can approve cancellations.
- The bot never executes critical actions with low confidence.
- MVP match format: 4 players.

## Flow A - Publish match
1. Staff creates match (level, time, court, spots).
2. Bot publishes the open match message.
3. Players request to join using the supported interaction path.

## Flow B - Join match
1. Player asks to join.
2. Bot validates availability.
3. If slot exists: confirm registration.
4. If full: add to FIFO waitlist.

## Flow C - Cancellation and replacement
1. Player requests cancellation.
2. Staff approves or rejects.
3. If approved: offer slot to next waitlist player.
4. Confirmation timeout: 30 minutes.
5. If no acceptance: escalate to staff.

## Flow D - Escalation
Escalate when:
- Critical intent with low confidence.
- Inconsistent state.
- Waitlist offer timeout.
- Rule conflict.

## Language support
- Spanish and English.

## Privacy UX
- Explicit consent on onboarding.
- Short privacy notice + link.
- Data deletion command available in MVP.
