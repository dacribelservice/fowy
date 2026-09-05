# 🎨 FOWY iA FINANZAS & COPILOT — ESPECIFICACIÓN VISUAL (UX/UI)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Diseño de Interfaz, Wireframes, Flujos y Experiencia Visual**  
> **Autor:** Antigravity AI (Especialista en Arquitectura SaaS & Finanzas Tecnológicas)  
> **Destinatario:** Cristian (CEO de FOWY)  
> **Alineación:** [`Markdown/diseño.md`](file:///c:/Users/cange/Documents/fowy/Markdown/diseño.md), [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md) e [`Markdown/Contabilidad/iA.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.Backend.md)  
> **Fecha:** 5 de Septiembre de 2026  
> **Versión:** 1.0 (Diseño Modular, Pantalla de Negocios en Modo Lectura y Cero Deuda Técnica <250L)  

---

## 🎯 1. Filosofía de Diseño: Diagnóstico en 3 Segundos

El módulo de Finanzas no es una hoja de cálculo aburrida; es la **Torre de Control del CEO de FOWY**. Su diseño se rige por tres premisas inquebrantables:
1. **Velocidad Cognitiva (Regla de los 3 Segundos):** Cristian debe abrir la pantalla en su celular o laptop y entender de inmediato el semáforo de su empresa: cuánto dinero hay en total, cuántos negocios están al día, cuántos deben cobrar hoy y qué visitas tiene programadas.
2. **Cero Trabajo Manual Esclavo:** La información comercial y de cobro se centraliza aquí. La pantalla de cada restaurante en `/admin/negocios` se convierte en un visor informativo en modo lectura.
3. **Estética FOWY de Alto Impacto:** Paleta de colores Energy Orange (`#FF6B00` a `#FF8533`), tipografía moderna Inter/Poppins, tarjetas con bordes suaves (`rounded-2xl`), sombras sutiles, micro-animaciones y glassmorphism limpio.

---

## 🖥️ 2. Wireframe Maestro de `/admin/finanzas`

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📑 PANEL DE FINANZAS & COPILOT DIRECTIVO — FOWY                               [ 🤖 COPILOT ]│
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. SEMÁFOROS DE SUSCRIPCIÓN (KPIs SUPERIORES)                                               │
│ ┌──────────────────┬──────────────────┬──────────────────┬──────────────────────────────┐   │
│ │ 🟢 AL DÍA (18)   │ 🟡 EN PRUEBA (9) │ 🟠 EN GRACIA (3) │ 🔴 SUSPENDIDOS (2)           │   │
│ │ Recaudo: $900.000│ Días prom: 8     │ Cartera: $150.000│ En mora crítica              │   │
│ └──────────────────┴──────────────────┴──────────────────┴──────────────────────────────┘   │
│                                                                                             │
│ 2. ARQUEO DE CAJAS & ESTADO DE RESULTADOS (P&L REAL)                                        │
│ ┌─────────────────────────────────────────────────────────┬───────────────────────────────┐ │
│ │ 💳 LIQUIDEZ POR CUENTA (Bolsillos)                      │ 📊 UTILIDAD NETA DEL MES      │ │
│ │ • Nequi:         $ 850.000 COP                          │ • Ingresos Cobrados: $950.000 │ │
│ │ • Daviplata:     $ 150.000 COP                          │ • Gastos OPEX:      -$280.000 │ │
│ │ • Bancolombia:   $ 420.000 COP                          │ ───────────────────────────── │ │
│ │ • Efectivo Mano: $ 180.000 COP                          │ 💰 UTILIDAD REAL:   +$670.000 │ │
│ │ Total Liquidez:  $1.600.000 COP                         │ (Margen Operativo: 70.5%)     │ │
│ └─────────────────────────────────────────────────────────┴───────────────────────────────┘ │
│                                                                                             │
│ 3. AGENDA DEL CEO (HOY) ── [ + Nueva Visita / Tarea ]                                       │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [x] 09:30 AM: Recoger 1.000 volantes en imprenta para Maye Ricuras       [ 🖨️ Imprenta ] │ │
│ │ [ ] 11:00 AM: Visitar Kaprichos para revisar fotos y menú digital        [ 📍 Visita ]   │ │
│ │ [ ] 04:00 PM: Cobrar $50.000 a Asados Diana (Compromiso pactado)         [ 💰 Cobro ]    │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ 4. LISTA DE RESTAURANTES (Paginación Virtualizada a 60 FPS)                                 │
│ [ 🔍 Buscar restaurante por nombre... (Trigram GIN) ]  [ Filtro: Todos v ] [ + Registrar ]  │
│ ┌───────────────────────────┬──────────────┬──────────────┬──────────────┬────────────────┐ │
│ │ Restaurante               │ Estado       │ Próximo Pago │ Entregables  │ Acciones       │ │
│ ├───────────────────────────┼──────────────┼──────────────┼──────────────┼────────────────┤ │
│ │ Asados Diana              │ 🟢 Al Día    │ 05/10/2026   │ 📷 Entregado │ [Cobrar] [Ver] │ │
│ │ Maye Ricuras              │ 🟡 En Prueba │ 12/09/2026   │ 📄 En Diseño │ [Extender] [Ver]││
│ │ Kaprichos                 │ 🟠 En Gracia │ 02/09/2026   │ 📷 Pendiente │ [Cobrar] [Chat]│ │
│ └───────────────────────────┴──────────────┴──────────────┴──────────────┴────────────────┘ │
│                                                                                             │
│                                                                     ┌─────────────────────┐ │
│                                                                     │ 🤖 BOTÓN FLOTANTE   │ │
│                                                                     │   "FOWY COPILOT"    │ │
│                                                                     │   [ 2 Tareas Hoy ]  │ │
│                                                                     └─────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📱 3. Anatomía Visual de los Componentes

### 3.1 Bloque 1: Semáforos de Suscripción (`FinanceKpiCards.tsx`)
* **Propósito:** Mostrar de un vistazo la salud de la cartera de clientes.
* **Componente:** 4 tarjetas con bordes redondeados (`rounded-2xl`), gradiente de fondo sutil y contador animado.
  * **Verde (`active`):** Restaurantes pagados al día con recaudo del mes.
  * **Amarillo (`trial`):** Restaurantes en periodo de prueba con promedio de días restantes.
  * **Naranja (`grace_period`):** Restaurantes con 3 a 5 días de tolerancia con cartera pendiente.
  * **Rojo (`suspended`):** Locales en mora crítica que requieren llamada o visita presencial.

### 3.2 Bloque 2: Arqueo Multibolsillo & P&L en Vivo (`FinanceProfitLossCard.tsx` y `FinanceAccountsBar.tsx`)
* **Arqueo de Fondos:** 4 tarjetas visuales con logotipos de Nequi, Daviplata, Bancolombia y Efectivo, con selector rápido para registrar traspasos entre cuentas en 2 clics (*"Traspasar $100k de Nequi a Efectivo"*).
* **P&L en Vivo:** 
  * Cifra de Ingresos en texto verde esmeralda.
  * Cifra de Gastos OPEX en texto rojo coral.
  * **Cifra de Utilidad Neta Real** en tipografía destacada (`text-3xl font-extrabold`) con badge de margen porcentual.

### 3.3 Bloque 3: Agenda de Campo del CEO (`CeoAgendaChecklist.tsx`)
* **Diseño:** Tarjetas de tareas con checkbox interactivo y badges por tipo de actividad:
  * 📍 **Visita presencial** (azul).
  * 🖨️ **Imprenta de volantes** (morado).
  * 📷 **Sesión de fotos** (naranja).
  * 💰 **Cobro programado** (verde).
* **Sincronización Automática:** Al marcar `[x]` en una tarea de fotos o volantes, se abre un micro-toast con la opción: *"¿Actualizar entregables de este restaurante en su ficha?"* con botón rápido `[Sí, sincronizar]`.

### 3.4 Bloque 4: Tabla Virtualizada a 60 FPS (`BusinessBillingTable.tsx`)
* **Rendimiento:** Implementada con `@tanstack/react-virtual`. Renderiza exclusivamente 10 a 12 filas en pantalla, sin importar si hay 100 o 10.000 restaurantes registrados.
* **Buscador Trigram GIN:** Input reactivo que filtra en `<5 ms` directamente en PostgreSQL.
* **Pestañas de Filtro Rápido:** `Todos`, `Al Día`, `En Prueba`, `Por Cobrar`, `Compromisos Hoy`.
* **Badges de Entregables:** Íconos de cámara 📷 y volante 📄 que cambian de color:
  * Gris: Pendiente.
  * Naranja: En proceso / imprenta.
  * Verde: Entregado al local.

---

## 🤖 4. Componente Flotante Copilot Web (`FinanceCopilotSheet.tsx`)

Ubicado en la esquina inferior derecha como un botón flotante con pulso activo:

```text
┌────────────────────────────────────────────────────────┐
│ 🤖 FOWY COPILOT — CFO & SECRETARIA                     │
├────────────────────────────────────────────────────────┤
│ 💬 Cristian: "Maye Ricuras pagó 50 mil por Nequi"      │
│                                                        │
│ 🤖 Copilot: "Entendido Cristian. He preparado la       │
│ transacción para confirmación:"                        │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ 📄 REGISTRO DE PAGO DE MEMBRESÍA                   │ │
│ │ • Negocio:        Maye Ricuras                     │ │
│ │ • Monto:          $50.000 COP                      │ │
│ │ • Cuenta destino: Nequi                            │ │
│ │ • Renovación:     +30 días (hasta 05/10/2026)      │ │
│ │ • Recibo oficial: Se generará #REC-026             │ │
│ │                                                    │ │
│ │    [ ✅ CONFIRMAR Y APLICAR ]    [ ❌ CANCELAR ]   │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 🎙️ Dictar Audio ]   Escribe tu instrucción... [➤] │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

* **Micrófono con Web Audio API:** Permite hablarle desde la laptop o celular si estás en la oficina sin teclear.
* **Tarjetas Interactivas de Pre-Confirmación (*Two-Step Confirmation*):** Jamás aplica cambios a ciegas. Renderiza la tarjeta con los datos extraídos y espera tu clic en `[ ✅ CONFIRMAR Y APLICAR ]`.
* **Ruta Inmediata:** Al dar clic, invoca el RPC en `<50 ms` y muestra el confetti visual con el recibo generado.

---

## 🔄 5. Integración con el Módulo de Negocios (`/admin/negocios/[id]`)

### Transformación de la Pantalla "CONFIGURACIÓN GENERAL":
En la pantalla de cada negocio, la sección que antes requería cambiar selectores y fechas a mano se transforma en un **Panel Informativo en Modo Lectura (*Read-Only View*)**:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  MÓDULOS ACTIVOS                  CONFIGURACIÓN GENERAL (Modo Lectura)       │
├──────────────────────────────────────────────────────────────────────────────┤
│  ESTATUS DEL NEGOCIO              PLAN CONTRATADO                            │
│  [ 🟢 Activo / Operativo ]        [ Standard — $50.000 COP ]                 │
│  (Sincronizado desde Finanzas)    (Corte automático mensual)                 │
│                                                                              │
│  PRÓXIMO CORTE (FECHA)            ÚLTIMO RECIBO EMITIDO                      │
│  [ 02/10/2026 ]                   [ 📄 Recibo #REC-025 — Pagado Nequi ]      │
│  (14 días restantes)              [ Ver Comprobante Oficial ]                │
│                                                                              │
│  ESTADO DE ENTREGABLES                                                       │
│  • Fotos de Menú:  [ 🟢 Subidas a plataforma ]                               │
│  • Volantes:       [ 🟢 1.000 volantes entregados ]                          │
│  • Stickers QR:    [ 🟢 Instalados en mesas ]                                │
│                                                                              │
│  ℹ️ Para registrar pagos o ajustar este plan, hazlo desde [ Finanzas ]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Cero riesgo de manipulación manual:** Ya no hay que abrir 100 pantallas para cambiar fechas una por una.
* **Trazabilidad 100%:** Si el restaurante dice "Activo", el botón `[ Ver Comprobante ]` abre el recibo legal generado por el módulo de Finanzas.

---

## 📦 6. Estructura de Componentes Atómicos (Regla <250 Líneas)

Para garantizar cumplimiento estricto de la regla de oro de [`conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md):

```text
src/components/admin/finanzas/
├── FinanceKpiCards.tsx          (~110L - 4 Semáforos superiores)
├── FinanceAccountsBar.tsx       (~140L - Bolsillos de Nequi/Daviplata/Bancolombia)
├── FinanceProfitLossCard.tsx    (~125L - Tarjeta P&L con ingresos, gastos y utilidad neta)
├── CeoAgendaChecklist.tsx       (~160L - Checklist interactivo de tareas y visitas)
├── BusinessBillingTable.tsx     (~180L - Tabla virtualizada con buscador Trigram GIN)
├── BusinessBillingRow.tsx       (~115L - Fila individual de negocio con badges)
├── modals/
│   ├── QuickPaymentModal.tsx    (~190L - Modal para cobro manual en web con abonos)
│   ├── QuickExpenseModal.tsx    (~170L - Modal para registrar gasto OPEX)
│   └── AccountTransferModal.tsx (~160L - Modal para traspaso de fondos entre cajas)
└── copilot/
    ├── FinanceCopilotSheet.tsx  (~190L - Drawer lateral flotante de chat)
    ├── CopilotVoiceMic.tsx      (~120L - Grabador de voz con Web Audio API)
    └── CopilotActionCard.tsx    (~140L - Tarjeta interactiva de confirmación de 2 pasos)
```

* **Ningún archivo supera las 200 líneas de código.**
* Máxima mantenibilidad, aislamiento y cero deuda técnica.

---
*Fin de la Especificación Visual UX/UI — FOWY iA Finanzas 2026*
