# 01 - Product Spec

## Vision
Reducir ruido y carga operativa en la gestion de partidos abiertos de un club de padel, aprovechando WhatsApp como canal principal de interaccion.

## Problema
Hoy la coordinacion se hace manualmente en grupos de WhatsApp por nivel. Esto genera:
- Mensajes dispersos y poca trazabilidad.
- Sobrecarga en staff para completar plazas y gestionar cambios.
- Riesgo de errores operativos (sobreventa, confusiones, bajas tardias mal resueltas).

## Objetivo del MVP
Conseguir en un club piloto:
- Reduccion >= 30% del tiempo diario de staff dedicado a coordinacion.
- Cero errores operativos graves atribuibles al sistema.

## Usuarios
- Jugador: consulta partidos y solicita inscripcion.
- Staff: publica, valida excepciones, cancela y resuelve escalados.

## Alcance MVP
- Gestion de partidos abiertos de ultima hora.
- Lista de espera FIFO.
- Reemplazo semiautomatico tras cancelacion aprobada por staff.
- Escalado a staff si hay baja confianza del bot o conflicto.
- Estrategia de canal hibrida:
  - Mensajeria directa (1:1) via WhatsApp Business Cloud API oficial.
  - Interaccion en grupos via Baileys (capa no oficial) con riesgo controlado.

## Fuera de alcance MVP
- Integracion con sistema de reservas del club.
- Panel web de administracion.
- Multi-club.
- Automatizacion completa de competiciones tipo "Rey de pista/Pool".

## KPI norte
- Tiempo staff dedicado/dia.

## Criterio de fracaso temprano
- No poder operar DM oficial de forma estable, o no poder desactivar Baileys sin romper la operacion manual del club.
