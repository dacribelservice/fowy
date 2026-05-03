# 🏗️ CHECKLIST: CONSTRUCCIÓN DEL NÚCLEO (CORE)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este es el plan de ejecución paso a paso para los cimientos de la aplicación. 
**Regla:** Solo marcar como completado [x] cuando la tarea esté probada y sin errores.

---

## 🛠️ FASE 1: INFRAESTRUCTURA (Infrastructure Setup)
- [x] **1.0 Planning**: Definir visión, pilares y arquitectura modular (`Markdown/`).
- [x] **1.1 Init Project**: Ejecutar `npx create-next-app@latest` con Tailwind y TypeScript.
- [x] **1.2 Supabase Client**: Instalar `@supabase/ssr` y `@supabase/supabase-js`.
- [x] **1.3 Environment**: Configurar `.env.local` con `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [x] **1.4 UI Foundation**: Instalar `lucide-react`, `framer-motion` y `clsx`.

---

## 🧠 FASE 2: EL CEREBRO (Database & Security)
- [x] **2.1 Role Types**: Definir el Enum `user_role` en Supabase (super_admin, professional, seller, business_owner, explorer).
- [x] **2.2 Profiles Table**: Crear tabla `profiles` (id, email, full_name, role, avatar_url).
- [x] **2.3 Auto-Profile Trigger**: Crear función PL/pgSQL para insertar en `profiles` tras cada nuevo registro en `auth.users`.
- [x] **2.4 RLS Mastery**: Configurar políticas para que los usuarios solo editen su propio perfil.

---

## 🏁 ESTADO DEL NÚCLEO: 100% COMPLETADO ✅
El núcleo de la aplicación FOWY ha sido consolidado. La infraestructura, seguridad, autenticación y base visual son estables y sirven de cimiento para todos los módulos de socios, expertos y exploradores.

> 📊 **Progreso Global**: Para ver el avance detallado de las 13 fases de implementación y los próximos pasos de lanzamiento, consulta la [HOJA_DE_RUTA.md](file:///c:/Users/cange/Documents/fowy/Markdown/HOJA_DE_RUTA.md).

---
*FOWY Core v1.0 - Consolidación Final 03-May-2026*
