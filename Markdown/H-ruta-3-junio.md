# Hoja de Ruta - 3 de Junio

### Fase 1: Gestión de Negocios Inactivos / Pausados

- [x] **1.1. Ocultar negocios inactivos del mapa**: Modificar `src/hooks/useExplorerManager.ts` para que la función `fetchBusinesses` filtre los resultados asegurando que solo se muestren los negocios activos (`status === true`) que además estén abiertos (`isBusinessOpen(biz.schedules)`).
- [x] **1.2. Pantalla Glassmorphism en Menú Inactivo**: Editar `src/app/(explorer)/[slug]/page.tsx` para verificar el estado del negocio (`const isBusinessActive = business?.status === true;`). Si el negocio está inactivo, renderizar un overlay absoluto con efecto de vidrio esmerilado premium (`backdrop-blur-md`) que bloquee la interacción con el menú.
- [x] **1.3. Diseño de la Pantalla de Mantenimiento**: Diseñar una tarjeta central sobre el overlay que contenga un mensaje de "Menú en mantenimiento" y un botón de "Regresar al mapa". (importante los logos deben de ser minimalistas) ⚠️

### Fase 2: Corrección de Métricas y Gráficas de Ventas

- [x] **2.1. Corregir contador de Pedidos Recibidos y Ticket Promedio**: Modificar `src/components/admin/businesses/BusinessMetricsList.tsx` para usar la consulta de conteo nativo de Supabase (`count: "exact"`) para la cantidad de pedidos y, preferiblemente, implementar una función RPC (ej. `get_business_sales_stats`) para calcular el ticket promedio sin descargar la tabla completa de pedidos (lo cual causa que el total se quede estancado en 1000 debido al límite de la base de datos).
- [x] **2.2. Solucionar días vacíos ($0) en la Gráfica de Ventas**: Modificar el hook `src/components/admin/businesses/useFowySalesData.ts`. En la consulta principal (`supabase.from("orders")...`), calcular la fecha de inicio del período en el cliente (ej. 7 días, 6 semanas o 6 meses atrás) y añadir un filtro `.gte("created_at", fechaInicio)`. Esto evita descargar los 1000 registros más antiguos y garantiza que la gráfica siempre reciba los datos de los días recientes.
