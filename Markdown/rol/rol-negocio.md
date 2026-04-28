# 🎭 ROL: DUEÑO DE NEGOCIO (BUSINESS OWNER)

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Este rol representa al cliente B2B de FOWY. Su interfaz debe ser simplificada, enfocada en la operación diaria y la personalización de su "local" digital.

---

## 🏛️ ESTRUCTURA DEL DASHBOARD DE NEGOCIO (Items solicitados)

### 1. 📊 Dashboard (KPIs Generales)
*   **Visitas al Menú**: Cuántas personas han escaneado el QR o entrado al link hoy/semana/mes.
*   **Pedidos Recibidos**: Contador de órdenes activas y completadas.
*   **Ticket Promedio**: Valor medio de consumo por cliente.
*   **Estado de Membresía**: Indicador visual (Semaforización) del tiempo restante de su plan.

### 2. 📦 Pedidos (Gestión en Tiempo Real)
*   **Tablero de Control**: Lista de órdenes que entran al sistema al hacer clic en "Pedir por WhatsApp".
*   **Estados del Pedido**:
    *   🟡 **Pendiente**: Pedido recién realizado (esperando atención).
    *   🔴 **Cancelado**: Pedidos que no se concretaron (genera métrica de pérdida).
    *   🟢 **Realizado/Venta**: Pedido entregado y cobrado (alimenta las ventas totales).
*   **Métricas Operativas**:
    *   **Horas Pico**: Identificación de los momentos del día con más flujo.
    *   **Eficiencia**: Tiempo promedio en que el dueño marca un pedido como realizado.

### 🍔 3. Menú (Gestión de Productos)
*   **Categorías**: Crear, editar y organizar secciones (ej: Pizzas, Hamburguesas, Bebidas).
*   **Editor de Productos**:
    *   **Multimedia**: Subida de imágenes con compresión automática (80% ahorro de espacio).
    *   **Info Básica**: Nombre, descripción detallada y precio.
    *   **Promociones**: Posibilidad de marcar productos con precio de oferta o tags de "Nuevo", "Recomendado".
    *   **Stock**: Switch de "Disponible/Agotado" para ocultar productos al instante.

### 4. 📈 Finanzas (Ventas e Inteligencia)
*   **Ventas Totales**: Gráfico de ingresos basado únicamente en pedidos con estado **Realizado**.
*   **Análisis de Productos**: Cuál es el ítem más vendido y cuál el más ignorado.
*   **Reportes de Conversión**: Cuántos clics en WhatsApp se convierten realmente en ventas finalizadas.

### 5. 💳 Pagos (Membresía FOWY)
*   **Instrucciones de Pago**: Datos de la cuenta para transferencias.
*   **Carga de Comprobante**: Sección para subir captura/foto del pago (Webhook o alerta para el Admin).
*   **Estatus del Pago**: Espera de aprobación / Aprobado / Rechazado.

### 6. ⚙️ Configuración (Branding & Módulos)
*   **Branding**: Carga de logo circular y selección de color de identidad del menú.
*   **WhatsApp**: Configuración del número de destino de los pedidos.
*   **Módulos FOWY**: Activar/Desactivar herramientas adicionales (ej: Delivery, Reservas, Encuestas).
*   **Horarios**: Definición de horas de atención para el menú digital.

---

## 🧩 PLAN DE IMPLEMENTACIÓN TÉCNICA

1.  **Rutas**: Crear grupo `(partners)/business` con layouts protegidos.
2.  **Base de Datos**: 
    *   Tabla `products`: Vinculada a `business_id`.
    *   Tabla `orders`: Para registrar las transacciones y generar los KPIs.
    *   Tabla `membership_payments`: Para el flujo de captura de pantalla y validación.
3.  **UI Reutilizable**: Adaptar los componentes `PremiumImage`, `StatsGrid` y `Pagination` para el contexto del negocio.

---

## 🤔 PREGUNTAS PARA REFINAR EL ROL
*   ¿Los pedidos llegarán por WhatsApp únicamente o quieres una sección de "Pedidos Activos" con sonido en este dashboard?
*   ¿El color del menú debe ser libre (Color Picker) o basado en 5-10 temas premium diseñados por FOWY?
*   ¿El dueño del negocio podrá tener varios usuarios (empleados) o solo una cuenta maestra?

---
*Documento de arquitectura - FOWY 2026*
