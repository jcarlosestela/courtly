# 04 - Data Model (MVP)

## Entities

### players
- `id` (uuid)
- `wa_phone` (string, unique)
- `display_name` (string, nullable)
- `language` (enum: es, en)
- `status` (enum: pending_validation, active, blocked)
- `consent_at` (timestamp)
- `created_at`, `updated_at`

### matches
- `id` (uuid)
- `level_code` (string)
- `start_at` (timestamp)
- `court_ref` (string)
- `capacity` (int, default 4)
- `status` (enum: open, full, cancelled, replacement, closed)
- `created_by_staff_phone` (string)
- `created_at`, `updated_at`

### registrations
- `id` (uuid)
- `match_id` (fk)
- `player_id` (fk)
- `status` (enum: confirmed, waitlisted, cancelled, expired)
- `position` (int, nullable)
- `offered_at` (timestamp, nullable)
- `expires_at` (timestamp, nullable)
- `confirmed_at` (timestamp, nullable)
- `created_at`, `updated_at`

### escalations
- `id` (uuid)
- `match_id` (fk, nullable)
- `player_id` (fk, nullable)
- `reason` (enum: low_confidence, conflict_rule, timeout_waitlist, manual)
- `payload` (jsonb)
- `status` (enum: open, in_progress, resolved)
- `resolved_by` (string, nullable)
- `created_at`, `updated_at`

### audit_log
- `id` (uuid)
- `actor_type` (enum: player, staff, system)
- `actor_ref` (string)
- `action` (string)
- `target_type` (string)
- `target_id` (string)
- `before_state` (jsonb)
- `after_state` (jsonb)
- `reason` (string, nullable)
- `created_at`

### privacy_requests
- `id` (uuid)
- `player_id` (fk)
- `type` (enum: erase)
- `status` (enum: requested, processing, done, rejected)
- `requested_at`, `resolved_at`
- `notes` (string, nullable)

## Recommended indexes
- `players(wa_phone)` unique
- `matches(status, start_at)`
- `registrations(match_id, status, position)`
- `escalations(status, created_at)`
- `audit_log(target_type, target_id, created_at)`
