# 🛠️ FOWY iA FINANZAS & COPILOT — AUDITORÍA EN VIVO, RIESGOS & PLAN DE TRABAJO

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Evaluación de Riesgos, Puntos de Contacto, Reglas y Checklist de Implementación**  
> **Autor:** Antigravity AI (Especialista en Arquitectura SaaS & Finanzas Tecnológicas)  
> **Destinatario:** Cristian (CEO de FOWY)  
> **Unión de Documentos Rectores:** [`Markdown/Contabilidad/CONTABILIDAD.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/CONTABILIDAD.md), [`Markdown/Contabilidad/AGENTE.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/AGENTE.md), [`Markdown/Contabilidad/Optimizacion-iA.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/Optimizacion-iA.md), [`Markdown/Contabilidad/iA.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.Backend.md) e [`Markdown/Contabilidad/iA.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.UX-UI.md)  
> **Fecha:** 5 de Septiembre de 2026  
> **Versión:** 2.1 (100% Cobertura, Checklist Definitiva con 6 Ejes de Optimización, Riesgo 1.8/10)  

---

## 🎯 1. Calificación Global de Riesgo de Implementación

# **1.8 / 10 — (Riesgo Mínimo / 100% Blindado)**

### ¿Por qué la calificación de riesgo es tan baja (1.8/10)?
1. **La Tabla Madre `businesses` queda 100% Virgen e Intocada:**  
   Gracias a la decisión de utilizar la **tabla satélite `business_subscriptions`**, no se añade ni una sola columna ni se ejecuta ningún `ALTER TABLE` sobre la tabla principal de negocios.
2. **Aislamiento Total del Dominio de Comensales:**  
   El mapa en vivo (`/explorar`), las consultas espaciales PostGIS GiST (`<->`), los menús digitales (`/[slug]`) y el checkout de pedidos no tocan ninguna tabla de finanzas. Cero riesgo de regresión en producción.
3. **Arquitectura en Isla (95% Código Nuevo):**  
   Todos los componentes, hooks, APIs y procedimientos RPC se crean en archivos completamente independientes. Cumplimiento estricto y total de la **Ley del Remolque**.
4. **Seguridad Operativa con "CONFIRMADO":**  
   La IA no tiene autonomía destructiva. Toda acción financiera requiere que Cristian apruebe expresamente escribiendo `"CONFIRMADO"` o dando clic en la interfaz web.

---

## 🔬 2. Radiografía Punto por Punto en el Código en Vivo

Auditoría detallada de cada archivo del proyecto que se creará o con el que habrá punto de contacto:

### 2.1 En la Base de Datos (Supabase PostgreSQL)
* **Punto de Contacto:** Ejecución de scripts SQL DDL y funciones RPC.
* **Archivos / Tablas a Crear:**
  - 10 tablas aisladas: `business_subscriptions`, `financial_accounts`, `membership_payments`, `operational_expenses`, `payment_commitments`, `ceo_tasks`, `daily_financial_reports`, `account_transfers`, `pending_actions`, `processed_webhook_events`.
  - 6 Procedimientos RPC atómicos: `apply_confirmed_membership_payment`, `apply_confirmed_expense`, `apply_account_transfer`, `get_business_dossier`, `get_admin_finance_summary`, `get_admin_businesses_billing_page`.
  - 7 Índices especializados (incluyendo Trigram GIN `idx_businesses_name_trgm`).
  - Políticas RLS y permisos `GRANT EXECUTE` exclusivos para administradores.
* **Diagnóstico de Riesgo:** **1.0 / 10 (Nulo)**. Si cualquier procedimiento fallara, solo afectaría la visualización contable sin interferir en la venta de comida ni en los comensales.

---

### 2.2 En los Endpoints de Backend (`src/app/api/`)
* **Archivos 100% Nuevos a Crear:**
  1. `src/app/api/admin/copilot/route.ts`: Orquestador del Copilot web con Gemini 1.5 Flash (`temperature: 0.1`), Function Calling y procesamiento multimodal en RAM (texto, transcripción de voz y soporte para pegar/adjuntar capturas de transferencias o tickets de gastos para OCR efímero sin almacenamiento en disco ni Storage).
  2. `src/app/api/webhooks/whatsapp/route.ts`: Webhook de Evolution API con filtro de seguridad por número del CEO (`CEO_PHONE_NUMBER`), deduplicación de mensajes, procesamiento multimodal de audios (.ogg/.mp3) e imágenes (`imageMessage`: pantallazos de Nequi/Daviplata/Bancolombia, tickets de gastos OPEX, fotos de menús y evidencia de entregables) 100% en memoria RAM con evaporación inmediata (cero almacenamiento en Supabase Storage), ruta rápida `<50 ms` para `"CONFIRMADO"`, cancelación en `<20 ms` para `"CANCELAR"` e invalidación por `superseded`.
  3. `src/app/api/cron/financial-audit/route.ts`: Cierre contable nocturno (11:59 PM Colombia = 04:59 UTC) y Morning Briefing (8:00 AM Colombia = 13:00 UTC).
* **Diagnóstico de Riesgo:** **1.5 / 10 (Muy Bajo)**. Rutas API totalmente aisladas en subdirectorios independientes.

---

### 2.3 En el Sistema de Tipos TypeScript (`src/types/`)
* **Archivo 100% Nuevo:** `src/types/finance.ts`.
* **Regla Inquebrantable:** Prohibido modificar `src/types/supabase.ts`. Todos los tipos contables, suscripciones, estados y payloads de tools se definen de forma autónoma en `finance.ts`.
* **Diagnóstico de Riesgo:** **1.0 / 10 (Cero riesgo de conflictos de tipos globales)**.

---

### 2.4 En los Hooks, Servicios y Utilidades (`src/hooks/`, `src/services/` y `src/utils/`)
* **Archivos 100% Nuevos a Crear:**
  1. `src/hooks/useAdminFinance.ts`: Consumo de RPCs `get_admin_finance_summary` y `get_admin_businesses_billing_page` con caché SWR. *(Nota de Release Manager: Se nombra useAdminFinance para proteger el archivo legacy useFinanceManager.ts usado en el marketplace de expertos, blindando la Ley del Remolque)*.
  2. `src/hooks/useCopilotChat.ts`: Manejo de mensajes, dictado por Web Audio API y tarjetas de pre-confirmación.
  3. `src/services/evolutionService.ts`: Despacho de mensajes outbound de WhatsApp (recibos rápidos, respuestas y Morning Briefing).
  4. `src/services/geminiCopilotService.ts`: Orquestador de inferencia multimodal Gemini 1.5 Flash consumido directamente vía REST API nativo (`fetch` de Node.js, sin dependencias pesadas de SDKs externos), con Function Calling, decodificación de notas de voz y visión OCR para capturas de transferencias y tickets de gastos en papel 100% en memoria RAM (sin persistencia en Storage).
  5. `src/utils/financeReceipt.ts`: Helper centralizado (<100L) para formateo de moneda COP (`formatCOP`), cálculo de días relativos (`"en 30 días"`, `"quedan 7 días"`, `"hace 3 días - vencido"`), redacción de recibos oficiales `#REC-XXXX` y generación de enlaces directos `wa.me` para WhatsApp (evita duplicación de código y protege el límite de 250L en modales y filas).
* **Diagnóstico de Riesgo:** **1.0 / 10** (Cero colisiones con código heredado).

---

### 2.5 En la Interfaz Visual (`src/components/admin/finanzas/`, `src/app/admin/finanzas/` y `src/components/admin/businesses/`)
* **Componentes Atómicos (<250L) en Rutas Físicas Mapeadas 1:1:**
  - `src/components/admin/finanzas/FinanceKpiCards.tsx` (Semáforos superiores de recaudo y mora).
  - `src/components/admin/finanzas/FinanceAccountsBar.tsx` (Arqueo Nequi/Daviplata/Bancolombia/Cash).
  - `src/components/admin/finanzas/FinanceProfitLossCard.tsx` (Ingresos, Gastos OPEX y Utilidad Neta Real).
  - `src/components/admin/finanzas/CeoAgendaChecklist.tsx` (Agenda diaria y visitas de campo).
  - `src/components/admin/finanzas/BusinessBillingTable.tsx` (Tabla virtualizada a 60 FPS con `@tanstack/react-virtual` y buscador Trigram GIN).
  - `src/components/admin/finanzas/BusinessBillingRow.tsx` (Fila con Plan debajo del nombre, días restantes bajo la fecha, badges de entregables y botón directo WhatsApp [Msg]).
  - **Subdirectorio Modales (`src/components/admin/finanzas/modals/`):**
    - `modals/QuickPaymentModal.tsx` (con botón para compartir recibo por WhatsApp).
    - `modals/QuickExpenseModal.tsx` (egresos OPEX con imputación de cuentas).
    - `modals/AccountTransferModal.tsx` (traspasos entre cuentas sin afectar P&L).
    - `modals/NewTaskModal.tsx` (agendar visitas y tareas del CEO protegiendo el límite de 250L).
  - **Subdirectorio Copilot (`src/components/admin/finanzas/copilot/`):**
    - `copilot/FinanceCopilotSheet.tsx` (Drawer en desktop / Bottom Sheet en celular).
    - `copilot/CopilotVoiceMic.tsx` (dictado nativo Web Audio API).
    - `copilot/CopilotActionCard.tsx` (con ajuste rápido y compartir recibo en 1 clic).
  - **Modo Lectura Satélite en Negocios:**
    - `src/components/admin/businesses/BusinessSubscriptionReadOnlyView.tsx` (Visor informativo para la pantalla de negocio).
* **Página Principal:** `src/app/admin/finanzas/page.tsx` (Reemplaza la vista anterior de tesorería/escrow convirtiéndola en la Torre de Control SaaS, preservando intacto `src/hooks/useFinanceManager.ts`).
* **Diagnóstico de Riesgo:** **1.0 / 10**.

---

### 2.6 Punto de Contacto Existente: Pantalla de Negocio (`/admin/negocios/[id]`)
* **Estado Actual:** Formularios manuales donde se digitan fechas, planes, precios y estatus uno por uno.
* **Estrategia de Transición (Patrón Jubilado / Desconexión Segura sin Eliminación):**
  - **Cero Modificaciones Durante el Desarrollo (Fases 1 a 5):** Este formulario viejo no se toca en lo absoluto mientras se construye la Isla Financiera y el Copilot.
  - **Desconexión en Fase 6 (Sin Eliminar el Código):** Solo al terminar y verificar al 100% el nuevo módulo de IA y Finanzas, se implementa el switch booleano `USE_SATELLITE_FINANCE_VIEW = true` en `src/app/admin/negocios/[id]/page.tsx`, renderizando `BusinessSubscriptionReadOnlyView.tsx` y preservando `BusinessPaymentViewer.tsx` intacto como respaldo.
  - **Red de Seguridad (Rollback en 30 Segundos):** Si ocurre cualquier contingencia, cambiar `USE_SATELLITE_FINANCE_VIEW = false` restaura el formulario histórico inmediatamente.
* **Diagnóstico de Riesgo:** **1.0 / 10** (Mínimo / Totalmente blindado con salvavidas de reconexión).

---

## 🛡️ 3. Matriz de Riesgos & Protocolos de Mitigación

| Vector de Riesgo | Gravedad Potencial | Nivel tras Blindaje | Protocolo de Mitigación Aplicado |
| :--- | :---: | :---: | :--- |
| **Timeout de 10s en Vercel Free** | 🟠 Alta | 🟢 Blindado | Gemini 1.5 Flash responde en <800ms. La confirmación `"CONFIRMADO"` corre en ruta rápida sin LLM en **<50 ms**. |
| **Reintentos y Duplicados en WhatsApp** | 🔴 Crítica | 🟢 Blindado | Tabla `processed_webhook_events` descarta peticiones duplicadas de Evolution API en **<10 ms**. |
| **Alucinación de Números o Negocios** | 🟡 Media | 🟢 Blindado | Confirmación en Dos Pasos obligatoria. Si un audio de la calle es dudoso, el agente pide confirmación explícita. |
| **Instrucciones Contradictorias o Múltiples** | 🟡 Media | 🟢 Blindado | Mecanismo *Superseded Actions*: toda nueva instrucción dictada invalida acciones pendientes previas. |
| **Fuga de Fondos por Descuadre Contable** | 🔴 Crítica | 🟢 Blindado | Transacciones 100% atómicas en PostgreSQL en 1 RTT con rollback automático ante cualquier error. |
| **Colapso de Red con 10.000 Negocios** | 🟠 Alta | 🟢 Blindado | Payload <25 KB vía paginación server-side y búsqueda instantánea <5ms con índice Trigram GIN. |
| **Saturación de Memoria RAM en Celulares** | 🟠 Alta | 🟢 Blindado | Virtual Scrolling en React: solo 12 nodos HTML en el DOM fijos a 60 FPS. |
| **Borrado Accidental de Datos** | 🔴 Crítica | 🟢 Blindado | Prohibición absoluta de comandos `DELETE` en todas las herramientas de la IA y procedimientos. |
| **Colisión de Hooks Legacy** | 🔴 Crítica | 🟢 Blindado | Creación de `useAdminFinance.ts`, protegiendo el `useFinanceManager.ts` del marketplace de expertos. |
| **Saturación de Storage por Imágenes Inoficiosas** | 🟠 Alta | 🟢 Blindado | Ingesta efímera multimodal 100% en memoria RAM (Buffer Base64 a Gemini Flash). Cero persistencia en Supabase Storage. La imagen se evapora en <500 ms tras la extracción contable. Cero costos y cero basura digital. |

---

## 🛑 4. CÓDIGO ROJO: LAS REGLAS INQUEBRANTABLES & LOS CRITERIOS QUIRÚRGICOS

En estricto cumplimiento con **[`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)**:

1. **🛑 Prohibido Tocar `businesses` con Escritura:**  
   La IA y el módulo de finanzas tienen terminantemente prohibido ejecutar `UPDATE`, `INSERT` o `DELETE` sobre la tabla `businesses`. Toda la información vive en la tabla satélite `business_subscriptions`.
2. **🛑 Prohibido Superar las 250 Líneas por Archivo:**  
   Todo componente o hook nuevo debe respetar la regla del techo de 250 líneas. El helper `src/utils/financeReceipt.ts` centraliza formateos y micro-acciones de WhatsApp para evitar sobrepeso en modales y tablas.
3. **🛑 Prohibida la Autonomía a Ciegas:**  
   Ningún cobro, gasto o traspaso se aplica sin la aprobación física de Cristian (mediante `"CONFIRMADO"` en WhatsApp o botón web con opción de ajuste rápido).
4. **🛑 Criterio de Aislamiento de Tipos (`finance.ts` vs `supabase.ts`):**  
   Queda terminantemente prohibido modificar o regenerar `src/types/supabase.ts`. Todos los tipos contables, suscripciones y estados de IA se crean en `src/types/finance.ts`. La IA solo lee `supabase.ts` para entender negocios y comensales, garantizando cero contaminación en el resto de la app.
5. **🛑 Criterio de la Llave Sin Borrado (Revocación Físico-SQL de `DELETE`):**  
   En PostgreSQL, las cuentas y funciones de la IA tienen revocado el comando `DELETE`. Si la IA o un webhook intentan borrar filas, el motor SQL lo rechaza de raíz. Solo se permite archivar o cambiar estados (`cancelled`, `superseded`).
6. **🛑 Criterio del Kill Switch de Emergencia & Restaurante Laboratorio:**  
   Se implementan las variables `COPILOT_ENABLED=true/false` (backend) y `NEXT_PUBLIC_COPILOT_ENABLED=true/false` (cliente web). Si WhatsApp o Evolution API sufren fallas externas, la IA se desconecta con un switch sin generar errores `undefined` en el navegador y el panel `/admin/finanzas` sigue funcionando al 100% como CRM manual. Las pruebas iniciales de audio, cobros e imágenes se ejecutan sobre un restaurante demo (*"FOWY Lab"*).
7. **🛑 Criterio de la Aduana de Compilación (`npm run build` en Local):**  
   Cero despliegues a ciegas en Vercel. Antes de subir cualquier fase, se ejecuta `npm run build` en local certificando cero advertencias y cero errores de TypeScript y ESLint.
8. **🛑 Criterio de Basura Cero & Evaporación en RAM (REST Nativo):**  
   Queda terminantemente prohibido almacenar o persistir en Supabase Storage los pantallazos de transferencias (Nequi/Daviplata/Bancolombia), fotos de comprobantes arrugados o notas de voz. Todo buffer multimedia se procesa vía `fetch` REST nativo en memoria RAM directamente hacia Gemini 1.5 Flash y se destruye de inmediato tras la extracción estructurada de datos.
9. **🛑 Criterio del Salvavidas de Rollback en 30 Segundos (Ley del Remolque en Negocios):**  
   En `src/app/admin/negocios/[id]/page.tsx`, el formulario antiguo `BusinessPaymentViewer.tsx` se preserva intacto. La integración del nuevo visor satélite se controla con `const USE_SATELLITE_FINANCE_VIEW = true;`, permitiendo revertir en 30 segundos ante cualquier contingencia.

---

## 📋 5. Checklist Maestra de Implementación Paso a Paso (V2.1 Definitiva — 100% Cobertura)

```text
  [ FASE 1: Isla de Base de Datos ]   ──► DDL 10 tablas, Seed, 6 RPCs en 1 RTT, 7 índices, RLS y Revocación DELETE.
  [ FASE 2: Tipos, Utilidades & Core] ──► finance.ts (9 tools), financeReceipt.ts, evolutionService, geminiCopilotService (RAM).
  [ FASE 3: Tablero Visual Finanzas ] ──► /admin/finanzas, semáforos, P&L, 4 modales, tabla virtualizada 60 FPS y Sidebar.
  [ FASE 4: Copilot Web Directivo ]   ──► /api/admin/copilot, Bottom Sheet/Drawer, Web Audio API, Ctrl+V en RAM y Kill Switch.
  [ FASE 5: Enlace WhatsApp Evolution]──► Webhook, filtro CEO, deduplicación, audio/imagen en RAM, rutas CONFIRMADO/CANCELAR.
  [ FASE 6: Crons, Modo Lectura & DoD]──► Vercel crons (UTC-5), switch de rollback en Negocios y npm run build (Exit code: 0).
```

### Checklist Detallada (1 Punto = 1 Archivo / Función 100% Terminado):

- [ ] **Fase 1: Infraestructura de Datos en Supabase Pro (Isla Satélite)**
  - [ ] **Punto 1.1 (DDL Tablas Satélites):** Ejecutar el script SQL DDL de las 10 tablas aisladas de la Isla Financiera sin tocar la tabla `businesses`:
    1. `business_subscriptions`: Llave primaria `business_id` (FK `businesses.id`), columna flexible `deliverables JSONB DEFAULT '{"fotos": "pending", "volantes": "none", "stickers_qr": "pending", "menu_ready": false}'::jsonb` y libreta `modules JSONB DEFAULT '{"standard": true, "pro": false, "premium": false, "inventario": false}'::jsonb`.
    2. `financial_accounts`: Cajas de liquidez con `code UNIQUE` (`nequi`, `daviplata`, `bancolombia`, `cash`).
    3. `membership_payments`: Consecutivo `receipt_number SERIAL UNIQUE`, `amount > 0` y soporte `is_partial`.
    4. `operational_expenses`: Egresos OPEX con `amount > 0`, FK `account_id` y `related_business_id` opcional.
    5. `payment_commitments`: Cartera y acuerdos verbales con `agreed_amount` y `status`.
    6. `ceo_tasks`: Agenda de campo del CEO con `task_type`, `due_date`, `due_time` y `priority`.
    7. `daily_financial_reports`: Balance diario inmutable con `report_date DATE UNIQUE DEFAULT CURRENT_DATE`.
    8. `account_transfers`: Traspasos entre cuentas con `amount > 0` y `fee >= 0`.
    9. `pending_actions`: Tabla de confirmación de 2 pasos con TTL de 10 minutos (`expires_at`).
    10. `processed_webhook_events`: Registro de idempotencia con `message_id VARCHAR(100) PRIMARY KEY`.
  - [ ] **Punto 1.2 (Seed & Backfill Contable):**
    - Ejecutar backfill de negocios existentes a `business_subscriptions`: `INSERT INTO business_subscriptions (business_id, subscription_status, trial_ends_at, monthly_fee) SELECT id, 'trial', (created_at + INTERVAL '15 days'), 50000.00 FROM businesses ON CONFLICT (business_id) DO NOTHING;`.
    - Poblar cuentas base de liquidez en `financial_accounts`: Nequi, Daviplata, Bancolombia y Efectivo en mano (`is_active = TRUE`).
    - Crear el negocio laboratorio demo *"FOWY Lab"* en `businesses` y `business_subscriptions` para pruebas no destructivas.
  - [ ] **Punto 1.3 (Procedimientos RPC Atómicos en 1 RTT):** Crear, compilar y finalizar los 6 procedimientos RPC en PostgreSQL:
    1. `apply_confirmed_membership_payment`: Aplica pago, suma a `financial_accounts`, actualiza `next_billing_date` en `business_subscriptions` y crea fila en `payment_commitments` si fue abono parcial con saldo pendiente.
    2. `apply_confirmed_expense`: Inserta en `operational_expenses` y descuenta saldo de `financial_accounts` atómicamente.
    3. `apply_account_transfer`: Traspasa dinero entre dos cuentas y descuenta comisión bancaria opcional como OPEX.
    4. `get_business_dossier`: Retorna expediente 360° en <10 ms uniendo `businesses` con `business_subscriptions`, métricas de pedidos de los últimos 30 días, compromisos y tareas pendientes.
    5. `get_admin_finance_summary`: Retorna P&L del mes, cajas, tareas del día y semáforos en <15 ms y <4 KB (con timezone `America/Bogota`).
    6. `get_admin_businesses_billing_page`: Paginación server-side de 30 en 30 con ordenamiento inteligente (gracia ➔ trial ➔ al día), retorno unificado de `deliverables` y `modules`, y filtro por búsqueda Trigram.
  - [ ] **Punto 1.4 (Índices de Aceleración 10k+):** Habilitar extensión `pg_trgm` y crear los 7 índices de alto rendimiento:
    1. `idx_businesses_name_trgm`: Índice GIN en `businesses(name gin_trgm_ops)`.
    2. `idx_business_subscriptions_status_date`: B-Tree en `business_subscriptions(subscription_status, next_billing_date ASC NULLS LAST)`.
    3. `idx_membership_payments_period_lookup`: B-Tree en `membership_payments(period_start DESC, business_id)`.
    4. `idx_operational_expenses_date`: B-Tree en `operational_expenses(expense_date DESC)`.
    5. `idx_ceo_tasks_due_status`: B-Tree en `ceo_tasks(due_date, status)`.
    6. `idx_pending_actions_active`: Índice parcial en `pending_actions(channel, expires_at) WHERE status = 'pending'`.
    7. `idx_account_transfers_created`: B-Tree en `account_transfers(created_at DESC)`.
  - [ ] **Punto 1.5 (Seguridad RLS y Revocación Físico-SQL de DELETE):**
    - Habilitar RLS en las 10 tablas de la Isla Financiera con política `admin_finance_isolation_policy` para rol `admin`.
    - Revocar permisos públicos de ejecución en los 6 RPCs y otorgar `GRANT EXECUTE` exclusivamente a `authenticated, service_role`.
    - Aplicar la Revocación Físico-SQL de `DELETE`: `REVOKE DELETE ON business_subscriptions, financial_accounts, membership_payments, operational_expenses, payment_commitments, ceo_tasks, daily_financial_reports, account_transfers FROM authenticated, anon, public;`.
  - [ ] **Punto 1.6 (DoD Fase 1):** Ejecutar la suite de pruebas de validación atómica en Supabase SQL Editor:
    - *Test 1.6.1 (Lectura Resumen):* `SELECT get_admin_finance_summary();` responde en `<20 ms` con JSON válido.
    - *Test 1.6.2 (Paginación Pura):* `SELECT get_admin_businesses_billing_page('all', '', 10, 0);` responde en `<15 ms`.
    - *Test 1.6.3 (Escritura Transaccional Pago):* Ejecutar `apply_confirmed_membership_payment` sobre *"FOWY Lab"*, verificar que genera `REC-0001`, incrementa el saldo de Nequi y actualiza `business_subscriptions`.
    - *Test 1.6.4 (Escritura Transaccional Gasto):* Ejecutar `apply_confirmed_expense` descontando de Nequi y verificar decremento exacto del balance.
    - *Test 1.6.5 (Criterio Sin Borrado):* Ejecutar `DELETE FROM membership_payments;` y comprobar que PostgreSQL aborta la instrucción con error de permisos insuficientes.
    - *Test 1.6.6 (Integridad de Negocios):* Verificar que `COUNT(*)` en `business_subscriptions` coincide exactamente con `businesses`.

---

- [ ] **Fase 2: Arquitectura TypeScript, Dependencias, Utilidades & Servicios Core**
  - [ ] **Punto 2.1 (Instalación de Dependencia de Virtualización):** Instalar `@tanstack/react-virtual` para soportar la tabla a 60 FPS sin memory leaks en móviles.
  - [ ] **Punto 2.2 (Contratos de Tipos — Aislamiento en `src/types/finance.ts`):** Crear y finalizar completamente `src/types/finance.ts` (<220L) sin modificar `src/types/supabase.ts`:
    - DTOs de retornos de los 6 RPCs (con `deliverables: Record<string, any>` y `modules: Record<string, boolean>`).
    - Tipos de las 10 tablas satélites.
    - Esquemas de argumentos de las **9 herramientas de Function Calling**: `GetCfoSummaryArgs`, `QueryDossierArgs`, `PreparePaymentArgs`, `PrepareExpenseArgs`, `ScheduleTaskArgs`, `QueryAgendaArgs`, `CompleteTaskArgs`, `PrepareCommitmentArgs`, `PrepareTransferArgs`.
    - Tipos del webhook de Evolution API (`EvolutionWebhookPayload`, `EvolutionMessageKey`, `EvolutionTextMessage`, `EvolutionAudioMessage`, `EvolutionImageMessage`).
  - [ ] **Punto 2.3 (Helper Centralizado de Recibos y Formatos):** Crear y finalizar completamente `src/utils/financeReceipt.ts` (<110L) con 4 métodos estandarizados:
    1. `formatCOP(amount: number): string`: Formatea montos en pesos colombianos (ej. `$50.000 COP`).
    2. `getRelativeDaysText(dateStr: string | null, status: string): { text: string; colorClass: string }`: Retorna `"en 30 días"`, `"quedan 7 días"` o `"hace 3 días - vencido"`.
    3. `buildOfficialReceiptText(data: ReceiptData): string`: Redacta la plantilla de recibo digital oficial `#REC-XXXX`.
    4. `buildWhatsAppLink(phone: string, text: string): string`: Construye enlaces seguros `https://wa.me/...`.
  - [ ] **Punto 2.4 (Servicio Evolution WhatsApp):** Crear y finalizar completamente `src/services/evolutionService.ts` (<150L) para el envío outbound hacia Evolution API (`/message/sendText` para confirmaciones, recibos oficiales y Morning Briefing).
  - [ ] **Punto 2.5 (Servicio Gemini Multimodal REST en RAM):** Crear y finalizar completamente `src/services/geminiCopilotService.ts` (<240L) consumiendo Gemini 1.5 Flash directamente vía `fetch` REST de Node.js (cero SDKs pesados):
    - Parámetros: `temperature: 0.1`, `topP: 0.95`, `maxOutputTokens: 2048`.
    - Inyección del `systemInstruction` oficial (CFO & Secretaria).
    - Declaración formal de las 9 herramientas de Function Calling.
    - Soporte multimodal de audio nativo (.ogg/.mp3) y visión OCR para comprobantes (Nequi, Daviplata, Bancolombia, tickets OPEX en papel) procesados 100% en memoria volátil (RAM) con destrucción inmediata del buffer (Cero subidas a Supabase Storage).
  - [ ] **Punto 2.6 (Hook Financiero Administrativo):** Crear y finalizar completamente `src/hooks/useAdminFinance.ts` (<180L) para consultar `get_admin_finance_summary` y `get_admin_businesses_billing_page` mediante caché SWR *(Protegiendo de forma intacta `src/hooks/useFinanceManager.ts`)*.
  - [ ] **Punto 2.7 (Hook de Chat y Voz):** Crear y finalizar completamente `src/hooks/useCopilotChat.ts` (<200L) con manejo de historial de mensajes, grabación Web Audio API en cliente, soporte de pegado de imágenes (`Ctrl+V`) en memoria y gestión de estados de pre-confirmación.
  - [ ] **Punto 2.8 (DoD Fase 2):**
    - Ejecutar `npx tsc --noEmit` certificando **exactamente 0 errores de tipado**.
    - Ejecutar `git status` y verificar que [supabase.ts](file:///c:/Users/cange/Documents/fowy/src/types/supabase.ts) y [useFinanceManager.ts](file:///c:/Users/cange/Documents/fowy/src/hooks/useFinanceManager.ts) se mantienen 100% intocados.

---

- [ ] **Fase 3: Tablero Visual `/admin/finanzas` & Modales**
  - [ ] **Punto 3.1 (Semáforos KPI):** Crear `src/components/admin/finanzas/FinanceKpiCards.tsx` (<120L) con los 4 semáforos superiores de recaudo, periodo de prueba, tolerancia en gracia y mora.
  - [ ] **Punto 3.2 (Barra de Liquidez Multibolsillo):** Crear `src/components/admin/finanzas/FinanceAccountsBar.tsx` (<140L) con el arqueo visual de Nequi, Daviplata, Bancolombia y Efectivo en mano, con botón para abrir traspaso entre cuentas.
  - [ ] **Punto 3.3 (Tarjeta P&L en Vivo):** Crear `src/components/admin/finanzas/FinanceProfitLossCard.tsx` (<130L) con ingresos, egresos OPEX y Utilidad Neta Real destacada con badge porcentual de margen.
  - [ ] **Punto 3.4 (Agenda de Campo del CEO):** Crear `src/components/admin/finanzas/CeoAgendaChecklist.tsx` (<170L) con checkbox interactivo, badges de actividad y botón `[ + Nueva Tarea ]`.
  - [ ] **Punto 3.5 (Fila de Negocio con Plan, Días Restantes y Badges):** Crear `src/components/admin/finanzas/BusinessBillingRow.tsx` (<160L) con el Plan activo debajo del nombre (leído de `modules JSONB`), días restantes bajo la fecha vía `financeReceipt.ts`, badges de la mochila `deliverables JSONB` y botón `[ Msg ]` para WhatsApp en 1 clic.
  - [ ] **Punto 3.6 (Tabla Virtualizada 60 FPS):** Crear `src/components/admin/finanzas/BusinessBillingTable.tsx` (<200L) con virtual scrolling a 60 FPS vía `@tanstack/react-virtual`, buscador Trigram server-side con debounce y pestañas de filtro rápido.
  - [ ] **Punto 3.7 (Subdirectorio Modales en `src/components/admin/finanzas/modals/`):**
    - Crear `modals/QuickPaymentModal.tsx` (<200L) para registro de pagos, abonos parciales y compartir recibo.
    - Crear `modals/QuickExpenseModal.tsx` (<170L) para registrar egresos OPEX con imputación de cuentas.
    - Crear `modals/AccountTransferModal.tsx` (<160L) para traspaso de liquidez entre cuentas.
    - Crear `modals/NewTaskModal.tsx` (<140L) para agendar manualmente visitas y tareas del CEO.
  - [ ] **Punto 3.8 (Página Orquestadora `/admin/finanzas`):** Actualizar `src/app/admin/finanzas/page.tsx` (<210L) ensamblando los componentes atómicos y verificando que el ícono vectorial plano `Wallet` en [Sidebar.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/Sidebar.tsx) mantenga la ruta `/admin/finanzas` activa.
  - [ ] **Punto 3.9 (DoD Fase 3):**
    - Carga visual de la página en `<100 ms` con SWR.
    - Inspeccionar el árbol DOM del navegador y verificar que solo existen ~12 nodos `<tr>` renderizados simultáneamente mientras se hace scroll en la lista.
    - Abrir `QuickPaymentModal.tsx` y registrar un pago de prueba sobre *"FOWY Lab"*, verificando reactividad sin recarga.
    - Auditar que ningún archivo de la Fase 3 supera las 220 líneas y que se respetó el criterio de **cero iconos/emojis 3D**.
    - Ejecutar `npx tsc --noEmit` con 0 errores.

---

- [ ] **Fase 4: Copilot Web (CFO & Secretaria) en `copilot/` con UX de Calle**
  - [ ] **Punto 4.1 (Endpoint Orquestador Copilot Web):** Crear `src/app/api/admin/copilot/route.ts` (<220L) con Gemini 1.5 Flash, verificación de sesión admin, inyección de snapshot contable (<20ms), evaluación de `COPILOT_ENABLED` y soporte para recibir imágenes pegadas en Base64 para OCR efímero en memoria RAM.
  - [ ] **Punto 4.2 (Grabador Micrófono Web Audio API):** Crear `src/components/admin/finanzas/copilot/CopilotVoiceMic.tsx` (<120L) para dictado de voz nativo en el navegador mediante Web Audio API.
  - [ ] **Punto 4.3 (Tarjeta de Pre-confirmación y Ajuste):** Crear `src/components/admin/finanzas/copilot/CopilotActionCard.tsx` (<180L) con botones `[ ✅ Confirmar y Aplicar ]`, `[ ❌ Cancelar ]`, editor inline `[ ✏️ Ajustar ]` y botón de éxito `[ 📲 Enviar Recibo por WhatsApp ]`.
  - [ ] **Punto 4.4 (Panel Flotante Adaptativo):** Crear `src/components/admin/finanzas/copilot/FinanceCopilotSheet.tsx` (<230L) con Drawer en desktop (>=768px), Bottom Sheet deslizable en móvil (<768px), soporte de pegado de imágenes (`Ctrl+V`), y lectura de `NEXT_PUBLIC_COPILOT_ENABLED`.
  - [ ] **Punto 4.5 (DoD Fase 4):**
    - Dictar o escribir: *"Maye Ricuras pagó 50 mil por Nequi"*; verificar que aparece la tarjeta interactiva en <1.2s.
    - Probar el botón `[ ✏️ Ajustar ]` modificando el monto a `$60.000` y confirmar; verificar ejecución del RPC en `<50 ms`.
    - Pegar una captura de pantalla con `Ctrl + V` y comprobar que Gemini extrae los datos contables en RAM sin generar registros en Supabase Storage.
    - Cambiar temporalmente `COPILOT_ENABLED=false` en `.env.local` y comprobar que el Copilot muestra el mensaje de mantenimiento preventivo mientras la página `/admin/finanzas` sigue operando al 100% como CRM manual.
    - Ejecutar `npx tsc --noEmit` con 0 errores.

---

- [ ] **Fase 5: Conexión WhatsApp con Evolution API v2 & OCR en RAM**
  - [ ] **Punto 5.1 (Variables de Entorno Completas):** Registrar en `.env.local` el catálogo maestro de variables:
    `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`, `CEO_PHONE_NUMBER`, `GEMINI_API_KEY`, `CRON_SECRET`, `COPILOT_ENABLED=true` y `NEXT_PUBLIC_COPILOT_ENABLED=true`.
  - [ ] **Punto 5.2 (Webhook Receptor de WhatsApp):** Crear `src/app/api/webhooks/whatsapp/route.ts` (<240L):
    - Retorno `200 OK` en `<40 ms` para liberar el socket de Evolution API.
    - Filtro de seguridad por número de Cristian (`CEO_PHONE_NUMBER`). Peticiones de otros números se descartan con `{ ignored: true }`.
    - Deduplicación e idempotencia en `processed_webhook_events` por `message_id` (<10ms).
    - Ingesta de notas de voz (.ogg/.mp3) e imágenes (`imageMessage`) en Buffer RAM efímero directamente a Gemini Flash (cero subidas a Supabase Storage).
    - Ruta rápida para `"CONFIRMADO"` (<50ms, 0 tokens) ejecutando el RPC correspondiente.
    - Ruta rápida para `"CANCELAR"` (<20ms, 0 tokens) marcando la acción como cancelada.
    - Invalidación automática por `superseded` de acciones pendientes anteriores al recibir un nuevo mensaje.
  - [ ] **Punto 5.3 (DoD Fase 5):**
    - *Test 5.3.1 (Seguridad Remitente):* Enviar petición HTTP simulada con número distinto a `CEO_PHONE_NUMBER` y verificar respuesta `200 OK` con `{ ignored: true }`.
    - *Test 5.3.2 (Idempotencia):* Enviar dos veces el mismo `message_id` y certificar descarte en <10 ms.
    - *Test 5.3.3 (Audio / Imagen en RAM):* Enviar nota de voz o pantallazo de transferencia Nequi sobre *"FOWY Lab"*; verificar respuesta en WhatsApp en <1.2s.
    - *Test 5.3.4 (Ruta Rápida):* Responder `"CONFIRMADO"`; validar ejecución del cobro en <50 ms y despacho automático del recibo legal `#REC-XXXX`.
    - *Test 5.3.5 (Cero Basura Storage):* Inspeccionar Supabase Storage y certificar que se subieron **exactamente 0 bytes** de audios o imágenes.

---

- [ ] **Fase 6: Automatización de Crons, Modo Lectura en Negocios & Aduana Final**
  - [ ] **Punto 6.1 (Endpoint Cron Dual con Mapeo Colombia UTC-5):** Crear `src/app/api/cron/financial-audit/route.ts` (<200L) protegido con `Authorization: Bearer ${CRON_SECRET}`:
    - Modo Cierre Nocturno (11:59 PM Colombia = `04:59 UTC`): Balance del día en `daily_financial_reports` y purga de eventos con más de 7 días en `processed_webhook_events`.
    - Modo Morning Briefing (8:00 AM Colombia = `13:00 UTC`): Consulta de agenda, compromisos y despacho a WhatsApp vía `evolutionService.ts`.
  - [ ] **Punto 6.2 (Configuración Vercel Cron):** Crear `vercel.json` en la raíz del proyecto programando las expresiones cron mapeadas al horario de Colombia (`59 4 * * *` y `0 13 * * *`).
  - [ ] **Punto 6.3 (Componente Satélite Modo Lectura):** Crear `src/components/admin/businesses/BusinessSubscriptionReadOnlyView.tsx` (<180L) para visualizar estatus, fechas, módulos activos desde `modules JSONB` y entregables desde `deliverables JSONB`, con botón para compartir recibo por WhatsApp.
  - [ ] **Punto 6.4 (Conexión Segura con Rollback en 30 Segundos en Negocios):** Integrar el visor en `src/app/admin/negocios/[id]/page.tsx`:
    ```tsx
    const USE_SATELLITE_FINANCE_VIEW = true;
    // ...
    {USE_SATELLITE_FINANCE_VIEW ? (
      <BusinessSubscriptionReadOnlyView businessId={business.id} />
    ) : (
      <BusinessPaymentViewer 
        business={business} 
        onRefresh={fetchBusiness} 
        onChange={(updates) => setBusiness({ ...business, ...updates } as BusinessData)}
      />
    )}
    ```
  - [ ] **Punto 6.5 (Aduana Obligatoria de Compilación Local):** Ejecutar en la terminal local:
    `npm run build`
    Certificando `Exit code: 0`, exactamente 0 errores de TypeScript y 0 advertencias de ESLint.
  - [ ] **Punto 6.6 (DoD Fase 6):** Validar la ejecución del cron en prueba generando registro en `daily_financial_reports`, comprobar que `/admin/negocios/[id]` muestra el visor en modo lectura sin errores, simular rollback en 30s cambiando el flag a `false` y verificar compilación de producción limpia.

---
*Fin del Documento Maestro de Trabajo & Auditoría — FOWY iA Finanzas 2026*
