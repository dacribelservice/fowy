# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.

---

## 🚀 VISIÓN GENERAL
**FOWY** es una plataforma modular diseñada bajo el concepto de **"Centro Comercial Digital"**. 
- **Objetivo**: Permitir que múltiples negocios convivan en una sola infraestructura compartiendo una interfaz premium, pero manteniendo su identidad visual (colores, logos) de forma dinámica.
- **Roles**: `super_admin`, `professional`, `seller`, `business_owner`, `explorer`.

---

## 🛠️ STACK TECNOLÓGICO (Corte 27-Abr-2026)
- **Frontend**: Next.js 15 (App Router) con TypeScript.
- **Estilos**: Tailwind CSS v4 (Configuración vía CSS-first en `globals.css`).
- **Backend/DB**: Supabase (PostgreSQL).
- **Animaciones**: Framer Motion.
- **Iconos**: Lucide React.

---

## 🏛️ ARQUITECTURA "CENTRO COMERCIAL"
La app está organizada en grupos de rutas para aislamiento total:
- `/admin`: Dashboard para Super Administradores y Profesionales.
- `/partners`: Gestión para Vendedores y Dueños de Negocio.
- `/core`: Interfaz para el usuario final (Explorador).
- `(extensions)`: Módulos específicos (Inventario, Menú, etc.) que actúan como "locales" dentro del mall.

---

## 🧠 ESTADO DE LA BASE DE DATOS (Supabase)
Se ha implementado el "Cerebro" del sistema:
1.  **Enum `user_role`**: Define los niveles de acceso.
2.  **Tabla `profiles`**: Extendida desde `auth.users`.
3.  **Trigger PL/pgSQL**: Función automática que crea un perfil en la tabla `profiles` cada vez que un usuario se registra en la autenticación de Supabase.
4.  **Multi-tenancy**: Se decidió que todos los negocios compartirán las mismas tablas, diferenciándose por un ID de negocio, para facilitar el mantenimiento global.

---

## 🎨 SISTEMA DE DISEÑO (Ethereal Premium)
- **Estética**: Minimalista, limpia, sin uso de negro puro.
- **Bordes**: `border-radius: 20px` (clase `rounded-fowy`).
- **Efecto**: Glassmorphism (clase `glass-morphism` con `backdrop-blur`).
- **Colores**: 
    - Degradado 1: Rojo (#FF4D4D) a Naranja (#FFA500).
    - Degradado 2: Morado (#8A2BE2) a Azul (#007BFF).
- **Sombras**: `shadow-glass` y `shadow-premium`.

---

## ✅ PROGRESO ACTUAL
- **Fase 1 (Infraestructura)**: COMPLETADA.
- **Fase 2 (Cerebro)**: COMPLETADA.
- **Fase 3 (Autenticación)**: POSPUESTA.
- **Fase 4 (Cascarón UI)**: COMPLETADA.
- **Fase 5 (Módulo Negocios)**: COMPLETADA.
- **Fase 6 (Notificaciones y Feedback)**: COMPLETADA (Sistema de Toasts Premium).

---

## 🚀 HITOS RECIENTES (27 de Abril de 2026)
1.  **Dashboard de Negocios**: Implementación de interfaz modular con KPIs dinámicos (Total, Activos, Conversión, Vencimientos).
2.  **Modales Premium**: 
    - `AddCategoryModal`: Creación de categorías con carga de imágenes.
    - `AddBusinessModal`: Registro de nuevos establecimientos con generación de slug automática.
    - `DeleteConfirmModal`: Interfaz de confirmación de borrado con estética cohesiva.
3.  **Sistema de Feedback "FOWY Toast"**: Reemplazo de los `alert` nativos por notificaciones flotantes elegantes y automáticas.
4.  **Seguridad y Almacenamiento**: Configuración de políticas RLS en Supabase Storage para los buckets `categories` y `logos`, permitiendo la carga pública de recursos.
5.  **GitHub Backup**: Sincronización total del estado estable del proyecto en el repositorio oficial.

6. **Estabilización de Integración con Supabase**: Se corrigió el mapeo de columnas (reemplazando `active` por `status` y `whatsapp` por `phone`) en los componentes de administración para alinear el frontend con el esquema real.
7. **Resolución de Constraints**: Se arregló un error de restricción en la tabla `businesses` asegurando que los valores del plan siempre se envíen en minúsculas (`standard`, `pro`, `premium`).
8. **Refinamiento UI/UX**: Se sustituyeron los mensajes `alert()` nativos en la edición de negocios por el componente `SuccessToast`, logrando una experiencia fluida y coherente con el sistema Ethereal.

---

## 📌 DECISIONES CRÍTICAS
1.  **Ocultar Dev Indicators**: Deshabilitado el botón "N" de Next.js.
2.  **Cero Datos Genéricos**: Estructuras visuales listas para datos reales.
3.  **Personalización Dinámica**: Identidad visual variable sobre menú único.
4.  **Activación Modular**: El sistema permitirá habilitar/deshabilitar módulos (inventario, ventas, etc.) individualmente por cada negocio.
5.  **Feedback No Intrusivo**: Se prioriza el uso de Toasts sobre diálogos bloqueantes para una experiencia de usuario fluida.

---
*Ultima actualización: 27 de Abril de 2026 - 10:45 AM*
