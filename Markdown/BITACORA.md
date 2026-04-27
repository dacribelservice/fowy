# 📓 BITÁCORA DEL PROYECTO: FOWY

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
- **Fase 1 (Infraestructura)**: COMPLETADA. Proyecto inicializado y conectado a Supabase.
- **Fase 2 (Cerebro)**: COMPLETADA. Esquema de perfiles y roles funcionando en la DB.
- **Fase 3 (Autenticación)**: POSPUESTA. El usuario decidió saltarla por ahora.
- **Fase 4 (Cascarón UI)**: COMPLETADA. Dashboard Admin funcional con Sidebar Glassmorphism y pantallas "Coming Soon" para todos los módulos.

---

## 📌 DECISIONES CRÍTICAS
1.  **Ocultar Dev Indicators**: Se deshabilitó el botón "N" de Next.js en `next.config.ts` para mantener la limpieza visual.
2.  **Cero Datos Genéricos**: El usuario solicitó que el Dashboard tenga KPIs y métricas (estructura visual) pero sin datos de ejemplo inventados; él mismo irá poblando la base de datos.
3.  **Personalización Dinámica**: Todos los negocios tendrán la misma estructura de menú, pero cambiarán sus colores y logos dinámicamente según su registro en la base de datos.

---
*Ultima actualización: 27 de Abril de 2026*
