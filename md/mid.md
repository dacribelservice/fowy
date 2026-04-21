# 🛡️ Historial de Seguridad y Middleware: Ethereal Vault

Este archivo documenta los fallos críticos encontrados en la gestión de sesiones, middleware y protección de rutas administrativas, así como sus soluciones definitivas para evitar regresiones en futuras sesiones de desarrollo.

---

## 📜 BITÁCORA DE ERRORES Y MIDDLEWARE (HISTORIAL)

> [!IMPORTANT]
> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

## 🛑 Fallo I: El Middleware "Bloqueante" (Marzo 2026)
**Problema:** Al intentar usar `@supabase/ssr` con consultas directas a la base de datos dentro de `middleware.ts`, la aplicación entraba en una carga infinita o "hang". Next.js tiene límites estrictos de tiempo de ejecución en el middleware.
**Causa:** Consultas asíncronas lentas o conflictos con la propagación de cookies en cada petición.
**Solución actual:** El middleware se ha simplificado para solo verificar la **presencia** de una sesión. La validación de **roles** se trasladó del Middleware al `AdminLayout` (lado del cliente/componente), permitiendo que la web cargue instantáneamente.

---

## 🔄 Fallo II: Bucle Infinito en AuthContext
**Problema:** Al iniciar sesión, el botón se quedaba en "cargando" para siempre.
**Causa:** El `useEffect` de `AuthContext.tsx` dependía de `user.id`. Al actualizar el perfil, se disparaba de nuevo el efecto, que volvía a validar la sesión, que volvía a cargar el perfil... creando un bucle infinito de re-renderizados.
**Solución actual:** El array de dependencias del `useEffect` de autenticación ahora está vacío (`[]`). Se usa un `Ref` (`lastFetchedUserId`) para detectar si el usuario realmente cambió antes de intentar una nueva descarga de perfil.

---

## 🔒 Fallo III: El Bloqueo del Perfil (Race Condition)
**Problema:** El sistema se quedaba en "Cargando Perfil..." indefinidamente al refrescar la página.
**Causa:** La lógica de bloqueo (`fetchingUserId.current`) no se liberaba correctamente si una petición fallaba o se cancelaba, impidiendo que el sistema lo intentara de nuevo. Además, el cierre de la función (closure) mantenía una referencia vieja del objeto `user`.
**Solución actual:**
1. Se añadió un **Safety Timeout** de 10 segundos en `AuthContext` que fuerza el fin de la carga si algo se cuelga.
2. Se liberan los bloqueos de forma incondicional en bloques `finally`.

---

## 🏁 Fallo VI: Estado de Carrera (State Race) en Sesiones
**Problema:** Los usuarios eran expulsados de la sesión inmediatamente después de refrescar la página, incluso si tenían permisos válidos.
**Causa:** El `AdminLayout` realizaba la validación de rol antes de que `AuthContext` terminara de hidratar el perfil del usuario desde la base de datos. El estado inicial de `role` era `undefined` o `user`, lo que disparaba la lógica de redirección antes de que el rol `admin` fuera cargado.
**Solución actual:** Se inicializó el `role` como `null` en `AuthContext` para representar un estado indeterminado. Se implementó un periodo de gracia de 1500ms en `AdminLayout` para permitir que el estado de carga se resuelva antes de ejecutar la redirección de seguridad.

---

## 🏗️ Fallo IV: Duplicidad de Layout y UI "Ruptura"
**Problema:** Al implementar un layout administrativo centralizado, aparecían dos sidebars y dos headers.
**Causa:** Las páginas individuales (`inventory/page.tsx` y `finances/page.tsx`) aún tenían sus componentes de navegación internos.
**Solución actual:** Refactorización total para convertir las páginas de administración en "contenidos puros", delegando la estructura (Sidebar, Header, BottomNav) únicamente a `app/admin/layout.tsx`.

---

## 📐 Fallo V: El Header Invisible/Desplazado
**Problema:** Los iconos de perfil y notificaciones desaparecían o se cortaban en la derecha.
**Causa:** Uso de `fixed top-0 w-full` con `lg:ml-64`. Esto sumaba el ancho total de la pantalla + el ancho del sidebar, empujando los iconos fuera del monitor.
**Solución actual:** El `AdminHeader` ahora usa `right-0` y un ancho calculado de `w-[calc(100%-16rem)]` en pantallas grandes, garantizando alineación perfecta a los bordes.

---

## 🛡️ Estrategia de Seguridad Resiliente (Sesión XVII - Marzo 2026)
Para eliminar los bloqueos totales ("hangs") que sufría la web al intentar validar roles desde el servidor, se ha implementado una seguridad de **Múltiples Capas (Multilayer)**:

1.  **Middleware Adaptativo (`middleware.ts`):** 
    - Actual status: **Pasivo (Bridge)**. No realiza consultas a la base de datos para validar roles. Su única misión es refrescar la sesión del usuario para evitar cierres inesperados durante la navegación. 
    - **Beneficio:** Carga instantánea de la aplicación sin latencias de red.
2.  **Protección de Interfaz (`AdminLayout.tsx`):**
    - Actúa como la barrera visual y de redirección.
    - Implementa un **Periodo de Gracia (1.5s)**: Evita expulsar al usuario mientras el estado de autenticación se "hidrata". Si después de este tiempo el rol no es `admin`, lo redirige a la Home.
3.  **Parche Maestro (Master Admin Override):**
    - Se habilitó un acceso forzado para el correo `dacribel.service@gmail.com` tanto en el Layout como en la página de Login.
    - **Causa:** Desconexión entre los perfiles de Supabase (Google vs Email/Pass) que reportan el rol como `user` incorrectamente.
4.  **Seguridad Inmutable (Supabase RLS):** 
    - Es la capa definitiva en el backend. Las **Row Level Security (RLS)** de Supabase garantizan que, aunque alguien altere el código front-end para entrar al panel, **no se devuelvan datos** de inventario ni finanzas a menos que el token real del usuario tenga ese permiso.

---

*Nota técnica: El parche maestro de correo es temporal y debe ser removido cuando se saneen los perfiles duplicados en Supabase.*

## 🏁 Fallo VII: Resistencia al Pase Maestro (Marzo 2026)
**Problema:** El override codificado en `AdminLayout` no se activa a pesar de usar `dacribel.service@gmail.com`.
**Investigación:** Se ha implementado un depurador visual en la pantalla de carga que muestra el contenido de `userEmail` y el booleano `isMasterAdmin`. 
**Estado:** Resuelto (Análisis de bucle completado).

---

## 🔒 Fallo VIII: El Bucle de "Guerra de Decisiones" (Abril 2026)
**Problema:** Ciclo infinito de redirecciones entre el Login y el Admin (Parpadeo constante).
**Causa:** "Inconsistencia de Autoridad" entre capas:
1. **Login (`LoginPage.tsx`):** Detecta correctamente el correo maestro y envía al admin inmediatamente.
2. **Admin (`AdminLayout.tsx`):** NO posee la lista de correos maestros. Solo verifica `role === 'admin'`.
3. **Falla de Sincronía:** Al no ver el rol "admin" cargado instantáneamente desde la DB, el Admin expulsa al usuario al inicio (`/`). 
4. **Resonancia:** El Login vuelve a intentar enviar al usuario al Admin tras el expulsión. Esto genera el **Bucle 307** infinito.
**Conclusión:** Se requiere sincronización de la lista de correos maestros en la arquitectura de Layouts.

---

---

## 🔒 Fallo IX: Bucle Infinito en RLS (Recursión) - Abril 2026
**Problema:** Error 500 constante al intentar cargar el inventario administrativo.
**Causa:** Al blindar la tabla `profiles` se creó una **recursión infinita**: la política de RLS para ver un perfil pedía verificar si el usuario era admin consultando la misma tabla `profiles`.
**Solución actual:** Se implementó una función oficial `public.is_admin()` con permisos **`SECURITY DEFINER`**. Esta función corre fuera del control de RLS, consultando la tabla de perfiles de forma aislada y devolviendo un booleano rápido al motor de políticas, eliminando el bucle infinito de inmediato. 🛡️🚀✨🏰

---

*Dacribel: Bóveda Digital Inexpugnable en construcción.*

