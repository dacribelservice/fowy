# 🏗️ ESQUEMA DE APLICACIÓN: ARQUITECTURA "CENTRO COMERCIAL" (FOWY)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Estado**: Fase 13 (Estabilidad Realtime) - **COMPLETADA ✅**
> **Tecnología**: Next.js 15 (App Router), Supabase, Vercel.

---

## 🔗 ENLACES DE DESARROLLO (Localhost)
- **Link del Admin**: http://localhost:3000/admin/negocios
- **Link del Negocio**: http://localhost:3000/business/orders
- **Link del Usuario**: http://localhost:3000/explorar

---

## 🏛️ EL NÚCLEO (The Mall)
El núcleo es el sistema operativo de la app. Gestiona usuarios, seguridad y navegación global.

### 📂 Estructura de Carpetas Real (ADN Modular)

```text
root/
├── app/
│   ├── (auth)/               <-- Login/Registro (Simplificado)
│   ├── (explorer)/           <-- El Explorador (Mobile-First Shell)
│   ├── (partners)/           <-- Panel de Socios (/business/*)
│   ├── admin/                <-- Panel de Super Administrador
│   └── api/                  <-- Webhooks y funciones de servidor.
├── components/
│   ├── admin/                - Componentes administrativos (shared/businesses)
│   ├── auth/                 - Formularios de acceso
│   └── explorer/             - Componentes del mapa y sheets
├── hooks/                    - Orquestadores (useOrderManager, useExplorerManager)
├── services/                 - Lógica de negocio (storageService, authService)
└── utils/                    - Helpers (geo.ts, supabase/client)
```

---

## 🛡️ ESTRATEGIA DE SEGURIDAD (El Blindaje)

### 1. Supabase RLS (Row Level Security)
No confiamos en el Frontend. La base de datos decide quién ve qué:
*   **profiles**: Solo el `owner_id` puede ver sus datos. Admins ven todo.
*   **roles**: `super_admin`, `professional`, `seller`, `business_owner`, `user`.
*   **isolation**: Cada extensión tiene su propia tabla con `RLS` estricto.

### 2. Middleware (El Portero)
Implementaremos un `middleware.ts` en la raíz que:
*   Detecta la sesión del usuario.
*   Valida el rol contra la ruta (Ej: `/partners/*` requiere rol `seller` o `business_owner`).
*   Si un usuario no tiene permiso, es expulsado al núcleo en `< 50ms`.

### 3. Failsafe (Fallo Seguro)
Cada carpeta dentro de `(extensions)/` debe contener:
*   `layout.tsx`: Define el diseño del módulo.
*   `error.tsx`: **CRÍTICO**. Captura errores del módulo. Si el inventario falla, muestra un mensaje de "Módulo en mantenimiento" pero permite seguir navegando por el Menú Digital.

---

## 📊 JERARQUÍA DE DATOS & DASHBOARDS

| Nivel | Dashboard | KPI Principal |
| :--- | :--- | :--- |
| **Super Admin** | `/admin` | Ingresos Globales, Salud del Sistema, Usuarios Activos. |
| **Profesional** | `/admin/tools` | Tickets de Soporte, Logs de Error, Métricas Técnicas. |
| **Vendedor** | `/partners/seller` | Negocios Captados, Comisiones, Rendimiento de Cartera. |
| **Dueño Negocio** | `/partners/business` | Ventas del local, Inventario, Clientes Fieles. |
| **Usuario** | `/core/profile` | Pedidos Recientes, Puntos, Favoritos. |

---

## 🚀 ESCALABILIDAD (Cómo agregar un "Local")
Para añadir una nueva funcionalidad (Ej: Reservas de Mesa):
1.  Crear `app/(extensions)/reservations/`.
2.  Crear tabla `reservations` en Supabase con RLS.
3.  Activar el "Kill Switch" en `config/modules.ts`.
4.  ¡Listo! El sistema lo integra automáticamente sin tocar el código del Login o el Core.

---
*Diseñado bajo el estándar Dacribel para máxima resiliencia.*
