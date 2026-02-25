# Copilot Instructions

## Contexto del proyecto
Este proyecto implementa una integracion hibrida de WhatsApp:
- Mensajes directos (1:1) con WhatsApp Business Cloud API oficial.
- Interaccion en grupos con Baileys (no oficial) como solucion temporal.

El objetivo tecnico principal es mantener Baileys desacoplado para poder sustituirlo por una API oficial de grupos en el futuro.

## Reglas de arquitectura (obligatorias)
1. Usa el patron ports/adapters.
2. Todo acceso a grupos debe pasar por `GroupMessagingPort`.
3. No acoples la capa de dominio a SDKs concretos.
4. Mantener kill switch (`GROUP_AUTOMATION_ENABLED`) y provider por config (`GROUP_PROVIDER`).

## Archivos clave a respetar
- `src/domain/ports/direct-messaging-port.ts`
- `src/domain/ports/group-messaging-port.ts`
- `src/infrastructure/factories/channel-factory.ts`
- `src/infrastructure/http/server.ts`

## Restricciones
- No uses imports de Baileys fuera del adapter de grupos.
- No elimines `manual-group-adapter`.
- No hardcodees secretos ni tokens.
- No cambies contratos de puertos sin actualizar docs.

## Estilo de implementacion
- TypeScript estricto.
- Funciones pequenas y con responsabilidad clara.
- Manejo de errores explicito.
- Comentarios breves solo cuando aporten contexto tecnico real.

## Cambios esperados en siguientes iteraciones
- Implementacion real de Cloud API en `wa-cloud-api-direct-adapter.ts`.
- Implementacion real de eventos/sesion en `baileys-group-adapter.ts`.
- Persistencia PostgreSQL.
- Auditoria e idempotencia en webhooks.

## Comportamiento en caso de duda
Si una propuesta rompe el desacoplamiento entre dominio y proveedores, prioriza mantener el contrato del puerto aunque implique mas codigo en infraestructura.
