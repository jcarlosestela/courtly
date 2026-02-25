# 01 - Product Spec

## Vision
Reduce communication noise and staff operational load for open padel match coordination, using WhatsApp as the main interaction channel.

## Problem
Match coordination is currently manual in WhatsApp groups by level. This creates:
- Scattered messages and low traceability.
- High staff effort to fill spots and manage changes.
- Risk of operational errors (overbooking, confusion, late cancellations).

## MVP goal
For one pilot club:
- Reduce daily staff coordination time by at least 30%.
- Zero severe system-caused operational incidents.

## Users
- Player: checks availability and asks to join matches.
- Staff: publishes matches, validates exceptions, cancels, and resolves escalations.

## MVP scope
- Last-minute open match management.
- FIFO waitlist.
- Semi-automatic replacement after staff-approved cancellation.
- Staff escalation for low confidence or rule conflicts.
- Hybrid channel strategy:
  - 1:1 direct messaging via official WhatsApp Business Cloud API.
  - Group interaction via Baileys (non-official), risk-controlled.

## Out of MVP scope
- Club booking platform integration.
- Web admin panel.
- Multi-club support.
- Full automation of "King of the Court/Pool" competitions.

## North star KPI
- Staff coordination time per day.

## Early failure criterion
- Inability to run stable official DM, or inability to disable Baileys without breaking manual club operations.
