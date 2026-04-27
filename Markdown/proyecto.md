# 🏗️ BLUEPRINT MAESTRO: ARQUITECTURA "BÚNKER MODULAR" (DACRIBEL ENGINE)

> [!IMPORTANT]
> **REGLA DE ORO PROYECTO**: ESTE ARCHIVO ES EL PLANO MAESTRO PARA REPLICAR LA ARQUITECTURA EN NUEVOS PROYECTOS. NUNCA COMENZAR UNA APP SIN QUE LA IA LEA Y ENTIENDA CADA FASE DE ESTE DOCUMENTO.

Este documento destila la ingeniería de Dacribel para ser usada como semilla en nuevas aplicaciones (Ej: App de Comidas). Se basa en tres pilares: **Aislamiento Total**, **Seguridad Industrial** y **Escalabilidad Modular**.

---

## 🏛️ PILLAR 1: FILOSOFÍA DE CONSTRUCCIÓN

1.  **IA-First Documentation**: El código no existe sin su manual en Markdown. La documentación es la "Memoria a Largo Plazo" del proyecto.
2.  **Sandboxing (Extensions)**: Las nuevas funcionalidades no tocan el Core. Se "enchufan" en una zona aislada.
3.  **Zero-Trust Database**: El frontend nunca tiene llaves maestras. Todo acceso a datos se filtra por RLS (Row Level Security) y Server-side clients.
4.  **Ethereal Aesthetics**: Diseño premium basado en capas tonales, glassmorfismo y ausencia de bordes duros.

---

## 🛠️ PILLAR 2: STACK TECNOLÓGICO ESTÁNDAR

- **Framework**: Next.js (App Router) - Obligatorio para gestión de Layouts anidados.
- **Base de Datos & Auth**: Supabase (PostgreSQL).
- **Estilos**: Tailwind CSS con sistema de tokens en `tailwind.config.ts`.
- **Animaciones**: Framer Motion (para efectos de "Revelado" y transiciones premium).
- **Pagos**: Arquitectura de Webhooks (NOWPayments o similar) con validación HMAC-SHA512.

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
├── lib/
│   ├── schemas/          - Validaciones (Zod).
│   ├── crypto/           - Encriptación y seguridad binaria.
│   └── supabase/         - Clientes (Admin, Server, Browser).
├── context/              - Estado global (Language, Auth, UI).
├── config/               - Interruptores globales (Kill Switches).
└── Markdown/             - La biblioteca de inteligencia del proyecto.
```

---

## 🚀 PILLAR 4: FASES DE IMPLEMENTACIÓN (DE CERO A PRODUCCIÓN)

### FASE 1: CIMIENTOS (Infrastructure Setup)
1.  **Init App**: Next.js + Tailwind + Lucide Icons.
2.  **Supabase Connection**: Configurar `.env.local` con llaves de anon y service_role.
3.  **Mapping**: Crear el primer `app.md` con la estructura de carpetas deseada.

### FASE 2: EL BÚNKER (Security & Auth)
1.  **Middleware**: Implementar el gestor de sesiones y redirecciones de seguridad.
2.  **Profiles Table**: Crear tabla de perfiles con sistema de roles (`admin` vs `user`).
3.  **RLS Policies**: Bloquear todas las tablas por defecto. Permitir SELECT solo a autenticados y ALL solo a roles admin vía `security definer` functions.

### FASE 3: EL ALMA (Design System)
1.  **Tokens**: Definir paleta de colores premium en `tailwind.config.ts`.
2.  **Base UI**: Crear componentes de botón, input y cards con efectos de glassmorfismo y hover dinámico.
3.  **Layout Root**: Implementar `LanguageContext` y `AuthContext` envolviendo la app.

### FASE 4: EL MOTOR (Core Logic)
1.  **Product Engine**: CRUD de productos y categorías en el panel Admin.
2.  **Checkout Flow**: Implementar la lógica de reserva de stock (Atomic Reservation) para evitar sobreventas.
3.  **Payments API**: Configurar la recepción de Webhooks con validación de firma digital.

### FASE 5: LA ARENA (Modular Sandbox)
1.  **Extensions Setup**: Crear carpeta `extensions/` con su propio `layout.tsx` (Escudo térmico) y `error.tsx` (Failsafe).
2.  **Registry**: Crear `config/extensions.ts` para permitir activar/desactivar módulos sin tocar el código central.
3.  **Schematic Isolation**: Cada módulo debe tener su propio esquema en la base de datos (Ej: `psn`, `food_menu`, `inventory`).

### FASE 6: REFINAMIENTO (Branding & UX)
1.  **Reveal Effects**: Añadir animaciones de entrada a elementos críticos.
2.  **Branding**: Consolidar logos, footers dinámicos y metadata SEO.

---

## 🧩 GUÍA PARA REPLICAR

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Si quieres crear la App de Comidas usando esta base:
1.  **Core**: La tienda vende platos en lugar de códigos digitales.
2.  **Módulo 1 (`extensions/delivery`)**: Tracker de repartidores en tiempo real.
3.  **Módulo 2 (`extensions/reservations`)**: Sistema de reserva de mesas.
4.  **Aislamiento**: Las tablas de platos van en `public`, pero el sistema de reservas de mesas va en un esquema de DB llamado `reservations`.

---
*Blueprint Dacribel: Ingeniería para Escalar sin Límites.*
*Diseñado por Antigravity AI para Cristian (CEO).*
