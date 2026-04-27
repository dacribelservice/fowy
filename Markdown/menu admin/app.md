# 🏗️ ESQUEMA DE APLICACIÓN: ARQUITECTURA "CENTRO COMERCIAL" (FOWY)

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

> **Estado**: Planificación / Fase 1
> **Tecnología**: Next.js 14+ (App Router), Supabase, Vercel.

---

## 🏛️ EL NÚCLEO (The Mall)
El núcleo es el sistema operativo de la app. Gestiona usuarios, seguridad y navegación global. Si un módulo falla, el núcleo lo aísla.

### 📂 Estructura de Carpetas (ADN Modular)

```text
root/
├── app/
│   ├── (auth)/               <-- Puerta de entrada (Login/Registro)
│   ├── (core)/               <-- El "Mall". Interfaz base y explorador.
│   ├── (admin)/              <-- Dashboard Super Admin & Profesionales.
│   ├── (partners)/           <-- Dashboard Vendedores y Dueños de Negocio.
│   ├── (extensions)/         <-- LOS LOCALES (Sandbox Modular)
│   │   ├── menu-digital/     - Módulo de cartas QR.
│   │   ├── delivery/         - Módulo de logística.
│   │   ├── inventory/        - Módulo de stock.
│   │   └── layout.tsx        - Escudo térmico (Global Extension Layout).
│   └── api/                  <-- Pasarela de datos y Webhooks.
├── components/
│   ├── shared/               - UI Atoms (Botones, Inputs con Glassmorfismo).
│   ├── layout/               - Shells (Navbars, Sidebars independientes).
│   └── modules/              - Lógica visual aislada de cada extensión.
├── lib/
│   ├── core/                 - Clientes de Supabase y funciones críticas.
│   └── modules/              - SDKs internos de cada extensión.
└── supabase/                 <-- El Búnker de Datos.
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
