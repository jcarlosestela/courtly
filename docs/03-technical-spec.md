# 03 - Technical Spec

## Stack MVP
- Backend: Node.js + TypeScript.
- DB: PostgreSQL.
- Infra: cloud simple de bajo coste.
- IA: proveedor externo LLM con capa de abstraccion.
- Adaptadores de canal:
  - Oficial DM: WhatsApp Business Cloud API.
  - Grupos: Baileys (aislado en modulo/servicio separado).

## Arquitectura logica
- `wa-webhook`: recibe eventos de WhatsApp.
- `wa-official-adapter`: envia/recibe mensajeria directa oficial.
- `wa-groups-baileys-adapter`: lectura/escritura de grupos (no oficial).
- `intent-service`: interpreta texto -> comandos internos.
- `orchestrator`: aplica reglas de negocio.
- `match-service`: partidos, inscripciones, waitlist.
- `staff-escalation`: cola de incidencias para staff.
- `audit-service`: trazabilidad completa.

## No funcionales
- Uptime objetivo: 99% en horario del club.
- Idempotencia en webhooks (clave por message/event id).
- Logs estructurados y auditables.
- Kill switch para grupos: bandera de feature para apagar Baileys en caliente.
- Degradacion segura: con Baileys apagado, el staff continua gestion manual de grupos.

## Estrategia IA segura
- Clasificar intent + extraer entidades.
- Validar contra esquema estricto.
- Confirmacion guiada en acciones criticas.
- Si confianza baja: no ejecutar y escalar.

## Guardrails para Baileys
- Limitar automatizacion a grupos del club con consentimiento explicito.
- Restringir volumen y frecuencia de envio para minimizar riesgo.
- Separar credenciales/sesiones de Baileys del canal oficial.
- Monitorear bloqueos, relogins y errores de sesion.
- Plan de contingencia: apagar Baileys y continuar operacion manual sin downtime.
