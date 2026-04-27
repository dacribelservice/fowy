# 🏗️ CHECKLIST: CONSTRUCCIÓN DEL NÚCLEO (CORE)

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
- [ ] **2.1 Role Types**: Definir el Enum `user_role` en Supabase (super_admin, professional, seller, business_owner, explorer).
- [ ] **2.2 Profiles Table**: Crear tabla `profiles` (id, email, full_name, role, avatar_url).
- [ ] **2.3 Auto-Profile Trigger**: Crear función PL/pgSQL para insertar en `profiles` tras cada nuevo registro en `auth.users`.
- [ ] **2.4 RLS Mastery**: Configurar políticas para que los usuarios solo editen su propio perfil.

---

## 🚪 FASE 3: EL PORTERO (Authentication & Routing)
- [ ] **3.1 Auth Pages**: Crear `/login` y `/register` con validación de formularios (Zod).
- [ ] **3.2 Auth Provider**: Crear un Context Provider para manejar el estado de la sesión globalmente.
- [ ] **3.3 Middleware Shield**: Implementar `middleware.ts` para gestionar redirecciones por rol:
    - `/admin/*` -> Solo super_admin/professional.
    - `/partners/*` -> Solo seller/business_owner.
    - `/core/*` -> Todos los autenticados.

---

## 🎨 FASE 4: EL CASCARÓN (Base UI & Layout)
- [ ] **4.1 Theme Tokens**: Configurar `tailwind.config.ts` con los degradados (Rojo-Naranja / Morado-Azul) y radios de 20px.
- [ ] **4.2 Master Shell**: Crear el Layout principal con el Sidebar Glassmorphism y el fondo degradado suave.
- [ ] **4.3 Motion Presets**: Configurar los componentes base de `framer-motion` para entradas (Fade-in + Slide-up).
- [ ] **4.4 Error Boundary**: Implementar el componente de error global con estética premium.

---
*Si esta lista llega al 100%, el sistema es indestructible y listo para recibir módulos.*
