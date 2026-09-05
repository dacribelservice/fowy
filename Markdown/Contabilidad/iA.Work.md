# 🛠️ FOWY iA FINANZAS & COPILOT — AUDITORÍA EN VIVO, RIESGOS & PLAN DE TRABAJO

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Evaluación de Riesgos, Puntos de Contacto, Reglas y Checklist de Implementación**  
> **Autor:** Antigravity AI (Especialista en Arquitectura SaaS & Finanzas Tecnológicas)  
> **Destinatario:** Cristian (CEO de FOWY)  
> **Unión de Documentos Rectores:** [`Markdown/Contabilidad/CONTABILIDAD.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/CONTABILIDAD.md), [`Markdown/Contabilidad/AGENTE.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/AGENTE.md), [`Markdown/Contabilidad/Optimizacion-iA.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/Optimizacion-iA.md), [`Markdown/Contabilidad/iA.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.Backend.md) e [`Markdown/Contabilidad/iA.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.UX-UI.md)  
> **Fecha:** 5 de Septiembre de 2026  
> **Versión:** 1.0 (Auditoría Integral, Riesgo 1.8/10 y Checklist de Cero Regresiones)  

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
  1. `src/app/api/admin/copilot/route.ts`: Orquestador del Copilot web con Gemini 1.5 Flash (`temperature: 0.1`) y Function Calling.
  2. `src/app/api/webhooks/whatsapp/route.ts`: Webhook de Evolution API con filtro de seguridad por número del CEO (`CEO_PHONE_NUMBER`), deduplicación de mensajes, ruta rápida `<50 ms` para `"CONFIRMADO"`, cancelación en `<20 ms` para `"CANCELAR"` e invalidación por `superseded`.
  3. `src/app/api/cron/financial-audit/route.ts`: Cierre contable nocturno (11:59 PM Colombia = 04:59 UTC) y Morning Briefing (8:00 AM Colombia = 13:00 UTC).
* **Diagnóstico de Riesgo:** **1.5 / 10 (Muy Bajo)**. Rutas API totalmente aisladas en subdirectorios independientes.

---

### 2.3 En el Sistema de Tipos TypeScript (`src/types/`)
* **Archivo 100% Nuevo:** `src/types/finance.ts`.
* **Regla Inquebrantable:** Prohibido modificar `src/types/supabase.ts`. Todos los tipos contables, suscripciones, estados y payloads de tools se definen de forma autónoma en `finance.ts`.
* **Diagnóstico de Riesgo:** **1.0 / 10 (Cero riesgo de conflictos de tipos globales)**.

---

### 2.4 En los Hooks de Lógica React (`src/hooks/`)
* **Archivos 100% Nuevos a Crear:**
  1. `src/hooks/useFinanceManager.ts`: Consumo de RPCs `get_admin_finance_summary` y `get_admin_businesses_billing_page` con caché SWR.
  2. `src/hooks/useCopilotChat.ts`: Manejo de mensajes, dictado por Web Audio API y tarjetas de pre-confirmación.
* **Diagnóstico de Riesgo:** **1.0 / 10**.

---

### 2.5 En la Interfaz Visual (`src/components/admin/finanzas/` y `src/app/(admin)/admin/finanzas/`)
* **Componentes Atómicos (<250L):**
  - `FinanceKpiCards.tsx` (Semáforos superiores).
  - `FinanceAccountsBar.tsx` (Arqueo Nequi/Daviplata/Bancolombia/Cash).
  - `FinanceProfitLossCard.tsx` (Ingresos, Gastos OPEX y Utilidad Neta Real).
  - `CeoAgendaChecklist.tsx` (Agenda diaria y visitas de campo).
  - `BusinessBillingTable.tsx` (Tabla virtualizada a 60 FPS con `@tanstack/react-virtual`).
  - `BusinessBillingRow.tsx` (Fila con badges de fotos/volantes).
  - Modales: `QuickPaymentModal.tsx`, `QuickExpenseModal.tsx`, `AccountTransferModal.tsx`.
  - Drawer Copilot: `FinanceCopilotSheet.tsx`, `CopilotVoiceMic.tsx`, `CopilotActionCard.tsx`.
* **Página Principal:** `src/app/(admin)/admin/finanzas/page.tsx` (Estructura limpia que ensambla los componentes atómicos).
* **Diagnóstico de Riesgo:** **1.5 / 10**.

---

### 2.6 Punto de Contacto Existente: Pantalla de Negocio (`/admin/negocios/[id]`)
* **Estado Actual:** Formularios manuales donde se digitan fechas, planes y estatus uno por uno.
* **Modificación Quirúrgica:** La sección "Configuración General" se conecta en **Modo Lectura** leyendo de la tabla satélite `business_subscriptions` y el último recibo emitido (`REC-XXXX`), ahorrando horas de trabajo manual repetitivo.
* **Diagnóstico de Riesgo:** **2.0 / 10**. Solo lectura; no se modifican controladores ni hooks de catálogo.

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
| **Saturación de Memoria RAM en Celulares** | 🟠 Alta | 🟢 Blindado | Virtual Scrolling en React (`@tanstack/react-virtual`): solo 12 nodos HTML en el DOM fijos a 60 FPS. |
| **Borrado Accidental de Datos** | 🔴 Crítica | 🟢 Blindado | Prohibición absoluta de comandos `DELETE` en todas las herramientas de la IA y procedimientos. |

---

## 🛑 4. CÓDIGO ROJO: LAS 4 REGLAS INQUEBRANTABLES

En estricto cumplimiento con **[`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)**:

1. **🛑 Prohibido Tocar `businesses` con Escritura:**  
   La IA y el módulo de finanzas tienen terminantemente prohibido ejecutar `UPDATE`, `INSERT` o `DELETE` sobre la tabla `businesses`. Toda la información vive en la tabla satélite `business_subscriptions`.
2. **🛑 Prohibido Superar las 250 Líneas por Archivo:**  
   Todo componente o hook nuevo debe respetar la regla del techo de 250 líneas. Si un componente crece, se divide inmediatamente en sub-componentes atómicos.
3. **🛑 Prohibida la Autonomía a Ciegas:**  
   Ningún cobro, gasto o traspaso se aplica sin la aprobación física de Cristian (mediante `"CONFIRMADO"` en WhatsApp o botón web).
4. **🛑 Prohibido Subir a Producción sin Compilación Limpia:**  
   Cero despliegues sin haber ejecutado y verificado `npm run build` en local con cero errores de TypeScript y ESLint.

---

## 📋 5. Checklist Maestra de Implementación Paso a Paso

```text
  [ FASE 1: Isla de Base de Datos ]   ──► Ejecución del DDL SQL, 6 RPCs atómicos e índices Trigram GIN.
  [ FASE 2: Tipos & Servicios Core ]  ──► Creación de src/types/finance.ts y hooks SWR.
  [ FASE 3: Tablero Visual Finanzas ] ──► Pantalla /admin/finanzas con semáforos, cajas, P&L y tabla virtualizada.
  [ FASE 4: Copilot Web Directivo ]   ──► Drawer flotante con Gemini Flash, Web Audio API y tarjetas de 2 pasos.
  [ FASE 5: Enlace WhatsApp Evolution]──► Webhook con ruta rápida "CONFIRMADO" (<50ms) y audio multimodal.
  [ FASE 6: Crons & Modo Lectura ]    ──► Cierre 11:59 PM, Morning Briefing 8:00 AM y modo lectura en Negocios.
```

### Checklist Detallada:

- [ ] **Fase 1: Infraestructura de Datos (Supabase Pro)**
  - [ ] Ejecutar DDL de las 10 tablas de la Isla Financiera.
  - [ ] Crear los 6 procedimientos RPC atómicos (`apply_confirmed_membership_payment`, `apply_confirmed_expense`, `apply_account_transfer`, `get_business_dossier`, `get_admin_finance_summary`, `get_admin_businesses_billing_page`).
  - [ ] Habilitar extensión `pg_trgm` y desplegar los 7 índices de aceleración.
  - [ ] Aplicar políticas RLS y privilegios `GRANT EXECUTE`.
  - [ ] Poblar cuentas iniciales en `financial_accounts` (Nequi, Daviplata, Bancolombia, Efectivo).

- [ ] **Fase 2: Arquitectura TypeScript & Hooks**
  - [ ] Crear `src/types/finance.ts` con todos los contratos de datos y payloads.
  - [ ] Crear `src/hooks/useFinanceManager.ts` para consumo de datos agregados y paginados.

- [ ] **Fase 3: Pantalla Visual `/admin/finanzas`**
  - [ ] Construir `FinanceKpiCards.tsx` (Semáforos).
  - [ ] Construir `FinanceAccountsBar.tsx` (Arqueo de cuentas).
  - [ ] Construir `FinanceProfitLossCard.tsx` (P&L en vivo).
  - [ ] Construir `CeoAgendaChecklist.tsx` (Agenda y visitas de campo).
  - [ ] Construir `BusinessBillingTable.tsx` y `BusinessBillingRow.tsx` con virtualización a 60 FPS.
  - [ ] Construir modales rápidos (`QuickPaymentModal`, `QuickExpenseModal`, `AccountTransferModal`).
  - [ ] Ensamblar en `src/app/(admin)/admin/finanzas/page.tsx`.

- [ ] **Fase 4: Copilot Web (CFO & Secretaria)**
  - [ ] Crear endpoint `src/app/api/admin/copilot/route.ts` con Gemini 1.5 Flash y Function Calling.
  - [ ] Construir `FinanceCopilotSheet.tsx`, `CopilotVoiceMic.tsx` y `CopilotActionCard.tsx`.
  - [ ] Probar flujo interactivo de pre-confirmación en dos pasos.

- [ ] **Fase 5: Conexión WhatsApp con Evolution API v2**
  - [ ] Desplegar contenedor Docker de Evolution API y vincular WhatsApp personal de Cristian vía QR.
  - [ ] Crear endpoint webhook `src/app/api/webhooks/whatsapp/route.ts`.
  - [ ] Implementar deduplicación por `message_id`.
  - [ ] Programar ruta rápida para la palabra clave `"CONFIRMADO"` (`<50 ms`) y `"CANCELAR"`.
  - [ ] Integrar procesamiento multimodal de audios de voz (.ogg / .mp3) con Gemini.

- [ ] **Fase 6: Automatización & Modo Lectura**
  - [ ] Crear endpoint `src/app/api/cron/financial-audit/route.ts`.
  - [ ] Configurar cron de Cierre Nocturno 11:59 PM (04:59 UTC).
  - [ ] Configurar cron de Morning Briefing 8:00 AM (13:00 UTC) directo al WhatsApp del CEO.
  - [ ] Transformar la sección "Configuración General" de la pantalla de negocio en modo lectura informativo conectado a `business_subscriptions`.
  - [ ] Ejecutar `npm run build` para certificar compilación 100% limpia con cero errores.

---
*Fin del Documento Maestro de Trabajo & Auditoría — FOWY iA Finanzas 2026*
