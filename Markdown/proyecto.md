# 🏗️ BLUEPRINT MAESTRO: ARQUITECTURA "BÚNKER MODULAR" (DACRIBEL ENGINE)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este documento destila la ingeniería de Dacribel para ser usada como semilla en nuevas aplicaciones (Ej: App de Comidas). Se basa en tres pilares: **Aislamiento Total**, **Seguridad Industrial** y **Escalabilidad Modular**.

---

## 🏛️ PILLAR 1: FILOSOFÍA DE CONSTRUCCIÓN

1.  **IA-First Documentation**: El código no existe sin su manual en Markdown. La documentación es la "Memoria a Largo Plazo" del proyecto.
2.  **Sandboxing (Extensions)**: Las nuevas funcionalidades no tocan el Core. Se "enchufan" en una zona aislada.
3.  **Zero-Trust Database**: El frontend nunca tiene llaves maestras. Todo acceso a datos se filtra por RLS (Row Level Security) y Server-side clients.
4.  **Ethereal Aesthetics**: Diseño premium basado en capas tonales, glassmorfismo y ausencia de bordes duros.
5.  **Hook-as-Service**: Toda lógica de negocio pesada (Realtime, cálculos, transformaciones) vive en hooks especializados (`src/hooks/admin/`) para mantener los componentes visuales < 250 líneas.

---

## 🛠️ PILLAR 2: STACK TECNOLÓGICO ESTÁNDAR

- **Framework**: Next.js (App Router) - Obligatorio para gestión de Layouts anidados.
- **Base de Datos & Auth**: Supabase (PostgreSQL).
- **Estilos**: Tailwind CSS con sistema de tokens en `tailwind.config.ts`.
- **Animaciones**: Framer Motion (para efectos de "Revelado" y transiciones premium).
- **Gestión de Estado**: Patrón **Singleton + Refs** para suscripciones Realtime estables en React 19.

---

## 📂 PILLAR 3: MAPA DE CARPETAS (EL ADN)

```text
root/
├── app/                  <-- Enrutamiento y Layouts
│   ├── (auth)/           - Login/Register (Aislado)
│   ├── (store)/          - Interfaz de cliente (Core)
│   ├── (admin)/          - Panel de gestión (Protegido por roles)
│   ├── (extensions)/     - EL SANDBOX. Aquí viven los módulos nuevos.
│   └── api/              - Endpoints de backend y Webhooks.
├── components/
│   ├── ui/               - Atoms (Botones, Inputs, Cards).
│   ├── layout/           - Organisms (Navbars, Footers).
│   └── modules/          - Componentes específicos de cada extensión.
├── hooks/                - Lógica de negocio y Realtime (El cerebro móvil).
├── lib/
│   ├── schemas/          - Validaciones (Zod).
│   ├── crypto/           - Encriptación y seguridad binaria.
│   └── supabase/         - Clientes (Admin, Server, Browser).
├── context/              - Estado global (Language, Auth, UI).
└── Markdown/             - La biblioteca de inteligencia del proyecto.
```

---

## 🚀 PILLAR 4: FASES DE IMPLEMENTACIÓN (DE CERO A PRODUCCIÓN)

### FASE 1: CIMIENTOS (Infrastructure Setup)
1.  **Init App**: Next.js + Tailwind + Lucide Icons.
2.  **Supabase Connection**: Configurar `.env.local`.
3.  **Mapping**: Crear el primer `app.md`.

### FASE 2: EL BÚNKER (Security & Auth)
1.  **Middleware**: Gestor de sesiones y redirecciones.
2.  **Profiles Table**: Roles (`admin`, `business_owner`, `explorer`).
3.  **RLS Policies**: Blindaje total de tablas.

### FASE 3: EL MOTOR (Core & Realtime)
1.  **Realtime Engine**: Suscripciones estables con identificadores de canal únicos.
2.  **Notification Hub**: Alertas sonoras y visuales integradas.

---

## 🛡️ ESTADO DE CONSOLIDACIÓN (Actualizado 03-May-2026)

> ✅ **Estatus de Arquitectura**: El sistema ha alcanzado su madurez técnica tras completar 13 fases de desarrollo. La arquitectura "Búnker Modular" está plenamente operativa, con un desacoplamiento del 100% entre lógica (Hooks) y vista (Componentes).

> ✅ **Estado RLS**: Todas las tablas críticas (`businesses`, `products`, `orders`, `profiles`) cuentan con políticas RLS definitivas. Se ha eliminado cualquier rastro de políticas de desarrollo.

Referencia: Ver detalles técnicos en [solucion.md](file:///c:/Users/cange/Documents/fowy/Markdown/solucion.md) y [BITACORA.md](file:///c:/Users/cange/Documents/fowy/Markdown/BITACORA.md).

---
*Blueprint Dacribel: Ingeniería para Escalar sin Límites.*
*Consolidación Final por Antigravity AI para Cristian (CEO).*
