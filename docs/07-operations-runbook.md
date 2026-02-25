# 07 - Operations Runbook

## Monitorizacion minima
- Errores por endpoint.
- Latencia p95 de webhook e intent parsing.
- Cola de escalados abiertos.
- Ratio de baja confianza IA en intents criticos.

## Alarmas
- Uptime por debajo de 99% (horario club).
- Fallos webhook consecutivos > umbral.
- Escalados abiertos > umbral durante > 30 min.

## Modo degradado
Si falla IA o integracion externa:
1. Desactivar ejecucion automatica.
2. Mantener recepcion y logging de solicitudes.
3. Escalar todo a staff.
4. Notificar estado a staff.

## Resolucion de incidente
1. Identificar alcance (jugadores, partidos, staff).
2. Congelar automatismos de riesgo.
3. Corregir estado inconsistente.
4. Auditar acciones tomadas.
5. Cerrar con postmortem breve.
