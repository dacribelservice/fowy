# 🏪 MÓDULO: GESTIÓN DE NEGOCIOS (ADMIN)

Este módulo es el corazón de la administración de FOWY. Permite el control total sobre los establecimientos afiliados, su categorización y las funcionalidades (módulos) que tienen contratados.

---

## 📊 1. DASHBOARD DE NEGOCIOS (LISTADO)
Una tabla maestra con los siguientes **KPIs y métricas sugeridas**:

- **Estado de Salud**: (Activo / Pendiente de Pago / Suspendido).
- **Rendimiento de Ventas**: Volumen total transaccionado por el negocio en el último mes.
- **Tasa de Adopción**: Número de módulos activos vs. módulos disponibles.
- **Fidelidad**: Tiempo transcurrido desde la afiliación.
- **Actividad**: Fecha y hora de la última operación registrada.

---

## 🏷️ 2. GESTIÓN DE CATEGORÍAS
Panel para que el Super Admin defina el ecosistema. Ejemplos de categorías:
- **Gastronomía**: Restaurantes, Cafés, Bares.
- **Servicios**: Barberías, Consultorios, Spas.
- **Retail**: Tiendas de ropa, Minimarkets.
- **Entretenimiento**: Cines, Parques, Centros de eventos.

---

## 🧩 3. PANEL DE MÓDULOS (Marketplace Interno)
Selector de funciones que el Admin puede activar/desactivar por cada negocio de forma individual:

- **Dashboard de Ventas**: Visualización de métricas propias para el dueño del local.
- **Menú Digital / Catálogo**: Gestión de productos y precios.
- **Gestión de Inventario**: Control de stock en tiempo real.
- **Sistema de Pedidos / Delivery**: Recepción y despacho de órdenes.
- **Programa de Lealtad**: Gestión de puntos y clientes frecuentes.

---

## 🛠️ ESTRUCTURA TÉCNICA SUGERIDA
- **Tabla DB**: `businesses` (id, owner_id, name, category_id, status, settings_json).
- **Tabla DB**: `business_modules` (business_id, module_key, is_enabled).
- **Tabla DB**: `categories` (id, name, icon, slug).

---

## ❓ PREGUNTAS PARA PULIR EL MÓDULO
1. **¿Flujo de Activación?**: ¿Cuando un negocio se crea, debe ser aprobado por ti (Super Admin) antes de aparecer en la app, o se crea como "Activo" por defecto?
2. **¿Planos de Precios?**: ¿El panel de módulos estará ligado a planes (Ej: Plan Básico tiene 3 módulos, Plan Pro tiene todos)? ¿O activas módulos uno por uno según acuerdes con el cliente?
3. **¿Datos de Contacto?**: Además de los KPIs, ¿quieres que la tabla de negocios muestre de entrada el contacto del dueño o prefieres eso en una vista de detalle (al hacer clic)?
