# 06 - Test Plan

## Criterios de aceptacion
- Ninguna accion critica se ejecuta con confianza baja.
- Nunca hay doble asignacion de la ultima plaza.
- Waitlist FIFO se respeta en todas las transiciones.
- Todas las acciones criticas dejan traza en `audit_log`.

## Escenarios funcionales
1. Alta normal de jugador a partido abierto.
2. Partido lleno -> entrada en waitlist.
3. Cancelacion aprobada por staff -> oferta a waitlist.
4. Timeout de oferta (30 min) -> escalado.
5. Escalado manual por staff.
6. Borrado de datos solicitado y completado.

## Escenarios de robustez
1. Webhook duplicado (idempotencia).
2. Dos usuarios compiten por ultima plaza (concurrencia).
3. Proveedor IA no responde (degradacion segura).
4. DB temporalmente no disponible (retry controlado).

## Shadow mode
Duracion: 1 semana.
- El bot recomienda y registra.
- El staff ejecuta decision final.
- Se comparan discrepancias para ajustar reglas.
