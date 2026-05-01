# 🔐 MÓDULO DE AUTENTICACIÓN (LOGIN & REGISTER)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este documento define la hoja de ruta para la implementación del sistema de acceso de FOWY, siguiendo la estética **Ethereal High-Tech** y la infraestructura de **Supabase Auth**.

---

## 🎨 ESTÁNDARES DE DISEÑO (diseño.md)
*   **Superficies**: Glassmorphism (`backdrop-blur-md`, borde blanco traslúcido).
*   **Botones Primarios**: Gradiente Energy (`from-[#FF5A5F] to-[#FF9A3D]`).
*   **Botones Sociales (Google)**: Fondo blanco puro, borde sutil, icono oficial.
*   **Campos de Entrada**: `rounded-[20px]`, fondo traslúcido, foco con resplandor suave.
*   **Animaciones**: `framer-motion` (Slide up & Fade in).

---

## 📋 CHECKLIST DE IMPLEMENTACIÓN

### Fase 1: Configuración de Backend (Supabase & Google)
- [x] **1.1 Proveedores**: Habilitar Google Auth en el Dashboard de Supabase.
    *   *Requisito:* Crear proyecto en **Google Cloud Console**, configurar pantalla de consentimiento y obtener Client ID/Secret.
    *   *Callback URL:* Configurar `https://[PROJECT_ID].supabase.co/auth/v1/callback` en Google.
- [x] **1.2 Redirección**: Configurar `URL Configuration` (Site URL) en Supabase para manejar el flujo de `/auth/callback` en desarrollo y producción.
- [x] **1.3 SMTP Profesional**: Configurar el envío de correos usando el dominio profesional de FOWY (Resend + Vercel DNS).
    *   *Acción:* Desactivar el "Built-in email provider" de Supabase y configurar los ajustes SMTP (Host, Port, User, Password) para asegurar entregabilidad.
- [x] **1.4 Email Templates**: Personalizar los correos (Confirmación, Reset Password, Magic Link) con HTML/CSS premium siguiendo el estilo *Ethereal*.

### Fase 2: Desarrollo de UI (Pantallas)
#### 2.1 Pantalla de Inicio de Sesión (Login)
- [x] **2.1.1 Card Master**: Contenedor Glassmorphism centrado.
- [x] **2.1.2 Social Login**: Botón de "Continuar con Google".
- [x] **2.1.3 Email Form**: Inputs premium para Email y Contraseña.
- [x] **2.1.4 Auxiliares**: Enlace "¿Olvidaste tu contraseña?" y "¿Aún no tienes cuenta?".

#### 2.2 Pantalla de Registro (Sign Up)
- [x] **2.2.1 Social Register**: Botón de registro con Google.
- [x] **2.2.2 Email Register**: Formulario de creación de cuenta (Email, Contraseña, Confirmar Contraseña).
- [x] **2.2.3 Link**: Enlace "¿Ya tienes cuenta? Inicia sesión".

#### 2.3 Pantalla de Recuperación
- [ ] **2.3.1 Recovery Form**: Input de email para envío de enlace mágico.
- [ ] **2.3.2 Feedback**: Modal de éxito tras envío del correo con estética FOWY.

### Fase 3: Lógica y Conexión (Logic)
- [ ] **3.1 Auth Callback**: Crear `app/auth/callback/route.ts` para intercambiar el código por sesión y persistir la cookie de Supabase.
- [ ] **3.2 Social Logic**: Implementar `signInWithOAuth` para Google con manejo de redirección dinámica.
- [ ] **3.3 Email Logic**: Implementar `signInWithPassword`, `signUp` y `resetPasswordForEmail`.
- [ ] **3.4 Middleware Protection**: Implementar `middleware.ts` para proteger rutas `/admin/*` y `/business/*`, validando el rol del usuario en cada petición.

### Fase 4: Refinamiento y UX
- [ ] **4.1 Error Handling**: Implementar Toasts Premium para errores de credenciales o red.
- [ ] **4.2 Loading States**: Skeletons o Spinners con gradientes de FOWY durante la autenticación.
- [ ] **4.3 Password Visibility**: Toggle (ojo) para mostrar/ocultar contraseñas.

---

## 🚀 FLUJO DE NAVEGACIÓN
1.  **Explorador** -> Clic en Perfil -> **Modal/Pantalla Login**.
2.  **Login** -> "¿No tienes cuenta?" -> **Registro**.
3.  **Login** -> "¿Olvidaste tu contraseña?" -> **Recuperación**.
4.  **Auth Exit** -> Redirección automática según `user_role`.

---

## 🛠️ LIMPIEZA DE SOLUCIONES TEMPORALES (Post-Login)

Una vez implementada la Fase 1-3 del Login, se debe realizar una auditoría de limpieza para eliminar los "parches" de desarrollo:

### 1. Supabase: Row Level Security (RLS)
- [ ] **Eliminar Políticas DEV**: Ejecutar `DROP POLICY "DEV: Allow all updates (temporary)" ON businesses;`.
- [ ] **Activar Políticas Producción**: Implementar la regla estricta:
  ```sql
  CREATE POLICY "Enable updates for owners" ON businesses
  FOR UPDATE USING (auth.uid() = owner_id);
  ```
- [ ] **Auditoría de Tablas**: Verificar que `products`, `categories` y `profiles` tengan RLS activo y sin excepciones de "Allow all".

### 2. Migración de Datos
- [ ] **Vinculación Real**: Reemplazar los UUIDs ficticios en la columna `owner_id` de la tabla `businesses` por los UUIDs reales de la tabla `auth.users` creados durante el testeo.

### 3. Código Fuente (Frontend)
- [ ] **Eliminar IDs Hardcodeados**: Buscar y eliminar cualquier ID de negocio o usuario quemado en el código para pruebas.
- [ ] **Refactor de Realtime**: Asegurar que las suscripciones a canales de Supabase filtren por el ID del usuario autenticado donde sea posible.

---
*Dacribel Engine: Sistema de Identidad v1.0 — Actualizado 30/04/2026*
