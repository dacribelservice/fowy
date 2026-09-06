# 🎨 FOWY iA FINANZAS & COPILOT — ESPECIFICACIÓN VISUAL (UX/UI)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Diseño de Interfaz, Wireframes, Flujos y Experiencia Visual**  
> **Autor:** Antigravity AI (Especialista en Arquitectura SaaS & Finanzas Tecnológicas)  
> **Destinatario:** Cristian (CEO de FOWY)  
> **Alineación:** [`Markdown/diseño.md`](file:///c:/Users/cange/Documents/fowy/Markdown/diseño.md), [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md) e [`Markdown/Contabilidad/iA.Backend.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.Backend.md)  
> **Fecha:** 5 de Septiembre de 2026  
> **Versión:** 1.1 (Diseño Modular, Experiencia Ejecutiva de Calle, Compartir Recibo WhatsApp en 1 Clic, Bottom Sheet Móvil y Cero Deuda Técnica <250L)  

---

## 🎯 1. Filosofía de Diseño: Diagnóstico en 3 Segundos & Movilidad en Calle

El módulo de Finanzas no es una hoja de cálculo aburrida; es la **Torre de Control del CEO de FOWY**. Su diseño se rige por cuatro premisas inquebrantables:
1. **Velocidad Cognitiva (Regla de los 3 Segundos):** Cristian debe abrir la pantalla en su celular o laptop y entender de inmediato el semáforo de su empresa: cuánto dinero hay en total, cuántos negocios están al día, cuántos deben cobrar hoy y qué visitas tiene programadas.
2. **Cero Trabajo Manual Esclavo:** La información comercial y de cobro se centraliza aquí. La pantalla de cada restaurante en `/admin/negocios` se convierte en un visor informativo en modo lectura.
3. **Ergonomía de Calle (Mobile-First Real):** El 70% de las interacciones del CEO ocurren caminando, en moto o visitando locales. El diseño adapta drawers a *Bottom Sheets* deslizables y permite despachar recibos por WhatsApp en un solo toque.
4. **Estética FOWY de Alto Impacto:** Paleta de colores Energy Orange (`#FF6B00` a `#FF8533`), tipografía moderna Inter/Poppins, tarjetas con bordes suaves (`rounded-2xl`), sombras sutiles, micro-animaciones y glassmorphism limpio.
5. **Iconografía & Emojis 100% Minimalistas (CERO 3D):** Queda **terminantemente prohibido el uso de iconos, stickers o emojis en 3D** (nada de burbujas volumétricas, renders tridimensionales inflados o estilo Fluent 3D). Todos los iconos de la plataforma, el Copilot, los dashboards y el comprobante PDF deben ser **100% minimalistas, vectoriales, planos (*flat*), de línea fina (*stroke* 1.5px a 2px)** utilizando exclusivamente la librería `lucide-react`. Los emojis utilizados en textos deben ser sobrios, estándar y planos.
6. **Desconexión Segura de Menú & Ley del Remolque (Cero Borrado):** La pantalla anterior de finanzas (`/admin/finanzas`, orientada al escrow y transacciones del marketplace) y su hook `useFinanceManager.ts` se mantienen **100% intactos en código** como respaldo histórico. En el menú lateral (`Sidebar.tsx`), el enlace viejo simplemente se desconecta (desaparece de la vista) y se añade la nueva pestaña visible **"Finanzas FOWY"** apuntando a su ruta independiente `/admin/finanzas-fowy`.

---

## 🖥️ 2. Wireframe Maestro de "Finanzas FOWY" (`/admin/finanzas-fowy`)

```text
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ 📑 PANEL DE FINANZAS FOWY & AGENTE FOWY — ADMINISTRACIÓN                      [ 🤖 AGENTE ] │
├─────────────────────────────────────────────────────────────────────────────────────────────┤
│ 1. SEMÁFOROS DE SUSCRIPCIÓN (KPIs SUPERIORES)                                               │
│ ┌──────────────────┬──────────────────┬──────────────────┬──────────────────────────────┐   │
│ │ 🟢 AL DÍA (18)   │ 🟡 EN PRUEBA (9) │ 🟠 EN GRACIA (3) │ 🔴 SUSPENDIDOS (2)           │   │
│ │ Recaudo: $900.000│ Días prom: 8     │ Cartera: $150.000│ En mora crítica              │   │
│ └──────────────────┴──────────────────┴──────────────────┴──────────────────────────────┘   │
│                                                                                             │
│ 2. INDICADORES DE EFICIENCIA & SALUD FINANCIERA (CPI / DSO / RUNWAY)                        │
│ ┌──────────────────┬──────────────────┬──────────────────┬──────────────────────────────┐   │
│ │ 🎯 CPI ONBOARDING│ ⏱️ DSO CARTERA   │ 🛡️ RUNWAY CAJA   │ 📈 MARGEN OPERATIVO          │   │
│ │ 1.14 (Eficiente) │ 3.4 días (Ágil)  │ 6.2 meses cubierto│ 70.5% neto                   │   │
│ └──────────────────┴──────────────────┴──────────────────┴──────────────────────────────┘   │
│                                                                                             │
│ 3. ARQUEO DE CAJAS & ESTADO DE RESULTADOS (P&L REAL)                                        │
│ ┌─────────────────────────────────────────────────────────┬───────────────────────────────┐ │
│ │ 💳 LIQUIDEZ POR CUENTA (Bolsillos)                      │ 📊 UTILIDAD NETA DEL MES      │ │
│ │ • Nequi:         $ 850.000 COP                          │ • Ingresos Cobrados: $950.000 │ │
│ │ • Daviplata:     $ 150.000 COP                          │ • Gastos OPEX Totales:-$280.00│ │
│ │ • Bancolombia:   $ 420.000 COP                          │   ├─ 🖥️ Servidores:  $105.000 │ │
│ │ • Efectivo Mano: $ 180.000 COP                          │   ├─ 🍔 Viáticos/Calle:$85.000│ │
│ │ Total Liquidez:  $1.600.000 COP                         │   ├─ ⛽ Transporte:    $50.000│ │
│ │                                                         │   └─ 🖨️ Materiales:    $40.000│ │
│ │                                                         │ ───────────────────────────── │ │
│ │                                                         │ 💰 UTILIDAD REAL:   +$670.000 │ │
│ │                                                         │ 🙏 DIEZMO (10%):     $ 67.000 │ │
│ │                                                         │ (Margen Operativo: 70.5%)     │ │
│ └─────────────────────────────────────────────────────────┴───────────────────────────────┘ │
│                                                                                             │
│ 4. AGENDA DEL CEO (HOY) ── [ + Nueva Visita / Tarea ]                                       │
│ ┌─────────────────────────────────────────────────────────────────────────────────────────┐ │
│ │ [x] 09:30 AM: Recoger 1.000 volantes en imprenta para Maye Ricuras       [ 🖨️ Imprenta ] │ │
│ │ [ ] 11:00 AM: Visitar Kaprichos para revisar fotos y menú digital        [ 📍 Visita ]   │ │
│ │ [ ] 04:00 PM: Cobrar $50.000 a Asados Diana (Compromiso pactado)         [ 💰 Cobro ]    │ │
│ └─────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                             │
│ 5. LISTA DE RESTAURANTES (Paginación Virtualizada a 60 FPS)                                 │
│ [ 🔍 Buscar restaurante por nombre... (Trigram GIN) ]  [ Filtro: Todos v ] [ + Registrar ]  │
│ ┌─────────────────────────┬────────────────┬──────────────────┬──────────────┬────────────────┐ │
│ │ Restaurante & Plan      │ Estado         │ Próximo Pago     │ Entregables  │ Acciones       │ │
│ ├─────────────────────────┼────────────────┼──────────────────┼──────────────┼────────────────┤ │
│ │ Asados Diana            │ 🟢 Al Día      │ 05/10/2026       │ 📷 Entregado │ [Cobrar] [Ver] │ │
│ │ ↳ [ Plan Standard ]     │ ↳ [ 📈 +14.2% ]│ ↳ (en 30 días)   │              │                │ │
│ ├─────────────────────────┼────────────────┼──────────────────┼──────────────┼────────────────┤ │
│ │ Maye Ricuras            │ 🟡 En Prueba   │ 12/09/2026       │ 📄 En Diseño │ [Extender][Msg]│ │
│ │ ↳ [ Plan Standard ]     │ ↳ [ ⚖️  0.0% ] │ ↳ (quedan 7 días)│              │                │ │
│ ├─────────────────────────┼────────────────┼──────────────────┼──────────────┼────────────────┤ │
│ │ Kaprichos               │ 🟠 En Gracia   │ 02/09/2026       │ 📷 Pendiente │ [Cobrar] [Msg] │ │
│ │ ↳ [ Plan Pro ]          │ ↳ [ 📉 -12.5% ]│ ↳ (hace 3 días)  │              │                │ │
│ └─────────────────────────┴────────────────┴──────────────────┴──────────────┴────────────────┘ │
│                                                                                             │
│                                                                     ┌─────────────────────┐ │
│                                                                     │ 🤖 BOTÓN FLOTANTE   │ │
│                                                                     │   "AGENTE FOWY"     │ │
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

### 3.2 Bloque 2: Indicadores de Eficiencia & Salud Financiera (`FinanceHealthMetricsBar.tsx`)
* **Propósito:** Medir la rentabilidad real, eficiencia del capital invertido y velocidad de cobranza mediante métricas financieras estándar (CPI, DSO, Runway, Margen Operativo).
* **Componente:** Barra ejecutiva horizontal compacta con 4 micro-tarjetas con badges vectoriales planos (`lucide-react` stroke 1.5px, cero 3D):
  * **🎯 CPI Onboarding (Cost Performance Index):** Relación entre el presupuesto objetivo de activación (\$35.000 COP) y el costo real ejecutado en fotos, volantes y viáticos.
    * *Verde ($\ge 1.0$):* Eficiente (gasto bajo control o inferior al presupuesto).
    * *Rojo ($< 1.0$):* Sobrecosto de instalación (se está quemando más dinero del presupuestado por cliente).
  * **⏱️ DSO Cartera (Days Sales Outstanding):** Días promedio que tarda un restaurante en pagar tras su fecha de corte o prueba.
    * *Verde ($\le 4$ días):* Cobranza ágil y líquida.
    * *Ámbar (4 a 7 días):* Advertencia de cartera lenta.
    * *Rojo ($> 7$ días):* Dinero estancado en la calle erosionando la caja.
  * **🛡️ Runway de Caja:** Meses de supervivencia que cubren los saldos líquidos actuales (Nequi, Daviplata, Bancolombia, Cash) frente a los costos fijos mensuales (Supabase Pro \$25 USD + viáticos esenciales).
  * **📈 Margen Operativo Neto %:** Porcentaje de utilidad operativa real descontando todos los egresos OPEX de calle sobre los ingresos totales cobrados.

### 3.3 Bloque 3: Arqueo Multibolsillo & P&L en Vivo (`FinanceProfitLossCard.tsx` y `FinanceAccountsBar.tsx`)
* **Arqueo de Fondos:** 4 tarjetas visuales con logotipos de Nequi, Daviplata, Bancolombia y Efectivo, con selector rápido para registrar traspasos entre cuentas en 2 clics (*"Traspasar $100k de Nequi a Efectivo"*).
* **P&L en Vivo:** 
  * Cifra de Ingresos en texto verde esmeralda.
  * Cifra de Gastos OPEX en texto rojo coral con **micro-desglose por categorías clave** (leído directamente de `v_expenses_by_category` en <10 ms sin consultas extra):
    * 🖥️ **Tecnología Fija:** Supabase Pro ($25 USD), dominios web, tokens Gemini.
    * 🍔 **Viáticos de Calle:** Almuerzos y alimentación en ruta de visitas *(con alerta visual en ámbar si supera el 25% del recaudo para controlar la fuga silenciosa de caja)*.
    * ⛽ **Transporte & Movilidad:** Gasolina, parqueaderos, pasajes.
    * 🖨️ **Material Negocios:** Volantes, fotos gastronómicas, stickers QR.
    * 👤 **Sueldo Cristian (CEO):** Asignación mensual formal del fundador.
  * **Cifra de Utilidad Neta Real** en tipografía destacada (`text-3xl font-extrabold`) con badge de margen porcentual.
  * **Métrica del Diezmo (10% de la Utilidad Neta Real tras Gastos Deducibles):** Renglón contable destacado (`🙏 DIEZMO (10%): $67.000 COP`) calculado automáticamente como el 10% de la utilidad neta mensual tras descontar todos los gastos OPEX posibles ($\text{Diezmo} = \text{Utilidad Neta Real} \times 0.10$). Si la empresa opera en pérdida o utilidad cero, el diezmo es `$0 COP`. Permite a Cristian separar con total transparencia y exactitud matemática el fondo de diezmo de FOWY.

### 3.4 Bloque 4: Agenda de Campo del CEO (`CeoAgendaChecklist.tsx`)
* **Diseño:** Tarjetas de tareas con checkbox interactivo y badges con iconos vectoriales minimalistas (`lucide-react` stroke 1.5px, cero 3D):
  * `MapPin` **Visita presencial** (azul).
  * `Printer` **Imprenta de volantes** (morado).
  * `Camera` **Sesión de fotos** (naranja).
  * `DollarSign` **Cobro programado** (verde).
* **Sincronización Automática:** Al marcar `[x]` en una tarea de fotos o volantes, se abre un micro-toast con la opción: *"¿Actualizar entregables de este restaurante en su ficha?"* con botón rápido `[Sí, sincronizar]`.

### 3.5 Bloque 5: Tabla Virtualizada a 60 FPS (`BusinessBillingTable.tsx` & `BusinessBillingRow.tsx`)
* **Rendimiento:** Implementada con virtualización vía `@tanstack/react-virtual` (solo 10 a 12 filas `<tr>` renderizadas en el DOM de forma fija), fluido a **60 FPS** sin caídas de cuadros (*frame drops*) sin importar si hay 100 o 10.000 restaurantes. La prueba técnica de aceptación en DevTools exige validar en vivo que mientras se hace scroll rápido solo existan ~12 nodos en el árbol DOM.
* **Buscador Trigram GIN:** Input reactivo que filtra en `<5 ms` directamente en PostgreSQL con estado vacío amigable (*Empty State*) si no hay resultados.
* **Pestañas de Filtro Rápido:** `Todos`, `Al Día`, `En Prueba`, `Por Cobrar`, `Compromisos Hoy`.
* **Visualización del Plan Debajo del Nombre:** Cada fila muestra debajo del nombre del restaurante un badge o etiqueta minimalista con el plan activo (ej: `↳ [ Plan Standard ]`, `↳ [ Plan Pro ]`, `↳ [ Plan Premium ]`) leído dinámicamente desde la libreta de notas `modules JSONB` o el fee mensual, permitiendo identificar al instante la categoría del cliente con total claridad y sin saturar el ancho de la columna.
* **Micro-Badge de Tendencia & Crecimiento en % Debajo del Estado (`BusinessBillingRow.tsx`):** Para evitar sobrecargar la columna del nombre y mantener un diseño espacioso y pulcro ("cero apeñuscamiento"), el porcentaje de variación de pedidos de los últimos 30 días se ubica **directamente debajo del semáforo de estado** (`↳ [ 📈 +14.2% ]`):
  * *Crecimiento positivo:* `↳ [ 📈 +14.2% ]` en verde esmeralda sutil (`bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-[10px] font-semibold`).
  * *Estable:* `↳ [ ⚖️ 0.0% ]` en gris suave (`bg-slate-500/10 text-slate-500 text-[10px]`).
  * *Caída / Churn Risk:* `↳ [ 📉 -12.5% ]` en rojo coral (`bg-rose-500/10 text-rose-600 border border-rose-500/20 text-[10px] font-semibold`), alertando a Cristian de forma visual sobre qué negocios requieren visita de rescate o incentivos antes de intentar cobrarles.
* **Conteo Relativo de Días Debajo de la Fecha:** Inmediatamente debajo de la fecha de pago (`DD/MM/YYYY`), se renderiza un indicador con el tiempo relativo para eliminar el cálculo mental:
  * *Al día con holgura:* `↳ (en 30 días)` en texto gris tenue (`text-slate-400`).
  * *Próximo a corte o en prueba:* `↳ (quedan 7 días)` o `↳ (vence hoy)` en texto ámbar (`text-amber-500 font-semibold`).
  * *Vencido (en gracia o mora):* `↳ (hace 3 días - vencido)` en texto rojo suave (`text-rose-500 font-bold`).
* **Badges de Entregables Dinámicos (Mochila Flexible JSONB):** Dibuja automáticamente las etiquetas con iconos vectoriales planos de `lucide-react` para cualquier trabajo del local (ej: `Camera` Fotos, `FileText` Volantes, `Flag` Pendón, `QrCode` Stickers QR, `Clapperboard` Video Reel), con código de colores según el estado (Gris: Pendiente, Naranja: En proceso/imprenta, Verde: Entregado). **Terminantemente prohibido el uso de iconos o emojis 3D**.
* **Micro-Acción de Calle `[ Msg ]` (Recordatorio por WhatsApp en 1 Clic):**  
  En cada fila con cobro pendiente o periodo de prueba, el botón minimalista `[ Msg ]` (ícono vectorial `MessageSquare` de `lucide-react`) abre directamente un enlace a WhatsApp (`https://wa.me/...`) con un mensaje profesional pre-redactado según el caso:
  * *Para fin de prueba:* `"Hola [Nombre], te escribe Cristian de FOWY. Tus 15 días de prueba gratis concluyen hoy. Tu menú ha recibido [X] visitas. ¿Deseas que activemos el mes regular?"`
  * *Para cobro en gracia:* `"Hola [Nombre], te comparto el recordatorio de renovación de FOWY del mes en curso. Puedes transferir a Nequi o Daviplata..."`

---

## 🤖 4. Componente Flotante del Agente FOWY (`AgenteFowySheet.tsx` / `FinanceCopilotSheet.tsx`)

### Ubicación Ergonómica & Convivencia con el Botón del Menú:
* **En Pantallas Móviles / Celular (`< 768px`):**  
  La interfaz móvil de FOWY ya cuenta con el botón de acción rápida flotante (el botón naranja circular con ícono `+` en la esquina inferior derecha, `bottom-6 right-4`). Para **evitar colisión táctil y jamás tapar el botón del menú**, el botón del **Agente FOWY** se posiciona **verticalmente justo encima** de dicho botón (`bottom-24 right-4` o `bottom-28 right-4`, `z-40`):
  * **Ergonomía de una mano en calle:** Cristian puede acceder con el pulgar derecho al botón `+` abajo, o subir 3 centímetros el pulgar y tocar el botón del **Agente FOWY** sin que los dos botones choquen ni se tapen.
* **En Pantallas de Escritorio (`>= 768px`):**  
  Se ubica en la esquina inferior derecha habitual (`bottom-6 right-6`).

### ¿Cómo Funciona el Botón del Agente FOWY?
1. **Estado en Reposo (Cerrado):**
   * Es una píldora o cápsula flotante estilizada con fondo oscuro semitransparente (`bg-slate-900/90 text-white backdrop-blur border border-slate-700 shadow-xl`), ícono de robot/IA minimalista y el texto **"AGENTE FOWY"**.
   * **Badge de Alerta con Contador:** Si hay tareas de campo o compromisos pendientes para hoy, renderiza un micro-badge ámbar (`[ 2 Tareas Hoy ]`), avisando a Cristian de un vistazo sin tener que abrir la agenda.
2. **Al Dar Clic o Toque (Apertura Adaptativa):**
   * **En Celular (`< 768px`):** Se despliega instantáneamente como un **Bottom Sheet deslizable** desde la parte inferior de la pantalla con un tirador táctil (*drag handle*), ocupando el 75% de la altura de la pantalla para operarlo con una mano mientras camina por la calle.
   * **En Escritorio (`>= 768px`):** Se desliza suavemente como un **Drawer lateral derecho** de 420px de ancho.
3. **Interacción Multimodal:**
   * **Por Voz:** Presionando el botón `[ 🎙️ Dictar Audio ]` (Web Audio API), Cristian habla a velocidad normal (*"Don Pedro pagó 50 mil por Nequi"*).
   * **Por Texto:** Puede escribir dudas o mandados (*"¿Cuánto es el Diezmo del mes?", "¿Cuánto dinero tengo en Nequi?", "Acuérdame visitar a Kaprichos mañana"*).
   * **Por Imagen (`Ctrl+V` o Adjunto):** Puede pegar un pantallazo de Nequi o foto de factura; el agente lee el OCR en RAM en milisegundos.
4. **Respuesta en Bandeja de Plata (Two-Step Confirmation):**
   * El agente no ejecuta a ciegas: devuelve una **tarjeta visual de pre-confirmación** estructurada con los datos contables, montos, cuenta y consecutivo `#REC-XXXX`.
   * Cristian pulsa `[ ✅ CONFIRMAR Y APLICAR ]` o `[ ✏️ Ajustar ]`.
   * Al confirmar, se aplica la transacción en PostgreSQL en `<50 ms` y aparece el botón directo `[ 📲 ENVIAR RECIBO POR WHATSAPP AL DUEÑO ]` para despachar el comprobante formal en 1 solo clic.

```text
┌────────────────────────────────────────────────────────┐
│ 🤖 AGENTE FOWY — CFO & SECRETARIA EJECUTIVA            │
├────────────────────────────────────────────────────────┤
│ 💬 Cristian: "Maye Ricuras pagó 50 mil por Nequi"      │
│                                                        │
│ 🤖 Agente: "Entendido Cristian. He preparado la        │
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
│ │   [ ✅ CONFIRMAR Y APLICAR ]    [ ❌ CANCELAR ]    │ │
│ │   [ ✏️ Ajustar monto/fecha ]                       │ │
│ └────────────────────────────────────────────────────┘ │
│                                                        │
│ ┌────────────────────────────────────────────────────┐ │
│ │ [ 🎙️ Dictar Audio ]   Escribe tu instrucción... [➤] │ │
│ └────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Micro-Interacciones Clave del Agente:
1. **Responsividad Adaptativa (Drawer en Desktop vs. Bottom Sheet en Móvil):**
   * En pantallas grandes (`>= 768px`): Se abre como un **Drawer lateral derecho** elegante.
   * En pantallas móviles (`< 768px`): Se despliega automáticamente como un **Bottom Sheet inferior** con tirador táctil (*drag handle*), permitiendo operarlo y dictarle con una sola mano desde la calle.
2. **Botón de Ajuste Rápido (`[ ✏️ Ajustar ]`):**  
   Si el Agente interpretó un dato impreciso (ej. eran 45 días en vez de 30, o la cuenta era Daviplata en vez de Nequi), un clic en `[ ✏️ Ajustar ]` abre un micro-editor en la misma tarjeta sin tener que cancelar y volver a dictar toda la orden.
3. **Compartir Recibo por WhatsApp en 1 Clic (Tarjeta de Éxito):**  
   Al confirmar la transacción (`[ ✅ CONFIRMAR Y APLICAR ]`), el Agente ejecuta el RPC en `<50 ms` y renderiza la tarjeta de confirmación con confetti visual y el botón dorado:
   ```text
   ┌────────────────────────────────────────────────────┐
   │ 🎉 ¡PAGO REGISTRADO CON ÉXITO!                     │
   │ Recibo Oficial: #REC-026 | Monto: $50.000 COP      │
   │ Negocio: Maye Ricuras | Próx corte: 05/10/2026     │
   │                                                    │
   │   [ 📲 ENVIAR RECIBO POR WHATSAPP AL DUEÑO ]       │
   └────────────────────────────────────────────────────┘
   ```
   Al dar clic en **`[ 📲 ENVIAR RECIBO POR WHATSAPP ]`**, el sistema abre WhatsApp con el texto legal formateado listo para enviar:
   `"🧾 RECIBO OFICIAL DE PAGO FOWY #REC-026... Negocio: Maye Ricuras... Monto: $50.000 COP... Cobertura: 05/09/2026 al 05/10/2026. ¡Gracias por confiar en FOWY!"`
4. **Pegado y Adjunto Rápido de Capturas de Transferencia y Recibos (Ctrl+V / Botón Minimalista):**  
   * **Iconografía:** Botón con icono minimalista de trazo fino `ImageIcon` o `Paperclip` de `lucide-react` (prohibido cualquier elemento 3D).  
   * **Acción de Calle:** Cristian puede arrastrar, seleccionar o presionar `Ctrl + V` en su teclado/celular pegando un pantallazo de Nequi/Daviplata o la foto de una factura de imprenta.  
   * **Previsualización Efímera:** Se muestra una miniatura temporal en el chat creada en memoria del navegador (`URL.createObjectURL(file)`) con botón de remover `[✕]`.  
   * **Análisis OCR en RAM (Cero Persistencia):** Al pulsar enviar, viaja en Base64 al backend, Gemini 1.5 Flash extrae en milisegundos los datos contables en memoria RAM, genera la tarjeta de pre-confirmación estructurada y el buffer de imagen se destruye inmediatamente. Queda terminantemente prohibido almacenar el archivo en Supabase Storage (cero basura digital).

---

## 🔄 5. Integración con el Módulo de Negocios (`/admin/negocios/[id]`)

### Transformación de la Pantalla "CONFIGURACIÓN GENERAL":
En la pantalla de cada negocio, la sección que antes requería cambiar selectores y fechas a mano se transforma en un **Panel Informativo en Modo Lectura (*Read-Only View*)** implementado en `BusinessSubscriptionReadOnlyView.tsx`:

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│  MÓDULOS ACTIVOS                  CONFIGURACIÓN GENERAL (Modo Lectura)       │
├──────────────────────────────────────────────────────────────────────────────┤
│  ESTATUS DEL NEGOCIO              PLAN Y PRECIO REGISTRADO                   │
│  [ 🟢 Activo / Operativo ]        [ Standard — $50.000 COP ]                 │
│  (Sincronizado desde Finanzas)    (Corte automático mensual)                 │
│                                                                              │
│  PRÓXIMO CORTE (FECHA)            ÚLTIMO RECIBO EMITIDO                      │
│  [ 02/10/2026 ]                   [ 📄 Recibo #REC-025 — Pagado Nequi ]      │
│  (14 días restantes)              [ 📲 Compartir Recibo WhatsApp ]           │
│                                                                              │
│  MÓDULOS Y FUNCIONES ACTIVAS (Libreta Flexible 'modules' JSONB)              │
│  • Standard: [ 🟢 Activo ]   • Pro: [ ⚪ Inactivo ]                          │
│  • Premium: [ ⚪ Inactivo ]  • Inventario: [ ⚪ Inactivo ]                    │
│  (Funciona como una nota sin rigidez: se adapta a cualquier función futura)  │
│                                                                              │
│  TRABAJOS Y ENTREGABLES ACTIVOS (Mochila Flexible 'deliverables' JSONB)      │
│  • Fotos: [ 🟢 Listas ]   • Volantes: [ 🟢 1.000 entregados ]                │
│  • Pendón: [ 🟠 Imprenta ] • Stickers QR: [ 🟢 Instalados ]                  │
│  (La lista se adapta dinámicamente a cualquier trabajo comercial registrado) │
│                                                                              │
│  ℹ️ Para registrar pagos o ajustar este plan, hazlo desde [ Finanzas ]      │
└──────────────────────────────────────────────────────────────────────────────┘
```

* **Cero rigidez de base de datos:** El plan y los módulos de software se leen de la columna flexible `modules JSONB`, mientras que los servicios de calle se leen de `deliverables JSONB`. Ambos funcionan como notas digitales editables sin necesidad de `ALTER TABLE`.
* **Cero riesgo de manipulación manual:** Ya no hay que abrir 100 pantallas para cambiar fechas una por una.
* **Trazabilidad 100%:** Si el restaurante dice "Activo", el botón `[ 📲 Compartir Recibo WhatsApp ]` abre el comprobante legal generado por el módulo de Finanzas.
* **Patrón de Desconexión sin Eliminación & Rollback en 30 Segundos:**  
  En `src/app/admin/negocios/[id]/page.tsx`, el formulario anterior `BusinessPaymentViewer.tsx` se preserva intacto como respaldo histórico. La conexión con el nuevo visor satélite se rige por un interruptor booleano:
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
  *Protocolo de Rollback:* Si ocurriera cualquier anomalía en producción, cambiar `USE_SATELLITE_FINANCE_VIEW = false` restaura el formulario operativo legacy en menos de 30 segundos sin pérdida de datos ni regresiones.


---

## 📦 6. Estructura de Componentes Atómicos (Regla <250 Líneas)

Para garantizar cumplimiento estricto de la regla de oro de [`conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md):

```text
src/components/admin/finanzas/
├── FinanceKpiCards.tsx          (~110L - 4 Semáforos superiores)
├── FinanceHealthMetricsBar.tsx  (~115L - Barra ejecutiva de salud: CPI Onboarding, DSO Cartera, Runway, Margen)
├── FinanceAccountsBar.tsx       (~140L - Bolsillos de Nequi/Daviplata/Bancolombia)
├── FinanceProfitLossCard.tsx    (~125L - Tarjeta P&L con ingresos, gastos, utilidad neta y diezmo)
├── CeoAgendaChecklist.tsx       (~160L - Checklist interactivo de tareas y visitas)
├── BusinessBillingTable.tsx     (~185L - Tabla virtualizada a 60 FPS con @tanstack/react-virtual y Trigram GIN)
├── BusinessBillingRow.tsx       (~150L - Fila con Plan bajo nombre, % bajo estado, días bajo fecha y [Msg])
├── modals/
│   ├── QuickPaymentModal.tsx    (~195L - Modal de cobro con botón de compartir recibo)
│   ├── QuickExpenseModal.tsx    (~170L - Modal para registrar gasto OPEX)
│   ├── AccountTransferModal.tsx (~160L - Modal para traspaso de fondos entre cajas)
│   └── NewTaskModal.tsx         (~135L - Modal para agendar nueva visita o tarea del CEO)
└── copilot/
    ├── FinanceCopilotSheet.tsx  (~210L - Drawer/Bottom Sheet responsive Agente FOWY con Web Audio API)
    ├── CopilotVoiceMic.tsx      (~120L - Grabador de voz con Web Audio API)
    └── CopilotActionCard.tsx    (~165L - Tarjeta con ajuste rápido y compartir recibo)

src/utils/
└── financeReceipt.ts            (~95L - Helper centralizado: formatCOP, días relativos, wa.me)

src/components/admin/businesses/
└── BusinessSubscriptionReadOnlyView.tsx (~150L - Modo lectura satélite en Negocios)
```

* **Ningún archivo supera las 220 líneas de código.**
* Máxima ergonomía en celular, aislamiento de responsabilidades y cero deuda técnica.

---

## 📄 7. Especificación Oficial de Diseño: Recibo / Comprobante en PDF

Para la generación de recibos digitales oficiales descargables y compartibles vía WhatsApp:

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  [ LOGO FOWY ]                                  COMPROBANTE OFICIAL DE PAGO │
│  fowy.pro                                       RECIBO: #REC-026            │
│  fowy.info@gmail.com | Colombia                 FECHA:  05/09/2026          │
├─────────────────────────────────────────────────────────────────────────────┤
│  DATOS DEL ESTABLECIMIENTO:                                                 │
│  Restaurante: Maye Ricuras                      Ciudad: Colombia            │
│  Plan:        Standard Mensual ($50.000 COP)    Estado: [ 🟢 AL DÍA ]       │
├─────────────────────────────────────────────────────────────────────────────┤
│  DESCRIPCIÓN DEL SERVICIO                      COBERTURA           MONTO    │
│  ───────────────────────────────────────────  ──────────────────  ───────── │
│  • Membresía FOWY (Menú Digital + Explorador)  05/09/26 - 05/10/26  $50.000 │
│                                                                             │
│  TRABAJOS Y ENTREGABLES ACTIVOS (Mochila JSONB):                            │
│  [✔] 1.000 Volantes publicitarios impresos                                  │
│  [✔] Sesión fotográfica gastronómica                                        │
│  [✔] Stickers QR para mesas                                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│  MÉTODO DE PAGO: Nequi                          SUBTOTAL:       $50.000 COP │
│  ESTADO:         [ ✅ PAGADO TOTAL ]             SALDO RESTANTE:       $0 COP│
│                                                 ─────────────────────────── │
│                                                 TOTAL PAGADO:   $50.000 COP │
├─────────────────────────────────────────────────────────────────────────────┤
│  Este recibo es un comprobante digital oficial emitido por fowy.pro.        │
│  Contacto & Soporte: fowy.info@gmail.com                                    │
│  ¡Gracias por impulsar el comercio local con FOWY!                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

* **Identidad Corporativa:** Encabezado con **`fowy.pro`** y correo de contacto **`fowy.info@gmail.com`**.
* **Diseño 100% Plano y Minimalista (CERO 3D):** Tipografía limpia, acabados vectoriales sobrios y cero ilustraciones o emojis tridimensionales.
* **Formato ultra-liviano (<80 KB):** Generación limpia y directa sin sobrecargas de red.
* **Despacho Inmediato:** Botón `[ 📲 Enviar PDF por WhatsApp ]` en la tarjeta de éxito del Copilot y en la ficha de cada negocio.

---
*Fin de la Especificación Visual UX/UI — FOWY iA Finanzas 2026*
