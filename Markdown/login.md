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

### Fase 1: Configuración de Backend (Supabase)
- [ ] **1.1 Proveedores**: Habilitar Google Auth en el Dashboard de Supabase con Client ID y Secret.
- [ ] **1.2 Redirección**: Configurar `URL Configuration` en Supabase para manejar el flujo de `/auth/callback`.
- [ ] **1.3 Email Templates**: Personalizar los correos de "Confirmación de Registro" y "Recuperación de Contraseña" con el branding de FOWY.

### Fase 2: Desarrollo de UI (Pantallas)
#### 2.1 Pantalla de Inicio de Sesión (Login)
- [ ] **2.1.1 Card Master**: Contenedor Glassmorphism centrado.
- [ ] **2.1.2 Social Login**: Botón de "Continuar con Google".
- [ ] **2.1.3 Email Form**: Inputs premium para Email y Contraseña.
- [ ] **2.1.4 Auxiliares**: Enlace "¿Olvidaste tu contraseña?" y "¿Aún no tienes cuenta?".

#### 2.2 Pantalla de Registro (Sign Up)
- [ ] **2.2.1 Social Register**: Botón de registro con Google.
- [ ] **2.2.2 Email Register**: Formulario de creación de cuenta (Email, Contraseña, Confirmar Contraseña).
- [ ] **2.2.3 Link**: Enlace "¿Ya tienes cuenta? Inicia sesión".

#### 2.3 Pantalla de Recuperación
- [ ] **2.3.1 Recovery Form**: Input de email para envío de enlace mágico.
- [ ] **2.3.2 Feedback**: Modal de éxito tras envío del correo con estética FOWY.

### Fase 3: Lógica y Conexión (Logic)
- [ ] **3.1 Auth Callback**: Crear `app/auth/callback/route.ts` para intercambiar el código por sesión.
- [ ] **3.2 Social Logic**: Implementar `signInWithOAuth` para Google.
- [ ] **3.3 Email Logic**: Implementar `signInWithPassword`, `signUp` y `resetPasswordForEmail`.
- [ ] **3.4 Middleware Protection**: Asegurar que los usuarios autenticados sean redirigidos a su dashboard correspondiente según su rol.

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
*Dacribel Engine: Sistema de Identidad v1.0*
