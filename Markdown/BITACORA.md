# 📓 BITÁCORA DEL PROYECTO: FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Esta bitácora es el registro maestro del proyecto. Sirve para que cualquier sesión futura (o cualquier desarrollador/IA) comprenda exactamente el estado, la arquitectura y las decisiones tomadas.
- **Guía de Arquitectura**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md)

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
- **Fase 6 (Notificaciones y Feedback)**: COMPLETADA.
- **Fase 7 (Refactorización de Datos)**: COMPLETADA.
- **Fase 8 (Optimización y Escalabilidad)**: COMPLETADA (Paginación, Imágenes y Blindaje).
- **Fase 9 (Limpieza y Seguridad)**: COMPLETADA (RLS definitivo y Desacoplamiento de Lógica).

---

## 🏗️ REFACTORIZACIÓN Y BLINDAJE (01 de Mayo de 2026 - Sesión Nocturna II)

**Hitos alcanzados:**
1.  **Desacoplamiento del Explorador**:
    - Extracción de sub-componentes pesados a `BusinessListSheet.tsx` y `BusinessDetailSheet.tsx`, reduciendo el archivo principal `explorar/page.tsx` de 405 a menos de 200 líneas.
    - Implementación de `geo.ts` para centralizar la lógica de coordenadas y formateo de distancia.
2.  **Estandarización de ADN Shared**:
    - Centralización de componentes administrativos en `src/components/admin/shared/`: `StatCard` y `SuccessToast` ahora son piezas globales reutilizables.
    - Actualización visual del Explorador: Sustitución de `<img>` nativos por `PremiumImage` para garantizar esqueletos de carga y placeholders de alta calidad.
3.  **Blindaje de Producción (RLS Definitivo)**:
    - Aplicación de políticas de seguridad en Supabase para la tabla `businesses`.
    - **UPDATE/DELETE**: Restringido estrictamente mediante `auth.uid() = owner_id`.
    - **INSERT**: Solo permitido para usuarios autenticados.
    - **SELECT**: Mantenido público para garantizar la funcionalidad del mapa.
4.  **Optimización de Lógica (Custom Hooks)**:
    - Creación de `useBusinessStats.ts`: Se extrajo toda la lógica de cálculo de KPIs (negocios activos, vencimientos, crecimiento) de la página administrativa.
    - Mejora de rendimiento: La página de administración ahora solo se encarga de renderizar, delegando el procesamiento de datos al hook especializado.

**Archivos clave modificados:**
- `src/app/admin/negocios/page.tsx` (Refactorización visual)
- `src/hooks/useBusinessStats.ts` (Nueva lógica desacoplada)
- `src/components/explorer/` (Nuevas Sheets separadas)
- `src/utils/geo.ts` (Utilidades geográficas)

**Backup:** Commit `21eeba0` en GitHub (`main`).

---

*Última actualización: 01 de Mayo de 2026 - 01:15 AM*
