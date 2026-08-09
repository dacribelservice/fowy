# 📑 AUDITORÍA TÉCNICA OFICIAL & INFORME DE ARQUITECTURA — FOWY

> **Documento Oficial de Deuda Técnica, Seguridad y Roadmap de Ingeniería**  
> **Fecha de emisión:** 1 de Agosto de 2026  
> **Versión de Auditoría:** 1.1 (Actualizado con Infraestructura de Producción)  
> **Estado del Sistema:** Producción Activa en Vivo (50 negocios registrados)  
> **Infraestructura Activa:** Supabase Plan Pro ($25 USD/mes) | Vercel Plan Free  

---

## 1. Resumen Ejecutivo

FOWY se presenta como una plataforma multi-inquilino (*multi-tenant*) de comercio local y menús digitales de alto rendimiento. El sistema se encuentra actualmente **desplegado en producción real con 50 negocios registrados y operativos**, destacando por un enfoque pragmático que priorizó la velocidad de lanzamiento (*Time-To-Market*) sin sacrificar la seguridad básica ni la estética visual.

### **Infraestructura y Stack de Producción**
- **Hosting & Frontend:** Vercel (Plan Free / Hobby).
- **Backend & Base de Datos:** Supabase (Plan Pro - $25 USD/mes: PostgreSQL + RLS + PostGIS + WebSockets).
- **Volumen Actual:** 50 negocios activos en producción en la plataforma.

### **Fortalezas Principales**
1. **Arquitectura Direct-to-BaaS Eficiente:** El uso de Next.js 15 (App Router) junto con Supabase (PostgreSQL + RLS) eliminó la sobrecarga de mantener servidores de backend dedicados.
2. **Consolidación de Consultas RPC:** Funciones como `get_business_menu_payload` consolidan la carga del menú en un único viaje de red (*1 RTT*).
3. **Seguridad Delegada a la Base de Datos (RLS):** Las reglas de acceso están enforzadas directamente en PostgreSQL mediante políticas RLS y tipos Enum nativos (`user_role`).
4. **Optimización de Medios:** La compresión previa de imágenes en el cliente mediante [`storageService.ts`](file:///c:/Users/cange/Documents/fowy/src/services/storageService.ts) reduce drásticamente el uso de ancho de banda y almacenamiento en la nube.
5. **Uso de PostGIS para Geolocalización:** Búsquedas espaciales nativas en PostgreSQL para el mapa interactivo.

### **Debilidades Principales**
1. **Creación de Órdenes Client-Side:** El cliente calcula los montos e inserta registros de compras directamente en la base de datos sin verificación de precios server-side.
2. **Ausencia de Control de Versiones en Migraciones SQL:** El esquema y procedimientos almacenados residen en la interfaz web de Supabase sin scripts `.sql` versionados en Git (`supabase/migrations/`).
3. **Ineficiencia de Consultas (`select('*')`):** Múltiples hooks solicitan todas las columnas (incluyendo grandes JSONs de configuración) en vistas de mapas y listas.
4. **Re-fetch Masivo en Realtime (*Refetch Storms*):** Cualquier cambio en un negocio provoca que los exploradores vuelvan a pedir la lista completa de locales del mapa.

### **Diagnóstico Final de Negocio**
El proyecto es viable, altamente competitivo y **no requiere una reescritura**. Con una inversión de 3 a 4 meses de ingeniería para resolver los puntos críticos de seguridad y base de datos, el sistema alcanzará la madurez Enterprise para soportar cientos de miles de usuarios.

---

## 2. Estado General del Proyecto

| Área | Nota | Justificación |
| :--- | :---: | :--- |
| **Arquitectura** | **8.5** | Excelente división por dominios en App Router (`(explorer)`, `(partners)`, `admin`), uso eficaz de RPC consolidado y BaaS. |
| **Código** | **7.0** | Componentes UI limpios pero con presencia de archivos monolíticos y tipado `any` heredado. |
| **Base de Datos** | **7.5** | PostGIS y RLS nativos muy bien integrados; afectado por la falta de migraciones SQL en Git y búsquedas `ilike`. |
| **Seguridad** | **8.0** | RLS sólido en PostgreSQL por rol; debilidad en la validación server-side de precios en el carrito. |
| **Rendimiento** | **6.5** | Bueno en carga de menú (SWR); deficiente en el mapa por `select('*')` y filtrado de horarios en cliente. |
| **Escalabilidad** | **6.5** | Requiere índices GIN, paginación estricta y funciones RPC de ordenamiento antes de escalar a 100k+ usuarios. |
| **Documentación** | **9.0** | Excelente archivo de reglas (`conceptos.md`), hoja de ruta e índice maestro dinámico. |
| **Mantenibilidad** | **7.0** | Clara estructura modular, pero penalizada por duplicación de formularios de productos. |
| **Exp. Desarrollo** | **7.5** | Recarga rápida en Next.js; ralentizada por falta de tipos estrictos en entidades legacy. |

---

## 3. Top 20 Problemas del Proyecto

---

### 🔴 Crítico

### Problema 1
**Inserción directa de pedidos desde el cliente sin validación de montos en Base de Datos**

**Descripción técnica:**  
El checkout calcula el total de la orden en JavaScript cliente y ejecuta `supabase.from('orders').insert(...)` directamente. Las políticas RLS permiten la inserción a usuarios autenticados o anónimos, pero RLS no valida si los precios sumados coinciden con los precios reales de los productos en la tabla `products`.

**Dónde ocurre:**  
- [`src/components/explorer/hooks/useCheckoutLogic.ts`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/hooks/useCheckoutLogic.ts)
- [`src/hooks/useOrderManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useOrderManager.ts)

**Impacto:**  
Riesgo de fraude financiero: un usuario malintencionado podría enviar un payload JSON directo a Supabase estableciendo `total_amount: 0` o valores arbitrarios.

**Prioridad:** Crítica  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 2 días  
**Beneficio esperado:** Blindaje financiero 100% seguro garantizado por la base de datos.  
**Dependencias:** Ninguna  

---

### Problema 2
**Ausencia de archivos de migración SQL en el repositorio Git**

**Descripción técnica:**  
Las tablas, enums, funciones RPC y políticas RLS existen en la instancia de Supabase, pero la carpeta `supabase/migrations/` no existe en el proyecto. El esquema solo se evidencia en el archivo de tipos autogenerados `supabase.ts`.

**Dónde ocurre:**  
- [`src/types/supabase.ts`](file:///c:/Users/cange/Documents/fowy/src/types/supabase.ts)
- Directorio raíz `supabase/`

**Impacto:**  
Imposibilidad de automatizar despliegues CI/CD, auditar el historial de cambios en el esquema de datos o replicar la base de datos en entornos de staging o desarrollo local.

**Prioridad:** Crítica  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 3 días  
**Beneficio esperado:** Repositorio autodocumentado y preparado para integración continua.  
**Dependencias:** Ninguna  

---

### Problema 3
**Re-fetch masivo de negocios en el mapa ante cualquier cambio Realtime (*Refetch Storm*)**

**Descripción técnica:**  
Cuando se dispara un evento de cambio en la tabla `businesses`, el callback de WebSocket en `useExplorerManager.ts` vuelve a invocar `fetchRef.current()`, re-ejecutando la consulta RPC `get_businesses_in_viewport` completa para traer hasta 250 negocios de nuevo.

**Dónde ocurre:**  
- [`src/hooks/useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L172)

**Impacto:**  
A gran escala (miles de usuarios simultáneos y cientos de locales), cualquier edición de un negocio provocará una avalancha de consultas pesadas que colapsará la CPU de PostgreSQL.

**Prioridad:** Crítica  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1.5 días  
**Beneficio esperado:** Reducción del 90% en el consumo de CPU de base de datos durante eventos en vivo.  
**Dependencias:** Ninguna  

---

### Problema 4
**Consultas de búsqueda de catálogo usando `ilike` sin índices de texto completo (GIN / Full-Text Search)**

**Descripción técnica:**  
Las búsquedas por nombre de producto o descripción utilizan la cláusula `ilike '%query%'`, lo que invalida los índices B-Tree estándar en PostgreSQL.

**Dónde ocurre:**  
- [`src/hooks/useProductManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useProductManager.ts)
- [`src/components/partners/business/menu/FowyCatalogView.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/business/menu/FowyCatalogView.tsx)

**Impacto:**  
Con 100.000+ productos, cada búsqueda ejecutará un *Full Table Scan*, aumentando exponencialmente los tiempos de respuesta.

**Prioridad:** Crítica  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 2 días  
**Beneficio esperado:** Búsquedas instantáneas (<20ms) en millones de productos.  
**Dependencias:** Problema 2 (Migraciones SQL)  

---

### Problema 5
**Canal Realtime con identificador estático propenso a colisiones en `useServiceOrderManager`**

**Descripción técnica:**  
El hook utiliza un identificador fijo de canal `supabase.channel('service_orders_changes')` en lugar de una cadena única generada dinámicamente.

**Dónde ocurre:**  
- [`src/hooks/useServiceOrderManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useServiceOrderManager.ts#L99)

**Impacto:**  
Colisiones de listeners y pérdidas de suscripciones en tiendo real durante navegaciones rápidas o cuando múltiples componentes consumen el hook a la vez.

**Prioridad:** Crítica  
**Esfuerzo estimado:** XS  
**Tiempo estimado:** 4 horas  
**Beneficio esperado:** Estabilidad total en las suscripciones WebSocket del marketplace de servicios.  
**Dependencias:** Ninguna  

---

### 🟠 Alto

---

### Problema 6
**Traer columnas pesadas no requeridas con `select('*')` en explorador y paneles**

**Descripción técnica:**  
Las consultas solicitan todas las columnas de la tabla `businesses` (`select('*')`), incluyendo objetos JSON extensos de horarios y configuraciones que no se necesitan para renderizar tarjetas de mapas o listas.

**Dónde ocurre:**  
- [`src/hooks/useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L120)
- [`src/hooks/useAdminBusinessManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useAdminBusinessManager.ts#L44)

**Impacto:**  
Saturación innecesaria del ancho de banda en dispositivos móviles y mayor consumo de memoria en el navegador.

**Prioridad:** Alta  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Reducción de hasta un 60% en el tamaño del payload transmitido.  
**Dependencias:** Ninguna  

---

### Problema 7
**Filtrado de horarios de apertura e inactividad ejecutado en JavaScript cliente**

**Descripción técnica:**  
El explorador descarga negocios inactivos o cerrados desde la DB y luego ejecuta la función `isBusinessOpen(biz.schedules)` en el dispositivo cliente para descartarlos del mapa.

**Dónde ocurre:**  
- [`src/hooks/useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L146)
- [`src/utils/businessTime.ts`](file:///c:/Users/cange/Documents/fowy/src/utils/businessTime.ts)

**Impacto:**  
Procesamiento innecesario en teléfonos móviles de gama media/baja y descarga de registros que nunca se mostrarán en la UI.

**Prioridad:** Alta  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 2 días  
**Beneficio esperado:** Mayor fluidez visual y menor uso de procesamiento en el cliente.  
**Dependencias:** Problema 2 (Migraciones SQL)  

---

### Problema 8
**Duplicación masiva de formularios y lógica de productos entre el módulo Admin y Socio**

**Descripción técnica:**  
Existen dos modales independientes ([`partners/.../ProductFormModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/business/menu/ProductFormModal.tsx) y [`admin/.../ProductFormModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/admin/catalogo/ProductFormModal.tsx)) de 488 y 370 líneas respectivamente, que repiten la misma interfaz, validaciones y carga de imágenes.

**Dónde ocurre:**  
- `src/components/partners/business/menu/ProductFormModal.tsx`
- `src/components/admin/catalogo/ProductFormModal.tsx`

**Impacto:**  
Doble costo de mantenimiento técnico y riesgo de desincronización de errores o mejoras entre paneles.

**Prioridad:** Alta  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 3 días  
**Beneficio esperado:** Componente de formulario único reutilizable y reducción de ~400 líneas de código.  
**Dependencias:** Ninguna  

---

### Problema 9
**Falta de paginación o streaming por cursor en el explorador de mapa**

**Descripción técnica:**  
La consulta RPC del mapa solicita un límite fijo de 250 negocios (`p_limit: 250`) en un solo bloque sin permitir paginación o carga bajo demanda al desplazar la vista.

**Dónde ocurre:**  
- [`src/hooks/useExplorerManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useExplorerManager.ts#L118)

**Impacto:**  
En ciudades de alta densidad comercial con más de 250 negocios, los locales sobrantes serán invisibles para el usuario.

**Prioridad:** Alta  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 2 días  
**Beneficio esperado:** Capacidad de explorar infinitos locales en el mapa sin degradar la memoria.  
**Dependencias:** Ninguna  

---

### Problema 10
**Acumulación de registros en la tabla `analytics_visits` sin particionamiento ni retención**

**Descripción técnica:**  
Cada visita a un perfil de negocio inserta una fila en `analytics_visits`. No existe una tarea programada en la base de datos para purgar o consolidar visitas antiguas.

**Dónde ocurre:**  
- [`src/hooks/useBusinessAnalytics.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useBusinessAnalytics.ts)

**Impacto:**  
Degradación progresiva en la velocidad de las copias de seguridad de la base de datos a medida que la tabla alcance millones de filas.

**Prioridad:** Alta  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Base de datos ligera y almacenamiento controlado.  
**Dependencias:** Problema 2 (Migraciones SQL)  

---

### 🟡 Medio

---

### Problema 11
**Componentes UI que superan por más del 100% el límite recomendado de 250 líneas**

**Descripción técnica:**  
Archivos como `BusinessFormModal.tsx` (634L), `BusinessSettingsTab.tsx` (575L) y `UserOrdersSheet.tsx` (571L) concentran demasiadas responsabilidades visuales y de estado en un solo archivo.

**Dónde ocurre:**  
- [`src/components/partners/BusinessFormModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/BusinessFormModal.tsx)
- [`src/components/partners/BusinessSettingsTab.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/BusinessSettingsTab.tsx)
- [`src/components/explorer/UserOrdersSheet.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/UserOrdersSheet.tsx)

**Impacto:**  
Mayor dificultad de lectura, mayor riesgo de introducir errores durante modificaciones y resistencia al mantenimiento.

**Prioridad:** Media  
**Esfuerzo estimado:** L  
**Tiempo estimado:** 4 días  
**Beneficio esperado:** Cumplimiento estricto del estándar de arquitectura del proyecto y mejor mantenibilidad.  
**Dependencias:** Ninguna  

---

### Problema 12
**Uso de tipos `any` en entidades centrales de negocio en código heredado**

**Descripción técnica:**  
Se encontraron más de 50 usos de `any` en arreglos de productos, negocios, ofertas y usuarios (ej. `items: any[]`, `businesses: any[]`).

**Dónde ocurre:**  
- [`src/hooks/useOrderManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useOrderManager.ts#L13)
- [`src/utils/businessStats.ts`](file:///c:/Users/cange/Documents/fowy/src/utils/businessStats.ts#L14)
- [`src/components/partners/expertos/ExpertCard.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/expertos/ExpertCard.tsx#L8)

**Impacto:**  
Anulación de la verificación estática de TypeScript e incapacidad del IDE para autocompletar o detectar errores de acceso a propiedades.

**Prioridad:** Media  
**Esfuerzo estimado:** M  
**Tiempo estimado:** 3 días  
**Beneficio esperado:** Autocompletado robusto y prevención de errores `undefined` en producción.  
**Dependencias:** Ninguna  

---

### Problema 13
**Ausencia de eliminación de imágenes en Supabase Storage al borrar registros en la DB**

**Descripción técnica:**  
Al eliminar un producto o un negocio de la base de datos, la fila de PostgreSQL se borra, pero la imagen física permanece huérfana en el bucket de Storage.

**Dónde ocurre:**  
- [`src/hooks/useProductManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useProductManager.ts)

**Impacto:**  
Desperdicio innecesario de almacenamiento en la nube y acumulación de basura digital.

**Prioridad:** Media  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Limpieza total de almacenamiento y cumplimiento de las reglas del proyecto.  
**Dependencias:** Ninguna  

---

### Problema 14
**Re-renderizado masivo de tarjetas de productos por falta de `React.memo`**

**Descripción técnica:**  
El componente `CraveProductCard` no utiliza `React.memo`. Al filtrar o buscar productos en la vista del menú, todos los nodos de productos se re-renderizan individualmente.

**Dónde ocurre:**  
- [`src/app/(explorer)/[slug]/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/[slug]/page.tsx)
- [`src/components/explorer/CraveProductCard.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/CraveProductCard.tsx)

**Impacto:**  
Pequeños tirones visuales al escribir en la barra de búsqueda en catálogos extensos.

**Prioridad:** Media  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Búsqueda en menú fluida a 60 FPS en cualquier smartphone.  
**Dependencias:** Ninguna  

---

### Problema 15
**Cálculo de totales financieros procesado en JavaScript cliente**

**Descripción técnica:**  
El panel de socio calcula las ventas totales descargando todas las órdenes y ejecutando un `.reduce((acc, curr) => acc + Number(curr.total_amount), 0)` en JS.

**Dónde ocurre:**  
- [`src/app/(partners)/business/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(partners)/business/page.tsx#L88)

**Impacto:**  
Con miles de pedidos acumulados por un negocio, la página del panel tardará en procesar la suma y bloqueará la UI.

**Prioridad:** Media  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Carga instantánea de métricas financieras calculadas por PostgreSQL (`SUM`).  
**Dependencias:** Ninguna  

---

### Problema 16
**Captura silenciosa de errores en la carga de ubicación y configuración**

**Descripción técnica:**  
En `[slug]/page.tsx`, el fallo al parsear la ubicación desde `localStorage` solo emite un `console.error` sin ofrecer una alternativa clara en la interfaz.

**Dónde ocurre:**  
- [`src/app/(explorer)/[slug]/page.tsx`](file:///c:/Users/cange/Documents/fowy/src/app/(explorer)/[slug]/page.tsx#L56)

**Impacto:**  
Dificultad para diagnosticar fallos reportados por usuarios en dispositivos específicos (ej. iOS Safari).

**Prioridad:** Media  
**Esfuerzo estimado:** XS  
**Tiempo estimado:** 4 horas  
**Beneficio esperado:** Sistema de registro de errores transparente y de fácil diagnóstico.  
**Dependencias:** Ninguna  

---

### 🟢 Bajo

---

### Problema 17
**Redefinición local de la función utilitaria `cn()` en archivos de componentes**

**Descripción técnica:**  
Archivos como `ProductFormModal.tsx` vuelven a declarar internamente la función `cn(...inputs: ClassValue[])` utilizando `clsx` y `twMerge` en lugar de importarla de un módulo compartido.

**Dónde ocurre:**  
- [`src/components/partners/business/menu/ProductFormModal.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/business/menu/ProductFormModal.tsx#L29)

**Impacto:**  
Código repetido de pequeña escala.

**Prioridad:** Baja  
**Esfuerzo estimado:** XS  
**Tiempo estimado:** 2 horas  
**Beneficio esperado:** Limpieza de código y utilidades estandarizadas.  
**Dependencias:** Ninguna  

---

### Problema 18
**Presencia de archivos de prueba sueltos en el directorio fuente `src/`**

**Descripción técnica:**  
Existen scripts de prueba directa como `test_simulation.js` y `test_supabase_schedules.js` conviviendo dentro de la carpeta fuente del proyecto.

**Dónde ocurre:**  
- [`src/test_simulation.js`](file:///c:/Users/cange/Documents/fowy/src/test_simulation.js)
- [`src/test_supabase_schedules.js`](file:///c:/Users/cange/Documents/fowy/src/test_supabase_schedules.js)

**Impacto:**  
Contaminación del árbol de archivos del código fuente.

**Prioridad:** Baja  
**Esfuerzo estimado:** XS  
**Tiempo estimado:** 1 hora  
**Beneficio esperado:** Árbol de código limpio.  
**Dependencias:** Ninguna  

---

### Problema 19
**Formateadores inline de moneda y fechas en lugar de usar utilidades centralizadas**

**Descripción técnica:**  
Uso directo de `new Intl.NumberFormat('es-CO', ...)` en múltiples vistas en lugar de consumir exclusivamente los helpers centralizados de `src/utils/`.

**Dónde ocurre:**  
- [`src/components/partners/BusinessOrdersTab.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/partners/BusinessOrdersTab.tsx)
- [`src/components/explorer/UserOrdersSheet.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/UserOrdersSheet.tsx)

**Impacto:**  
Dificultad si en el futuro se desea cambiar la localización de moneda o idioma de la plataforma.

**Prioridad:** Baja  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Internacionalización y formateo centralizado.  
**Dependencias:** Ninguna  

---

### Problema 20
**Redefinición parcial de interfaces de tipos como `Order` en múltiples hooks**

**Descripción técnica:**  
La interfaz `Order` está declarada manualmente en `useOrderManager.ts` y de forma parcial en `UserOrdersSheet.tsx` en lugar de provenir de `src/types/`.

**Dónde ocurre:**  
- [`src/hooks/useOrderManager.ts`](file:///c:/Users/cange/Documents/fowy/src/hooks/useOrderManager.ts#L7)
- [`src/components/explorer/UserOrdersSheet.tsx`](file:///c:/Users/cange/Documents/fowy/src/components/explorer/UserOrdersSheet.tsx)

**Impacto:**  
Inconsistencias si se agregan nuevos campos a la tabla `orders` en el futuro.

**Prioridad:** Baja  
**Esfuerzo estimado:** S  
**Tiempo estimado:** 1 día  
**Beneficio esperado:** Fuente única de verdad para tipos de datos.  
**Dependencias:** Ninguna  

---

## 4. Roadmap Técnico

---

### **Fase 1: Correcciones Críticas & Blindaje de Seguridad**
* **Objetivos:** Blindar la creación de pedidos contra fraudes financieros, congelar el esquema SQL en repositorio Git y corregir canales de WebSockets.
* **Tareas:**
  1. Crear la función RPC `create_order_secure` en PostgreSQL para validar montos del carrito en el servidor antes de insertar en `orders`.
  2. Extraer el esquema actual de Supabase y generar los scripts numerados en `supabase/migrations/`.
  3. Corregir el ID de canal en `useServiceOrderManager.ts` agregando un sufijo único dinámico.
* **Tiempo estimado:** 2 semanas  
* **Riesgo:** Bajo  
* **Beneficio:** 100% de protección financiera e infraestructura reproducible.

---

### **Fase 2: Optimización de Rendimiento & Consultas**
* **Objetivos:** Reducir el consumo de red/CPU en PostgreSQL y optimizar la experiencia en smartphones.
* **Tareas:**
  1. Reemplazar `select('*')` en `useExplorerManager.ts` por columnas explícitas (`id, name, latitude, longitude, logo_url`).
  2. Crear columnas `tsvector` e índices GIN en la tabla `products` para búsquedas aceleradas.
  3. Parchar quirúrgicamente las actualizaciones de estado en Realtime en lugar de ejecutar refetches masivos.
  4. Memorizar con `React.memo` las tarjetas de productos y marcadores del mapa.
* **Tiempo estimado:** 3 semanas  
* **Riesgo:** Bajo  
* **Beneficio:** Reducción del 60% en carga de red y navegación fluida a 60 FPS.

---

### **Fase 3: Escalabilidad Masiva (100.000+ Usuarios)**
* **Objetivos:** Preparar el motor de base de datos para alta densidad comercial y miles de pedidos diarios.
* **Tareas:**
  1. Implementar paginación por cursor en el explorador de mapas.
  2. Trasladar el cálculo de horarios de apertura (`isBusinessOpen`) a una función SQL en PostgreSQL.
  3. Configurar tareas programadas de retención para la tabla `analytics_visits`.
  4. Sustituir agregaciones `.reduce()` en JavaScript por consultas SQL `SUM` y `COUNT`.
* **Tiempo estimado:** 4 semanas  
* **Riesgo:** Medio  
* **Beneficio:** Plataforma lista para operar con miles de negocios simultáneos.

---

### **Fase 4: Nivel Enterprise & Mantenibilidad**
* **Objetivos:** Garantizar estándares de código unificados, cobertura de pruebas y monitoreo proactivo.
* **Tareas:**
  1. Unificar los formularios de productos duplicados en un único componente modular.
  2. Reemplazar tipos `any` heredados por tipos estrictos autogenerados de Supabase.
  3. Refactorizar componentes que superen las 250 líneas dividiéndolos en sub-componentes atómicos.
  4. Configurar suite de pruebas automatizadas (Playwright E2E) e integración con Sentry.
* **Tiempo estimado:** 4 semanas  
* **Riesgo:** Bajo  
* **Beneficio:** Código limpio, mantenible y monitoreado en tiempo real.

---

## 5. Tabla de Deuda Técnica

| Deuda Técnica | Impacto | Complejidad | Prioridad |
| :--- | :--- | :---: | :---: |
| Checkout ejecutado en el cliente sin validación server-side | Crítico | Media | 🔴 Crítica |
| Ausencia de migraciones SQL versionadas en Git | Crítico | Media | 🔴 Crítica |
| Refetch masivo en eventos Realtime de mapa | Alto | Baja | 🔴 Crítica |
| Consultas de catálogo con `ilike` sin índice GIN | Alto | Media | 🔴 Crítica |
| Uso de `select('*')` trayendo JSONs pesados en el mapa | Alto | Baja | 🟠 Alta |
| Duplicación de modales de formulario de productos (Admin vs Socio) | Medio | Media | 🟠 Alta |
| Retención indefinida de filas en `analytics_visits` | Alto | Baja | 🟠 Alta |
| Presencia de tipos `any` en entidades nucleares legacy | Medio | Media | 🟡 Media |
| Componentes UI monolíticos de más de 500 líneas | Medio | Media | 🟡 Media |
| Falta de eliminación de imágenes en Storage al borrar en DB | Bajo | Baja | 🟡 Media |
| Ausencia de suite de pruebas automatizadas E2E | Medio | Alta | 🟡 Media |

---

## 6. Riesgos Futuros ante Crecimiento de Usuarios

```text
  [ 10,000 Usuarios ]   ──► Soportado con la infraestructura actual sin cambios.
  [ 100,000 Usuarios ]  ──► Requiere completar Fase 1 y Fase 2 (Checkout RPC e Índices GIN).
  [ 1,000,000 Usuarios] ──► Requiere completar Fase 3 (Paginación mapa, Particionamiento orders).
```

### **Comportamiento por escala:**

1. **A 10.000 Usuarios (Estado Actual / Excelente):**
   - **Módulos que soportan:** Autenticación, exploración, visualización de menús V2 (SWR), carga de imágenes.
   - **Intervención:** Ninguna requerida.

2. **A 100.000 Usuarios (Fase de Crecimiento Regional):**
   - **Módulos que soportan:** Autenticación de usuarios, menú digital V2, panel de negocios.
   - **Requieren Intervención Obligatoria:**
     - **Checkout y Pedidos:** La inserción directa desde el cliente debe reemplazarse por el procedimiento almacenado seguro RPC para evitar fraudes.
     - **Búsqueda en Catálogo:** La búsqueda con `ilike` comenzará a responder con latencias superiores a 2 segundos si no se implementan los índices GIN.

3. **A 1.000.000 de Usuarios (Escala Nacional / Enterprise):**
   - **Módulos que soportan:** SWR menú payload, almacenamiento de imágenes en Supabase Storage, autenticación JWT.
   - **Requieren Intervención Obligatoria:**
     - **Mapa del Explorador:** La consulta RPC de viewport deberá implementar paginación por cursor y el filtrado de horarios deberá ser 100% SQL.
     - **Base de Datos de Pedidos (`orders`):** La tabla necesitará particionamiento mensual por fecha para mantener la velocidad de consulta en los dashboards de negocios.

---

## 7. Decisiones de Ingeniería que NO deben modificarse

Basado en la arquitectura real del proyecto y sus documentos orientadores ([`conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)), las siguientes decisiones han demostrado ser aciertos estratégicos de ingeniería y **deben mantenerse tal como están**:

1. **La "Ley del Remolque" (Congelar refactorizaciones en código heredado estable):**
   - *Justificación:* En proyectos en fase de crecimiento, reescribir código antiguo que ya funciona solo por "pureza académica" introduce regresiones e interrumpe el desarrollo comercial. Exigir estándares de código **exclusivamente para los desarrollos nuevos** mientras se protege lo existente es el mejor enfoque de gestión de riesgos.
2. **Arquitectura Direct-to-BaaS (Next.js + Supabase Client + RLS):**
   - *Justificación:* Omitir un servidor backend intermedio reduce la latencia, abarata los costos operativos y acelera el desarrollo. La seguridad se mantiene blindada gracias a las políticas RLS en PostgreSQL.
3. **Procedimiento RPC Consolidado para el Menú (`get_business_menu_payload`):**
   - *Justificación:* Cargar toda la información del menú (negocio, productos, categorías, banners) en una sola llamada SQL elimina el problema de solicitudes en cascada (*Waterfall requests*) en redes móviles.
4. **Instanciación del Singleton de Supabase a nivel de módulo:**
   - *Justificación:* Crear el cliente fuera del ciclo de vida del componente previene la multiplicación indeseada de conexiones WebSocket durante re-renderizados en React 19.
5. **Snapshot inmutable de pedidos como JSON (`orders.items`):**
   - *Justificación:* Preserva el historial exacto del recibo del cliente en el momento de la compra, sin importar si el negocio modifica precios o borra platos del menú posteriormente.

---

## 8. Conclusión Ejecutiva

- **¿El proyecto está listo para producción?**  
  **SÍ.** El proyecto está listo para producción en su fase actual de lanzamiento comercial, MVP maduro y escalado controlado.

- **¿Está listo para escalar a 100.000+ usuarios?**  
  **NO DE INMEDIATO.** Requiere ejecutar la Fase 1 y Fase 2 del Roadmap Técnico (blindaje del checkout e índices de búsqueda) antes de recibir tráfico masivo.

- **¿Se debe reescribir?**  
  **NO.** Bajo ninguna circunstancia. La arquitectura base es sólida, modular y moderna.

- **¿Se debe continuar evolucionando?**  
  **SÍ.** Es la estrategia correcta de menor costo, menor riesgo y mayor velocidad de entrega.

- **Calificación Global del Proyecto:**  
  **8.0 / 10**

### **Justificación Final:**
FOWY es un producto de software extraordinariamente bien concebido desde la perspectiva de producto y negocio. Logró resolver de forma elegante la experiencia de usuario y la arquitectura de datos relacional/espacial. Los problemas detectados corresponden a la evolución natural de un sistema que pasa de etapa de prototipo/MVP a escalado Enterprise, y todos pueden corregirse de forma incremental mediante el Roadmap de Ingeniería sin detener la operación comercial.

---
*Fin de la Auditoría Técnica Oficial — FOWY 2026*
