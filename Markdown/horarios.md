# ⏰ DIAGNÓSTICO Y SOLUCIONES: BUG DE ESTADO Y HORARIOS DE NEGOCIOS

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

---

## 📌 1. Resumen del Bug Detectado

### 🔍 Descripción del Problema
Cuando un Administrador activa un negocio desde el Panel Administrativo (`/admin/negocios/[id]`), el negocio cambia a estado **Activo**. Sin embargo, al ingresar o refrescar el Panel del Negocio (`/business`), el negocio vuelve a cambiar automáticamente a estado **Inactivo/Pausado**.

### 💡 Comprobación Empírica
Al ajustar el horario o estado de atención del negocio a "Abierto", el negocio permanece activo tras guardar. Esto confirmó que el auto-cierre por horarios del sistema estaba desactivando administrativamente el negocio al llegar la hora de cierre.

---

## 🧠 2. Causa Raíz Técnica

Existe un **conflicto de responsabilidades sobre la misma columna en la Base de Datos**:

La tabla `businesses` en Supabase utiliza una única columna booleana llamada `status` (`true`/`false`) para dos propósitos totalmente distintos y contradictorios:

1. **Estatus Administrativo (Panel Admin):** Determina si el negocio está habilitado/activo comercialmente en la plataforma (`true`) o suspendido/inactivo (`false`).
2. **Estado Operativo Diario (Panel Negocio / Horarios):** Determina si la tienda está **Abierta** (`true`) o **Cerrada** (`false`) en tiempo real según el reloj de Bogotá (GMT-5) y sus horarios de atención.

### ⚙️ Secuencia Paso a Paso del Fallo

1. **Activación Admin:** El Admin cambia `status = true` desde el panel `/admin/negocios/[id]` y guarda en Supabase.
2. **Navegación / Refresco:** Al cargar la vista del negocio (`/business`), se inicializa el componente `PartnerTopBar.tsx`.
3. **Ejecución del Hook Automático:** `PartnerTopBar.tsx` invoca el hook `useBusinessSchedule.ts`, el cual ejecuta un sensado **cada segundo (1000 ms)**.
4. **Evaluación de Horario:** `useBusinessSchedule` consulta la función `isBusinessOpen(schedules)` (`src/utils/businessTime.ts`). Si la hora actual en Bogotá (ej. 22:50 PM) está fuera del horario de atención configurado, `isBusinessOpen()` evalúa a `false`.
5. **Sobrescritura en Base de Datos:** En `useBusinessSchedule.ts` (líneas 71-77), al detectar que `shouldBeOpen (false) !== currentStatus (true)`, el hook ejecuta una consulta de actualización directa en Supabase:
   ```typescript
   await supabase
     .from('businesses')
     .update({ status: shouldBeOpen }) // <-- Sobrescribe la columna status a false
     .eq('id', businessId);
   ```
6. **Bucle:** Al quedar `status = false` en Supabase, el panel Admin vuelve a mostrar el negocio en estado **Inactivo / Pausado**.

---

## 🛠️ 3. Comparativa de Soluciones y Decisión Arquitectónica

### 🟢 Opción A: Solución en Código Únicamente (SELECCIONADA - Riesgo 1/10)

* **Concepto:**
  La columna `status` en Supabase queda reservada **exclusivamente para el Administrador** (Habilitado / Suspendido). Se elimina la consulta `UPDATE` automática de `useBusinessSchedule.ts` que modifica la base de datos.
* **Mecanismo:**
  1. En `useBusinessSchedule.ts`, se remueve la línea que ejecuta la actualización a Supabase al cambiar de horario.
  2. El cálculo de si la tienda está abierta o cerrada por la hora actual se realiza **dinámicamente en tiempo real en la interfaz del cliente/explorador** mediante la función `isBusinessOpen(schedules)` sin sobreescribir la base de datos.
* **Ventajas:**
  - ⚡ Implementación inmediata y 100% segura (Riesgo 1/10).
  - ❌ No requiere cambios de esquema, SQL ni migraciones en Supabase.

---

### 🔴 Opción B: Solución en Base de Datos (DESCARTADA - Riesgo 6/10)

* **Concepto:**
  Separar en Supabase el estado administrativo del estado de horario mediante dos columnas independientes en la tabla `businesses` (`is_active` y `is_open`).
* **Por qué se descarta (Alineación con `Markdown/conceptos.md`):**
  - **Violación de la Ley Absoluta de Código Heredado (Sección 7 de `conceptos.md`):** La regla del "remolque" prohíbe expresamente refactorizar o alterar componentes y estructuras de datos heredados estables. La Opción B exigiría modificar la tabla `businesses` en producción, ejecutar migraciones SQL propensas a dejar datos en `NULL`, y refactorizar de 6 a 8 hooks/componentes consolidados (`useExplorerManager`, `useAdminBusinessManager`, `[slug]/page.tsx`).
  - **Riesgo de Efecto Dominó:** Cambiar los campos provocaría fallos de compilación masivos por tipos desalineados en Supabase y errores inesperados durante el despliegue en Vercel.

---

## 📋 4. Checklist de Implementación (Opción A)

> **Pasos a ejecutar únicamente cuando Cristian (CEO de FOWY) dé la autorización explícita:**

- [x] **1.1 Desactivar sobrescritura en DB en el hook de horarios:**
  Modificar `src/components/admin/businesses/hooks/useBusinessSchedule.ts` eliminando o comentando la llamada a `supabase.from('businesses').update({ status: shouldBeOpen })`, evitando que el auto-cierre altere la columna `status` de la Base de Datos.

- [x] **1.2 Verificar dinamismo en el Explorador y Menú:**
  Confirmar que el Explorador (`src/hooks/useExplorerManager.ts`) y la vista detallada del negocio (`src/app/(explorer)/[slug]/page.tsx`) mantengan la evaluación en tiempo real mediante `isBusinessOpen(schedules)` sin requerir actualizaciones persistidas en Supabase.

- [x] **1.3 Sincronizar UI del Switch en la Barra del Socio:**
  Modificar `src/components/partners/PartnerTopBar.tsx` importando `isBusinessOpen` de `@/utils/businessTime` y conectando el estado visual del switch a `isCurrentlyOpen = businessStatus === true && isBusinessOpen(schedules)` para que el texto ("Automático • Abierto / Cerrado") y los colores del switch se actualicen en tiempo real según la hora sin alterar Supabase.

- [x] **1.4 Pruebas de verificación de persistencia y UI:**
  Verificar que al estar fuera de horario el switch del socio se muestre en rojo ("Automático • Cerrado"), pero en la Base de Datos y en el Panel Admin el negocio permanezca **Activo** administrativamente.

---

*Documento actualizado el 28 de Julio de 2026 tras la validación de sincronización del switch visual del socio.*
