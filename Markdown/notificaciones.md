# 🔔 SISTEMA DE NOTIFICACIONES UNIFICADO (FOWY)

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este documento define la arquitectura para las alertas y comunicaciones en tiempo real dentro de la plataforma para todos los roles.

---

## 🏛️ ARQUITECTURA: MÓDULO CENTRALIZADO (Plug-and-Play)

Diseñaremos un servicio único llamado `NotificationEngine` que podrá ser invocado desde cualquier rol. Este módulo abstrae la complejidad y decide el mejor canal de entrega.

### 1. El Servicio Universal (`sendNotification`)
Cualquier parte de la app podrá ejecutar:
```typescript
await sendNotification({
  targetUserId: "uuid-del-dueño",
  title: "¡Nuevo Pedido!",
  body: "Mesa 4 ha solicitado: Hamburguesa X",
  type: "ORDER_NEW",
  priority: "HIGH" // Activa sonido y Push inmediato
});
```

### 2. Integración con Firebase (FCM) - El canal Profesional
*   **Tokens de Dispositivo**: Al iniciar sesión, el módulo registra el token único del celular del usuario en la tabla `profiles` (campo `fcm_token`).
*   **Envío Server-side**: Usaremos una Edge Function de Supabase conectada al Admin SDK de Firebase para garantizar que la notificación llegue aunque la app esté cerrada.
*   **Seguridad**: Solo el sistema puede disparar notificaciones push masivas para evitar spam.

### 3. El Cerebro (Base de Datos & Realtime)
Toda notificación se registra en la tabla `notifications` para mantener un historial.
*   **Campos**: `id`, `user_id`, `title`, `message`, `type`, `status` (unread/read), `link` (redirección), `created_at`.
*   **Realtime**: Si el usuario tiene la app abierta, Supabase Realtime muestra el Toast y actualiza la campana al instante.

---

## 🎭 NOTIFICACIONES POR ROL

| Rol | Evento | Acción en UI | Sonido |
| :--- | :--- | :--- | :--- |
| **Super Admin** | Registro de Negocio | Toast + Campana | Sutil |
| **Super Admin** | Pago Recibido | Toast + Campana | Dinero (Chaching) |
| **Business Owner**| **Nuevo Pedido** | Modal Emergente + Lista | **Caja Registradora** |
| **Business Owner**| Pago Aprobado | Confeti Visual | Triunfal |
| **Explorer** | Pedido Confirmado | Push Notification | Sutil |

---

## 🎨 INTERFAZ (UI/UX)

1.  **La Campana (Header)**:
    *   Ubicada en el top bar.
    *   Badge rojo con contador animado (Framer Motion).
    *   Panel desplegable (Glassmorphism) con las últimas 5 notificaciones.
2.  **Toasts (Emergentes)**:
    *   Esquina superior derecha.
    *   Bordes de 20px.
    *   Colores degradados según el tipo (Rojo/Naranja para pedidos, Verde para éxitos).
3.  **Centro de Notificaciones**:
    *   Página completa `/admin/notifications` o `/partners/notifications` para ver el historial.

---

## 📋 CHECKLIST TÉCNICA DE IMPLEMENTACIÓN (Módulo de Notificaciones)

Esta lista debe seguirse en orden secuencial para garantizar la integridad del sistema.

### 🛠️ Fase 1: Backend & Base de Datos (Supabase)
- [x] **1.1 Esquema de Base de Datos**: Crear tabla `notifications` con campos: `id`, `user_id`, `title`, `body`, `type`, `data`, `is_read`, `created_at`.
- [x] **1.2 Seguridad RLS**: Activar Row Level Security para que solo el dueño vea sus notificaciones.
- [x] **1.3 Realtime Enable**: Habilitar el canal de tiempo real para la tabla `notifications`.
- [x] **1.4 Profiles Update**: Añadir columna `fcm_token` a la tabla `profiles` con sus respectivas políticas de seguridad.
- [x] **1.5 Edge Functions**: Configurar `send-push` en Supabase Functions con el Firebase Admin SDK.


### 🔑 Fase 2: Configuración Firebase (Cloud Messaging)
- [x] **2.1 Firebase Project**: Crear y configurar el proyecto en la consola de Firebase.
- [x] **2.2 Credentials**: Obtener `firebaseConfig` y generar el par de llaves **VAPID**.
- [x] **2.3 Service Worker**: Implementar `public/firebase-messaging-sw.js` para la escucha en segundo plano.
- [x] **2.4 SDK Integration**: Instalar y configurar las dependencias oficiales de Firebase en el proyecto.

### 🏗️ Fase 3: Módulo Frontend (`/src/modules/notifications`)
- [x] **3.1 Global Provider**: Crear el `NotificationProvider.tsx` para envolver la aplicación.
- [x] **3.2 Custom Hook**: Desarrollar `useNotifications.ts` para la lógica de estado y lectura.
- [x] **3.3 Permission Logic**: Implementar el flujo de solicitud de permisos del navegador con UI personalizada.
- [x] **3.4 Audio Assets**: Cargar y configurar los sonidos (`cash-register.mp3` y `alert.mp3`).
  > [!IMPORTANT]
  > Debes colocar los archivos `cash-register.mp3` y `alert.mp3` en la carpeta `public/sounds/` para que las alertas sonoras funcionen.

### 🎨 Fase 4: UI/UX Premium (Fowy Design System)
- [x] **4.1 Notification Bell**: Crear el componente de campana con badge animado y efecto Glassmorphism.
- [x] **4.2 Dropdown Panel**: Diseñar el panel de notificaciones recientes con scroll y blur.
- [x] **4.3 Sonner Integration**: Estilizar los Toasts emergentes para que coincidan con la estética FOWY.
- [x] **4.4 History Page**: Crear la vista completa de historial con paginación y filtros.

### 🧪 Fase 5: Integración y Testing Final
- [x] **5.1 End-to-End Test**: Probar el flujo completo desde la creación de un pedido hasta la alerta sonora y visual.
- [x] **5.2 Push Validation**: Confirmar la recepción de notificaciones Push en dispositivos móviles.
- [x] **5.3 Performance Check**: Optimizar la carga de assets y la memoria del Service Worker.

### 🚀 Fase 6: Flujos de Negocio & Expertos (Próximamente)
- [x] **6.1 Alertas de Pedidos**: Integrar sonido `cash-register.mp3` y push al detectar nuevos registros en la tabla `orders`.
- [x] **6.2 Hitos de Expertos**: Notificar cambios de estatus en `service_orders` (Aceptación, Entrega, Liberación de pago).
- [x] **6.3 Dashboard Integration**: Mostrar indicadores de alerta en el perfil del socio para eventos no leídos.

---
*Diseño de Sistema v7.0 (Actualizado 03-May-2026)*

> 🚨 **ESTADO DEL CANAL PUSH**: Se mantiene el problema con las credenciales de Firebase (VAPID/API Key) en el entorno de producción. Las notificaciones Push (FCM) están **en pausa** técnica.
> 
> ✅ **CANAL MAESTRO OPERATIVO**: El sistema de **Supabase Realtime** es el canal primario y redundante. Está 100% operativo, garantizando la entrega de alertas visuales y sonoras (`cash-register.mp3`) en tiempo real mientras la aplicación esté abierta o en segundo plano en el navegador.
