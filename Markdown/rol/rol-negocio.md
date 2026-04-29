# 🎭 ROL: DUEÑO DE NEGOCIO (BUSINESS OWNER)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este rol representa al cliente B2B de FOWY. Su interfaz es un centro operativo premium, enfocado en la gestión en tiempo real y la personalización de su identidad visual.

---

## 🏛️ ESTRUCTURA DEL PANEL DEL NEGOCIO (Módulos)

### 1. 📊 Dashboard (Inteligencia)
*   **Visitas al Menú**: Métrica de tráfico real (cuántas personas entraron a ver el menú).
*   **Pedidos Recibidos**: Contador de órdenes activas y completadas.
*   **Ticket Promedio**: Valor medio de consumo por cliente.
*   **Estado de Membresía**: Semaforización del tiempo restante de su plan.

### 2. 📦 Pedidos (Gestión en Tiempo Real)
*   **Tablero de Control**: Las órdenes entran al sistema en el instante en que el cliente hace clic en "Pedir por WhatsApp" desde el Checkout.
*   **Notificación Sonora**: Sonido de **`cash-register.mp3`** cada vez que entra un nuevo pedido.
*   **Estados**: 🟡 Pendiente, 🔴 Cancelado, 🟢 Realizado (Venta).
*   **Métricas Operativas**: Horas pico y eficiencia de despacho.

### 🍔 3. Menú Digital (Gestión de Productos)
*   **Categorías**: Creación y organización de secciones.
*   **Editor de Productos**:
    *   **Multimedia**: Subida con compresión automática (80% ahorro).
    *   **Promociones**: Tags de "Nuevo", "Oferta", "Recomendado".
    *   **Stock**: Switch de "Disponible/Agotado" con efecto inmediato en el menú.
*   **Disponibilidad**: Si se definen **Horarios**, el botón de pedido desaparece automáticamente fuera de hora y muestra un mensaje de "Fuera de Servicio".

### 4. 📈 Finanzas (Ventas y Conversión)
*   **Ingresos**: Gráfico basado solo en pedidos con estado **Realizado**.
*   **Embudo**: Reporte de cuántas visitas al menú se convirtieron en clics de WhatsApp.

### 5. 💳 Mi Plan (Membresía FOWY)
*   **Pagos**: Instrucciones de transferencia y sección para **Carga de Comprobante**.
*   **Estatus**: Seguimiento de validación por parte del Admin de Fowy.

### 6. 🎨 Perfil & Branding
*   **Logo**: Carga de imagen circular premium.
*   **Identidad Visual**: Selección de color de marca mediante **Color Picker** (Personalización total).
*   **WhatsApp**: Configuración del número destino para los pedidos.
*   **Módulos Activos**: Vista de los módulos contratados (Delivery, Reservas, etc.). *Nota: Solo el Admin de Fowy puede activar/desactivar estos módulos.*

---

## 🧩 PLAN DE IMPLEMENTACIÓN TÉCNICA

1.  **Rutas**: Grupo `(partners)/business` con layouts de cristal y protección de sesión.
2.  **Base de Datos**: 
    *   Tabla `analytics_visits`: Para el KPI de visitas al menú.
    *   Tabla `orders`: Registro instantáneo al disparar el evento de WhatsApp.
    *   Tabla `membership_payments`: Gestión de comprobantes.
3.  **Sonidos**:
    *   Negocio: `cash-register.mp3`.
    *   Usuario (Explorer): `alert.mp3`.

---
*Blueprint de Rol v6 - Actualizado Abril 2026*

