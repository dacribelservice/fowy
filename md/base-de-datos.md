# 🗄️ ESTRUCTURA DE DATOS: EL MOTOR RELACIONAL

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

> "Datos limpios, negocio escalable."

## 1. EL MODELO "MULTI-TENANT"

**Decisión: Aislamiento por Discriminador (`negocio_id`)**
**Por qué es la mejor decisión:**
Para que FOWY sea como un "Centro Comercial", cada registro de pedido, producto o KPI debe pertenecer a un `negocio_id`. Esto permite que, aunque todos los datos vivan en la misma base de datos, lógicamente estén separados por muros infranqueables de RLS.

---

## 2. TABLAS NÚCLEO (CORE)

### Ciudades (`cities`)
- `id`: UUID (PK)
- `name`: Text (Ej: "Cali")
- `slug`: Text (Ej: "cali")
- `geojson_url`: Text (Para el mapa estático de la ciudad)
- `center_point`: Point (Coordenadas de inicio del mapa)

### Perfiles (`profiles`)
- `id`: UUID (Primary Key) -> Enlazado a Auth.users
- `email`: Text
- `full_name`: Text
- `phone`: Text (Para WhatsApp)
- `address_default`: Text
- `role`: enum ('BUSINESS', 'USER')
- `metadata`: JSONB (Para KPIs rápidos)

### Negocios (`businesses`)
- `id`: UUID
- `owner_id`: UUID (FK a profiles.id)
- `city_id`: UUID (FK a cities.id)
- `name`: Text
- `slug`: Text (URL del menú)
- `whatsapp_number`: Text (Número donde llegarán los pedidos)
- `location`: Point (lat, lng para el mapa)
- `barrio`: Text (Para filtros zonales)
- `status`: enum ('active', 'maintenance', 'closed')

**Por qué el campo `status` es clave:**
Si un local "cierra por mantenimiento", simplemente validamos este campo en el Layout del menú. La app sigue viva, pero ese "local" específico muestra un cartel de cerrado de forma automática.

---

## 3. SISTEMA DE PEDIDOS Y VENTAS

### Pedidos (`orders`)
- `id`: UUID (PK)
- `business_id`: UUID (FK)
- `customer_id`: UUID (FK a profiles.id)
- `customer_name`: Text
- `customer_phone`: Text
- `customer_address`: Text
- `total_amount`: Numeric
- `status`: enum ('pending', 'processing', 'completed', 'cancelled')
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Favoritos (`favorites`)
- `id`: UUID (PK)
- `profile_id`: UUID (FK)
- `business_id`: UUID (FK)
- `created_at`: Timestamp (Para el KPI de "Negocios más guardados")

### Detalle del Pedido (`order_items`)
- `id`: UUID (PK)
- `order_id`: UUID (FK)
- `menu_item_id`: UUID (FK)
- `quantity`: Integer
- `price_at_time`: Numeric (Para histórico de precios)

---

## 3. MÓDULOS ENCHUFABLES (ENCHANTED TABLES)

### Menú Digital (`menu_items`, `categories`)
Separado de la lógica de administración. Si el sistema de administración de vendedores cae, el menú digital (que es de solo lectura para el cliente) debe seguir funcionando desde la caché.

### KPIs y Analítica (`analytics_events`)
**Decisión: Tablas de Eventos en lugar de Totales**
**Por qué es la mejor decisión:**
En lugar de guardar solo el "Total de Ventas", guardamos cada evento. Esto nos permite reconstruir los KPIs en cualquier momento y ofrecer gráficas detalladas en los dashboards de cada rol sin riesgo de corrupción de datos.

---

## 4. ESCALABILIDAD FUTURA

**Decisión: Índices GIN sobre campos JSONB**
Para los KPIs especializados de cada rol, usaremos un campo `data` tipo JSONB. Al indexarlos con GIN, las consultas serán instantáneas aunque el proyecto crezca a miles de negocios.

---
**"FOWY: Integridad de datos a prueba de futuro."**
