# 📊 Módulo de Métricas y Rankings (Dashboard Admin)

> **Documento de Planificación y Checklist**
>
> Este archivo detalla los pasos para implementar el selector circular y los rankings de "Visitas Totales" y "Clics de WhatsApp" en el Dashboard de Administración, respetando la regla del "remolque", la carga en un solo viaje y el límite de líneas por componente.

---

## 🛠️ Fase 1: Base de Datos y Optimización (Supabase)

- [x] **1.1. Acceder a la consola SQL de Supabase:** Ir a la sección "SQL Editor".
- [x] **1.2. Crear la función RPC consolidada (`get_admin_rankings`):** Ejecutar en el SQL Editor de Supabase la función SQL optimizada proporcionada en el chat (que consolida los rankings de top visitas/clicks y los históricos de tráfico global por día, semana y mes).
- [x] **1.3. Probar el RPC:** Verificar directamente en el SQL Editor o en las pruebas de red que la respuesta entrega un JSON válido con todos los rankings e históricos temporales.

## 📡 Fase 2: Orquestación de Datos (Frontend Orchestrator)

- [x] **2.1. Modificar `src/app/admin/dashboard/page.tsx`:**
  - Agregar un nuevo array vacío a las propiedades iniciales del estado `stats` para almacenar los rankings (ej. `rankings: { topVisits: [], topClicks: [] }`).
- [x] **2.2. Fetching de Datos (Viaje Único):**
  - Dentro de la función `fetchDashboardData`, hacer una llamada a `await supabase.rpc('get_admin_rankings')`.
- [x] **2.3. Actualizar Estado:**
  - Guardar la respuesta del RPC dentro de la llamada a `setStats`.
- [x] **2.4. Pasar Propiedades:**
  - Inyectar la propiedad opcional de los rankings al invocar `<DashboardGrowthChart />` (ej. `<DashboardGrowthChart businesses={stats.businesses} rankings={stats.rankings} />`).

## 🧩 Fase 3: Desacoplamiento (Componentes Atómicos)

- [x] **3.1. Crear archivo `src/components/admin/dashboard/DashboardRankingsList.tsx`:**
  - Inicializar este componente funcional para evitar exceder las 250 líneas en el archivo principal de la gráfica.
- [x] **3.2. Desarrollar el diseño Premium (UI/UX):**
  - Construir la visualización según el tipo de métrica:
    - **Visitas:** Lista estilizada tipo *Leaderboard* para el Top 10 (acompañará a la gráfica de líneas).
    - **WhatsApp:** Gráfica de Barras Verticales (Columnas) para hacer comparativa cabeza a cabeza de clics/pedidos por negocio.
  - Incluir diseño especial para los primeros 3 puestos (medallas o colores de acento oro, plata, bronce o gradientes FOWY).
  - Utilizar **solamente iconos minimalistas** (nada de iconos 3D).
  - Asegurar la responsividad del componente.

## 🎨 Fase 4: Gráfico e Interfaz de Usuario (DashboardGrowthChart)

- [x] **4.1. Modificar `src/components/admin/dashboard/DashboardGrowthChart.tsx`:**
  - Extender las `Props` para recibir de forma opcional los datos del ranking y los datos temporales del tráfico global.
- [x] **4.2. Crear estado para el Selector Circular:**
  - Agregar estado local `const [viewMode, setViewMode] = useState<"afiliados" | "visitas" | "clics">("afiliados");`
- [x] **4.3. Implementar UI del Selector Circular:**
  - Diseñar el selector con tres opciones (`Afiliaciones`, `Visitas`, `WhatsApp`).
  - Añadir las micro-animaciones con `framer-motion` (el `layoutId` pill-background) para destacar la opción seleccionada suavemente.
- [x] **4.4. Renderizado Condicional de la Gráfica/Ranking:**
  - Si `viewMode === 'afiliados'`: Renderizar el SVG actual de Curva Bezier con el crecimiento de negocios afiliados.
  - Si `viewMode === 'visitas'`: Renderizar un SVG de Curva Bezier (tráfico global en el tiempo) **+** el subcomponente con el Top 10 de negocios más visitados a un lado o debajo.
  - Si `viewMode === 'clics'`: Ocultar el SVG de línea y renderizar la Gráfica de Barras Verticales (Columnas) con el Top de negocios por clics en WhatsApp.
  - Envolver el cambio de vistas con `<AnimatePresence>` o `<motion.div>` para lograr un difuminado (fade-in/out) elegante entre los modos.

## 🐛 Fase 5: Corrección de Bug (Mapeo de Datos RPC)

- [x] **5.1. Actualizar `DashboardRankingsList.tsx`:**
  - Corregir el mapeo de propiedades que devuelve la función RPC `get_admin_rankings`.
  - Reemplazar `item.business_id` por `item.id`.
  - Reemplazar `item.business_name` por `item.name`.
  - Reemplazar `item.total_visits` y `item.whatsapp_clicks` por `item.count` en ambas vistas.
