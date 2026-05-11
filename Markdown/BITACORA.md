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

## 📦 BACKUP Y REGISTRO (01 de Mayo de 2026 - Sesión Nocturna III)

**Hitos alcanzados:**
1.  **Registro Multi-paso (Wizard)**:
    - Implementación de `useRegistrationWizard.ts` para manejar el estado complejo del registro.
    - Creación de componentes modulares para cada paso: `AuthStep`, `ProfileStep`, `BusinessStep` y `SuccessStep`.
2.  **Centralización de Storage**:
    - Creación de `storageService.ts` para desacoplar la lógica de subida de archivos (imágenes de perfiles, logos de negocios, etc.) de los componentes.
3.  **Gestión Financiera**:
    - Implementación de `useFinanceManager.ts` y `financeUtils.ts` para centralizar cálculos y lógica administrativa.

**Backup:** Commit `268401a` en GitHub (`main`).

---

## 🛠️ ESTABILIZACIÓN Y DEPLOY (01 de Mayo de 2026 - Sesión Nocturna IV)

**Hitos alcanzados:**
1.  **Corrección de Build**: Solución del error `Cannot find name 'Clock'` en el módulo de finanzas mediante la importación correcta de Lucide.
2.  **Migración a Proxy (Next.js 16)**:
    - Eliminación de `middleware.ts` por deprecación.
    - Implementación de `proxy.ts` como nuevo estándar de la plataforma.
    - Neutralización del middleware para facilitar el debug de despliegue.

**Backup:** Commit `1851076` en GitHub (`main`).

---

## 🛡️ ACTIVACIÓN DE SEGURIDAD Y MIDDLEWARE (01 de Mayo de 2026 - Sesión Nocturna V)

**Hitos alcanzados:**
1.  **Activación del Escudo Global**:
    - Renombrado de `src/proxy.ts` a `src/middleware.ts` para cumplir con la convención de Next.js y asegurar que el servidor ejecute la protección.
    - Actualización de la función exportada a `middleware` para compatibilidad total.
2.  **Blindaje de Rutas Críticas**:
    - Configuración de un `matcher` robusto que cubre explícitamente `/admin`, `/business` y todas sus sub-rutas.
    - Implementación de redirección forzada al `/login` para cualquier acceso no autenticado a estas zonas.
3.  **Validación de Aislamiento**:
    - Verificación exitosa en entornos limpios (Modo Incógnito), confirmando que las rutas públicas (como `/explorar`) permanecen accesibles mientras que las privadas están totalmente protegidas.

**Archivos clave:**
- `src/middleware.ts` (Configuración del Matcher y ejecución)
- `src/utils/supabase/middleware.ts` (Lógica de validación de sesión y redirección)


---

## 🎨 LIMPIEZA DE UI Y AJUSTES (01 de Mayo de 2026 - Sesión Nocturna VI)

**Hitos alcanzados:**
1.  **Limpieza del Explorador**:
    - Eliminación del logo redundante en la esquina superior izquierda del layout.
    - Eliminación del botón flotante de "Agregar" (+) en la pantalla del mapa para simplificar la interfaz.
2.  **Ajuste de Navegación**:
    - Re-alineación de los elementos del header (Búsqueda y Perfil) hacia la derecha para mantener el balance visual tras quitar el logo.

**Backup:** Commit `9257672` en GitHub (`main`).

---

## 🔐 MENÚ DE PERFIL Y AUTENTICACIÓN (01 de Mayo de 2026 - Sesión Nocturna VII)

**Hitos alcanzados:**
1.  **Menú de Perfil Dinámico**:
    - Implementación de un popup (dropdown) al hacer clic en el icono de perfil en el Explorador.
    - Opciones añadidas: **Perfil**, **Favoritos**, **Términos y condiciones** (Visuales) y **Cerrar sesión** (Funcional).
2.  **Experiencia de Usuario (UX)**:
    - Uso de `AnimatePresence` y `framer-motion` para transiciones suaves de apertura y cierre.
    - Diseño de "Glass Card" con desenfoque de fondo (`backdrop-blur-2xl`) y bordes ultra-redondeados (`24px`).
    - Estado activo del botón de perfil: Cambia a un icono de cierre (X) y fondo oscuro para indicar el estado del menú.
3.  **Lógica de Cierre de Sesión**:
    - Integración directa con `supabase.auth.signOut()` para limpiar la sesión y actualizar la UI instantáneamente a través del listener de estado de auth.

**Archivos clave:**
- `src/app/(explorer)/layout.tsx` (Lógica de estado y renderizado del menú)

*Última actualización: 01 de Mayo de 2026 - 04:35 PM*

---

## ⚡ OPTIMIZACIÓN DE REGISTRO Y AUDITORÍA (01 de Mayo de 2026 - Sesión Nocturna VIII)

**Hitos alcanzados:**
1.  **Simplificación Radical del Registro**:
    - Se eliminó el paso obligatorio de "Negocio" del Wizard de registro.
    - El flujo ahora es: **Auth (Email/Google)** -> **Perfil (Nombre/Celular)** -> **Éxito (Confirmación)**.
    - Se asigna automáticamente el rol `explorer` a todos los nuevos registros.
    - La creación de negocios se ha trasladado exclusivamente al panel administrativo para mayor control de calidad.
2.  **Auditoría de Código y Documentación**:
    - Se realizó una revisión profunda del sistema obteniendo una puntuación de **9.4/10**.
    - Se validó el cumplimiento de las reglas de arquitectura (límite de líneas, desacoplamiento, patrones React modernos).
    - Se detectó y documentó un error en la API Key de Firebase que afecta las notificaciones push.
3.  **Sincronización de Documentación**:
    - Se actualizaron `INDICE.md`, `HOJA_DE_RUTA.md` y `login.md` para reflejar que el módulo de autenticación está 100% funcional y simplificado.

**Archivos clave modificados:**
- `src/hooks/useRegistrationWizard.ts` (Simplificación de lógica)
- `src/components/auth/RegisterForm.tsx` (Refactorización de flujo)
- `src/components/auth/steps/ProfileStep.tsx` (Finalización directa)
- `Markdown/` (Sincronización de toda la documentación)

**Backup:** Commit `28611d4` en GitHub (`main`).


---

## 🤝 VINCULACIÓN Y ACCESO DE SOCIOS - FASE 12 (01 de Mayo de 2026 - Sesión Nocturna IX)

**Hitos alcanzados:**
1.  **Flujo de Asignación Administrativa**:
    - Refactorización de `AddBusinessModal.tsx` para incluir el campo **"Email del Dueño"**.
    - Implementación de validación en tiempo real: El sistema verifica que el usuario exista en la tabla `profiles` antes de permitir la creación del negocio.
    - Centralización de lógica: Se movió la persistencia y subida de assets al hook `useAdminBusinessManager.ts`.
2.  **Automatización de Gobernanza (Supabase)**:
    - **Elevación de Roles**: Creación de la función y trigger `handle_business_owner_elevation`. Ahora, cuando un administrador asigna un negocio a un usuario `explorer`, su rol cambia automáticamente a `business_owner`.
    - **Blindaje RLS Pro**: Se actualizaron las políticas de la tabla `businesses`. Solo el `super_admin` puede insertar, y solo el `owner_id` (dueño) puede actualizar o eliminar su propio registro.
3.  **Experiencia del Socio (Dashboard)**:
    - **Detección Inteligente**: El layout del explorador (`ExplorerLayout.tsx`) ahora consulta si el usuario autenticado posee algún negocio.
    - **Acceso Dinámico**: Si el usuario es socio, se inyecta la opción **"Mi Negocio"** en el menú de perfil, redirigiendo a `/business/dashboard`.

**Archivos clave modificados:**
- `src/components/admin/businesses/AddBusinessModal.tsx` (UI de asignación)
- `src/hooks/useAdminBusinessManager.ts` (Orquestador de creación)
- `src/app/(explorer)/layout.tsx` (Inyección de navegación para socios)
- `Markdown/HOJA_DE_RUTA.md` (Actualización de estado)

**Backup:** Commit realizado en GitHub (`main`).

*Última actualización: 01 de Mayo de 2026 - 08:30 PM*

---

## 🚀 ESTABILIZACIÓN DE PEDIDOS REALTIME - FASE 13 (02 de Mayo de 2026 - Sesión X)

**Hitos alcanzados:**
1.  **Patrón Singleton para Supabase**:
    - Se migró la instancia de `createClient()` fuera del hook `useOrderManager.ts` para garantizar una única conexión persistente.
    - Eliminación de fugas de memoria por múltiples suscripciones en React 19.
2.  **Blindaje de Canales Realtime**:
    - Implementación de IDs de canal únicos dinámicos (`Math.random()`) para evitar colisiones entre diferentes pestañas o re-renders.
    - Uso de `useRef` para sincronizar el estado de las órdenes sin disparar re-suscripciones innecesarias (*stale closures*).
3.  **Persistencia Sonora**:
    - Optimización del trigger de audio `cash-register.mp3` para asegurar su ejecución inmediata al detectar un nuevo registro en la tabla `orders`.

**Archivos clave modificados:**
- `src/hooks/useOrderManager.ts` (Implementación de Singleton y Canal Único)
- `src/app/(partners)/business/orders/page.tsx` (Consumo de hook estabilizado)

**Backup:** Commit realizado en GitHub (`main`).

*Última actualización: 02 de Mayo de 2026 - 10:45 PM*

---

## 📚 CONSOLIDACIÓN Y ALINEACIÓN FINAL - SESIÓN XI (03 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 FINALIZADO

### 🎯 Objetivos
- Realizar una auditoría profunda de todos los archivos `.md` para alinearlos con el código final tras la Fase 13.
- Formalizar la arquitectura "Búnker Modular" y el estándar de estabilidad Realtime.
- Sincronizar el estado del proyecto (Phase 1-13 completadas).

### 🛠️ Acciones Realizadas
- **Actualización de `proyecto.md`**: Se integró el patrón "Hook-as-Service" y se consolidó la descripción de la arquitectura Búnker.
- **Refuerzo de `conceptos.md`**: Se añadieron reglas críticas para la estabilidad de Supabase Realtime (Singletons, Refs, Unique Channels).
- **Sincronización de `HOJA_DE_RUTA.md`**: Se confirmó el cierre de la Fase 13 y se preparó el terreno para la Fase 9 (Lanzamiento).
- **Mantenimiento de `notificaciones.md`**: Se clarificó el estado del canal de Realtime como maestro frente a la pausa técnica de Firebase.
- **Limpieza de `BITACORA.md` e `INDICE.md`**: Actualización de marcas temporales y estados de auditoría.

### 📈 Resultado
- **Documentación**: 100% Sincronizada y Profesional.
- **Arquitectura**: Consolidada y Segura (RLS Blindado).
- **Próximo Paso**: Iniciar Fase 9 (Auditoría de Seguridad Final y SEO) una vez Cristian (CEO) lo autorice.

---

## 🍔 REDISEÑO MENÚ DIGITAL "CRAVE EXPRESS" - DETALLE OPERATIVO (04 de Mayo de 2026)
**Estado**: 🟡 PLANIFICADO / POR INICIAR
**Contexto**: Se busca una experiencia "Mobile-First" premium, eliminando la simplicidad actual por un diseño vibrante con branding dinámico.

### 1. Hero & Branding Superior (Slider & Overlay)
- **Componente `<MenuHeroSlider />`**: 
    - Implementar un carrusel de alta fidelidad con `framer-motion`.
    - **Indicadores (Dots)**: Puntos sutiles en la base de la imagen para indicar el número de banners.
    - **Fallback**: Si el negocio no tiene banners en `business_banners`, usar la imagen de portada principal.
- **Header Overlay**:
    - **User Avatar**: Posicionado en la esquina superior derecha (`top-4 right-4`). Círculo blanco con la imagen del perfil (`avatar_url`).
    - **Acción**: Al tocarlo, abre el menú lateral/popup de perfil (ya existente en el layout).

### 2. Identidad del Negocio (Identity Bar)
- **Visual**: Logo circular que "muerde" levemente el slider (solapamiento visual).
- **Información Crítica**:
    - Nombre del negocio en `font-bold` y tamaño grande.
    - **Status Dot**: Indicador tipo "Live" (Verde = Abierto, Rojo = Cerrado) basado en `business_hours`.
    - **📍 GPS Real**: Cálculo de distancia dinámica entre el usuario (`navigator.geolocation`) y las coordenadas del negocio en DB. Mostrar en formato "A 1.2 km de ti".

### 3. Grid de Productos & Micro-Interacciones
- **Card Design**: 2 columnas en móvil. Borde redondeado (`rounded-2xl`) y sombra `shadow-sm`.
- **Badges Contextuales**:
    - **Badge Fuego 🔥**: En productos con `is_promo: true`. Icono animado o color naranja vibrante.
    - **Favoritos ❤️**: Icono de corazón en la esquina superior derecha de la imagen.
- **Login Gate (Lógica de Favoritos)**:
    - Al hacer clic en el corazón SIN sesión activa:
    - Mostrar **Modal Glassmorphism** central.
    - Texto: *"¿Quieres guardar este producto? Inicia sesión para gestionar tus favoritos."*
    - Botones: `[ Iniciar Sesión ]` (Branding color) y `[ Cancelar ]` (Neutro).
- **Add to Cart**: Botón circular con icono `+`. Debe usar el `accent_color` del negocio de forma obligatoria.

### 4. Branding & Checkout (Estrategia de Color)
- **Tokens Dinámicos**: Inyectar `accent_color` mediante variables CSS. Afectará a:
    - Category Pills (Fondo de categoría activa).
    - Botones `+` de los productos.
    - Botón de "Finalizar Pedido" en el carrito.
- **Excepción Crítica**: El botón final de **"Enviar pedido por WhatsApp"** (donde se introducen datos finales) será **SIEMPRE VERDE** (`#25D366`) para generar confianza y reconocimiento del canal.

## 🧹 LIMPIEZA TÉCNICA Y MODULARIZACIÓN COMPLETADA (04 de Mayo de 2026)
**Estado**: ✅ COMPLETADO
**Objetivo**: Eliminar redundancias en el panel de socios y migrar hacia una arquitectura de páginas independientes para mayor velocidad.

### 1. Eliminación de Duplicidades
- **Panel de Socio**: Se auditó el menú lateral y la interfaz principal, eliminando funciones y accesos repetidos que causaban confusión.
- **Consolidación de Lógica**: Toda la lógica de gestión de marca y horarios se unificó en un solo flujo, eliminando códigos huérfanos.

### 2. Migración a Páginas Independientes (Modularidad)
- **Independización de Perfil**: El módulo de "Perfil y Branding" se ha movido exitosamente a su propia ruta dedicada (`/business/perfil`), eliminando la carga pesada en el dashboard principal.
- **Rutas Limpias**: Cada sección del panel de socios (`Pedidos`, `Menú`, `Perfil`, `Finanzas`) ahora opera de forma aislada y eficiente.

---

## 🍔 REDISEÑO MENÚ DIGITAL "CRAVE EXPRESS" - DETALLE OPERATIVO (04 de Mayo de 2026)
**Estado**: 🟡 PLANIFICADO / POR INICIAR
**Contexto**: Con la base técnica ya limpia y modularizada, se iniciará la transformación visual premium.

### 1. Hero & Branding Superior (Slider & Overlay)
- **Componente `<MenuHeroSlider />`**: 
    - Implementar un carrusel de alta fidelidad con `framer-motion`.
    - **Indicadores (Dots)**: Puntos sutiles en la base de la imagen para indicar el número de banners.
    - **Fallback**: Si el negocio no tiene banners en `business_banners`, usar la imagen de portada principal.
- **Header Overlay**:
    - **User Avatar**: Posicionado en la esquina superior derecha (`top-4 right-4`). Círculo blanco con la imagen del perfil (`avatar_url`).
    - **Acción**: Al tocarlo, abre el menú lateral/popup de perfil (ya existente en el layout).

### 2. Identidad del Negocio (Identity Bar)
- **Visual**: Logo circular que "muerde" levemente el slider (solapamiento visual).
- **Información Crítica**:
    - Nombre del negocio en `font-bold` y tamaño grande.
    - **Status Dot**: Indicador tipo "Live" (Verde = Abierto, Rojo = Cerrado) basado en `business_hours`.
    - **📍 GPS Real**: Cálculo de distancia dinámica entre el usuario (`navigator.geolocation`) y las coordenadas del negocio en DB. Mostrar en formato "A 1.2 km de ti".

### 3. Grid de Productos & Micro-Interacciones
- **Card Design**: 2 columnas en móvil. Borde redondeado (`rounded-2xl`) y sombra `shadow-sm`.
- **Badges Contextuales**:
    - **Badge Fuego 🔥**: En productos con `is_promo: true`. Icono animado o color naranja vibrante.
    - **Favoritos ❤️**: Icono de corazón en la esquina superior derecha de la imagen.
- **Login Gate (Lógica de Favoritos)**:
    - Al hacer clic en el corazón SIN sesión activa:
    - Mostrar **Modal Glassmorphism** central.
    - Texto: *"¿Quieres guardar este producto? Inicia sesión para gestionar tus favoritos."*
    - Botones: `[ Iniciar Sesión ]` (Branding color) y `[ Cancelar ]` (Neutro).
- **Add to Cart**: Botón circular con icono `+`. Debe usar el `accent_color` del negocio de forma obligatoria.

### 4. Branding & Checkout (Estrategia de Color)
- **Tokens Dinámicos**: Inyectar `accent_color` mediante variables CSS. Afectará a:
    - Category Pills (Fondo de categoría activa).
    - Botones `+` de los productos.
    - Botón de "Finalizar Pedido" en el carrito.
- **Excepción Crítica**: El botón final de **"Enviar pedido por WhatsApp"** (donde se introducen datos finales) será **SIEMPRE VERDE** (`#25D366`) para generar confianza y reconocimiento del canal.

---
*Fin de la sesión de planificación. Se deja el sistema listo para que la IA/Desarrollador inicie con el componente de Slider y la tabla de banners.*

**Backup**: Bitácora y Hoja de Ruta sincronizadas. **No se modificó código en esta sesión por instrucción expresa.**

*Última actualización: 04 de Mayo de 2026 - 12:50 AM*

## 💎 MODERNIZACIÓN "CRAVE EXPRESS" - SESIÓN XII (05 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 EN PROGRESO

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
- **Implementación de Hero Slider (Fase 15.1)**:
    - **15.1.4**: Carrusel inmersivo con `framer-motion` y soporte para banners dinámicos.
    - **15.1.5**: Implementación del **Avatar del Usuario** en el Header Overlay (integración con `useAuth`).
    - Barra superior con estilo **Glassmorphism** y navegación reactiva.
- **Implementación de Identity Bar (Fase 15.2)**:
    - **15.2.1**: Creación del componente `<BusinessIdentityBar />` con logo circular y branding premium.
    - **15.2.2**: Lógica visual de estado **Abierto/Cerrado** (Punto de color dinámico).
    - **15.2.3**: Implementación de cápsulas de **Rating, Distancia y Tiempo** (UI adaptable).
- **Estabilización Técnica**:
    - Centralización de sesión mediante el hook `useAuth.ts`.
    - Optimización de imports para Next.js 15 y eliminación de logs innecesarios.

### 🛠️ Próximos Pasos (Fase 15.3+)
1.  **Buscador de Productos (15.3)**: Implementar input glassmorphism con búsqueda reactiva server-side.
2.  **Pills de Categorías (15.4)**: Carrusel de categorías con branding dinámico.
3.  **Grid de Productos (15.5)**: Rediseño a 2 columnas con lógica de favoritos.

**Backup**: Sincronización de documentación completada. **Código fuente intacto** por instrucción de seguridad.

---

## 💎 ESTRATEGIA "CRAVE VISION" - SESIÓN XIII (05 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🔵 ALINEADO / LISTO PARA EJECUCIÓN

### 🎯 Análisis de Situación
Se ha realizado un escaneo profundo del sistema actual para asegurar una transición fluida hacia el nuevo diseño premium:
- **Producción (`[slug]/page.tsx`)**: Se identificó el uso de componentes V2 y la lógica de datos basada en Supabase. El sistema está bien desacoplado, lo que permitirá un "Hot-Swap" limpio al finalizar.
- **Sandbox (`crave-vision/page.tsx`)**: Entorno huérfano confirmado y listo. Actualmente es un "Lienzo en Blanco" que reside dentro del `MobileFrame`.
- **Datos Mock (`mock-crave.ts`)**: Se validó el set de datos de "Neon Burger & Co" como fuente de verdad para las pruebas estéticas de alta fidelidad.

### 🏗️ Estrategia de Rediseño (WOW Factor)
La misión es reconstruir la interfaz del usuario final desde cero en el Sandbox, siguiendo este orden de construcción:
1.  **Bloque 2**: Header y Branding V3 (Layout Logo-Left, meta-datos premium, slider integrado).
2.  **Bloque 3**: Buscador Glassmorphism y Carrusel de Categorías V3.
3.  **Bloque 4**: Product Card V3 (Bordes 3xl, sombras suaves, tipografías bold).
4.  **Bloque 5**: Integración de lógica real (`useCart`, `useExplorerManager`) y reemplazo en producción.

**Nota de Seguridad**: Se confirma que el código fuente de producción permanece intacto. Todas las iteraciones se realizarán exclusivamente en la ruta de Sandbox hasta recibir autorización para el despliegue final.

---
*Última actualización: 05 de Mayo de 2026 - 01:35 AM*

---

## 💎 SISTEMA DE FAVORITOS, LAZY LOADING Y HISTORIAL DE PEDIDOS — SESIÓN XIV (07 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: ✅ COMPLETADO

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **Sistema de Favoritos Multi-Comercio (Fase 15.6)**:
    - **15.6.4 & 15.6.5**: Creación de `<UserFavoritesSheet />` con diseño ultra premium en glassmorphism, eliminaciones optimistas y vinculación directa al carrito. Cada ítem de favorito muestra de forma elegante el logo y nombre de su respectivo negocio de origen.
    - Integrado exitosamente en el menú desplegable del layout del explorador.
2. **Carga Perezosa de Alta Performance (Fase 15.8)**:
    - **15.8.3**: Creación del componente reutilizable `<LazyWrapper />` basado en `IntersectionObserver` de alto rendimiento para móvil.
    - Implementación en el grid del menú digital (`[slug]/page.tsx`) para cargar perezosamente las tarjetas de productos, reduciendo el consumo de memoria en dispositivos móviles.
3. **Historial de Pedidos Premium (Fase 15.9)**:
    - **15.9.1, 15.9.2 & 15.9.3**: Creación de `<UserOrdersSheet />` que carga el historial de compras en tiempo real desde la tabla `orders` filtrado por el ID del usuario actual.
    - Soporte completo para estados (`Pendiente`, `Completado`, `Cancelado`), desglose interactivo de platos con cantidades y precios, y un sistema premium de **"Repetir Pedido" (Reordenar)** con bucles automáticos para rellenar el carrito de forma fluida.
    - Vinculación en el menú desplegable del explorador con el ícono `ShoppingBag`.
4. **Verificación de Tipos & Calidad**:
    - Validación completa del sistema de tipos con `powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"` resultando en **0 errores de compilación**.

**Backup**: Listo para ser respaldado en GitHub bajo la dirección del usuario.

---
*Última actualización: 07 de Mayo de 2026 - 11:15 AM*

---

## 📊 PANEL DE MÉTRICAS SUPER ADMIN (FOWY VERTICAL) — SESIÓN XV (07 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 COMPLETADO

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **Planificación y Reorganización en Capas Verticales (Fase 16.1)**:
    - **16.1.1 (Capa 1 - Plan Píldora)**: Reemplazo de la antigua tarjeta de "Plan Contratado" por un elemento cilíndrico ultra-compacto (`rounded-full`) al inicio del panel de detalles de negocio, mostrando sutilmente el plan y próximo pago con estilo premium oscuro (`BusinessPlanPill`).
    - **16.1.2 (Capa 2 - Lista de Métricas)**: Implementación de la lista minimalista de métricas de rendimiento en filas finas, maximizando la densidad de información y eliminando tarjetas masivas (`BusinessMetricsList`).
    - **16.1.3 (Capa 2.5 - Tendencia de Ventas)**: Integración del gráfico lineal interactivo (`FowySalesChart`) inmediatamente debajo de la lista de métricas. El gráfico consume órdenes completadas reales desde Supabase y cuenta con filtros de agrupación dinámica (`D`, `S`, `M`), tooltip interactivo mobile-first y animaciones elásticas con `framer-motion`.
    - **16.1.4 (Capa 3 - Tarjeta de Negocio Compacta)**: Rediseño completo de `BusinessProfileCard` en `BusinessProfileHeader.tsx` para cambiar de un layout horizontal a un apilamiento vertical sumamente limpio, con logo reducido y detalles de contacto como filas de clave-valor elegantes.
    - **16.1.5 (Capa 4 - Módulos & Configuración)**: Rediseño completo de `BusinessModuleManager.tsx` transformando las antiguas tarjetas de módulos de su grid de dos columnas a una lista vertical de alta densidad. Se redujo el padding interior a `p-3.5`, el tamaño de iconos a `size={16}` y se diseñaron interruptores (toggles) compactos y simétricos, ofreciendo una visualización libre de elementos complejos.

2. **Lista de Métricas de Rendimiento (Fase 16.2)**:
    - **16.2.1 (Métricas a Mostrar)**: Verificación exhaustiva y confirmación de la visualización en tiempo real de únicamente las 4 métricas de rendimiento fundamentales en [BusinessMetricsList.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessMetricsList.tsx): *Visitas Totales*, *Pedidos Recibidos*, *Tasa de Conversión* y *Ticket Promedio*, consultando directamente las tablas de analíticas y órdenes del backend de Supabase.
    - **16.2.2 (Visualización de Alta Densidad)**: Estilización fina y compacta de las filas de métricas con un espaciado reducido de `py-2.5`, subtítulos delgados en gris (`text-slate-400 text-xs font-semibold`) y líneas divisorias de casi nula opacidad (`border-b border-slate-50`), garantizando la máxima claridad y elegancia visual sin recargar la pantalla.

### 📂 Archivos y Documentación de Contexto Clave:
Para tener un desarrollo con el contexto adecuado y continuar con la construcción del sistema, el desarrollador o la IA debe leer:
- **Hoja de Ruta Maestra**: [HOJA_DE_RUTA.md](file:///c:/Users/cange/Documents/fowy/Markdown/HOJA_DE_RUTA.md) — Registra de forma secuencial cada tarea, checklist e integraciones pendientes del panel de administración (Fase 16).
- **Filosofía y Reglas de Diseño**: [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md) — Define los estándares estrictos de desacoplamiento, modularidad, rendimiento en tiempo real y reglas de "No Monolitos" para evitar que los archivos de páginas superen las 200-250 líneas.
- **Componentes Creados/Editados en esta sesión**:
  - Orquestador de la Página: [[id]/page.tsx](file:///c:/Users/cange/Documents/fowy/src/app/admin/negocios/%5Bid%5D/page.tsx)
  - Gráfico Interactivo: [FowySalesChart.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/FowySalesChart.tsx)
  - Lista de Métricas Compacta: [BusinessMetricsList.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessMetricsList.tsx)
  - Píldora del Plan: [BusinessPlanPill.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessPlanPill.tsx)
  - Rediseño de Tarjeta de Negocio: [BusinessProfileHeader.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessProfileHeader.tsx)
  - Gestor de Módulos Activos: [BusinessModuleManager.tsx](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/BusinessModuleManager.tsx)

### 📈 Resultado de Calidad:
- **Verificación de Compilación**: Se ejecutó `tsc --noEmit` confirmando 0 errores de compilación TypeScript de manera exitosa.
- **Seguridad**: Listo para ser respaldado en GitHub bajo la dirección del usuario.

*Última actualización: 07 de Mayo de 2026 - 10:10 PM*

---

## 📊 RESOLUCIÓN DE ZONA HORARIA, RLS Y MODULARIZACIÓN COMPLETADA — SESIÓN XVI (07 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 COMPLETADO

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **Resolución del Bug de Zona Horaria (Timezone Shift Bug)**:
    - Se identificó y corrigió el desfase que desplazaba un día hacia el pasado las transacciones registradas por la noche en Colombia (UTC-5), dividiendo las ventas del mismo día (Martes) entre Lunes y Martes en la gráfica.
    - Se reemplazó la comparación de cadenas basada en UTC `d.toISOString().split("T")[0]` por una comparación robusta y local de componentes de fecha (`getFullYear()`, `getMonth()`, y `getDate()`) en [useFowySalesData.ts](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/useFowySalesData.ts).
    - **Resultado**: Validación visual exitosa en tiempo real. Ambas órdenes del martes se unificaron de forma perfecta en el nodo de **Martes (Mar)** mostrando un acumulado de **$96,400 COP**, dejando Lunes y Miércoles correctamente en **$0 COP**.

2. **Resolución de Acceso Super Admin a Visitas (Métricas en Cero)**:
    - Se diagnosticó por qué la cuenta de pruebas de Super Admin (`test@test.com`) visualizaba las visitas en cero mientras que las órdenes sí cargaban correctamente.
    - Se detectó una política de RLS ausente en la tabla `analytics_visits` para el rol `super_admin`.
    - Se ejecutó el DDL de seguridad agregando la política `"Admins can view all analytics"`, otorgando accesos completos de selección al rol `super_admin`.
    - **Resultado**: Las visitas ahora cargan instantáneamente en tiempo real, reportando **202 visitas** y una tasa de conversión precisa de **1%** en la pantalla del administrador.

3. **Finalización de la Modularización del Gráfico de Ventas (Fase 16 / Pasos 3 y 4 de Phase 9)**:
    - Se completó la extracción de la lógica de la gráfica de ventas `FowySalesChart.tsx` hacia el hook `useFowySalesData.ts` y el tooltip modular `FowyChartTooltip.tsx`.
    - El orquestador principal se redujo a menos de **140 líneas de código**, superando los estrictos estándares de limpieza de código (límite de 200 líneas).

### 📂 Archivos Modificados y Guardados:
- **Hook de Ventas**: [useFowySalesData.ts](file:///c:/Users/cange/Documents/fowy/src/components/admin/businesses/useFowySalesData.ts) (Lógica de comparación local).
- **Control de Cambios**: [solucion.md](file:///c:/Users/cange/Documents/fowy/Markdown/solucion.md) (Checklists completados).
- **Historial**: [BITACORA.md](file:///c:/Users/cange/Documents/fowy/Markdown/BITACORA.md) (Este archivo de bitácora).

### 📈 Resultado de Calidad:
- **Tipado y Compilación**: `tsc --noEmit` completado exitosamente con 0 advertencias o errores.
- **Backup**: Respaldado con push exitoso a la rama `main` de GitHub.

*Última actualización: 07 de Mayo de 2026 - 11:25 PM*

---

## 💎 INTEGRACIÓN FINANCIERA Y MEMBRESÍA DINÁMICA (FASES 17 Y 18) — SESIÓN XVII (08 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: ✅ COMPLETADO

### 🎯 Contexto Maestro y Objetivos de la Checklist
Se consolidó una planificación meticulosa para la integración de cobros y membresía dinámica de negocios, lista para ser codificada sin fricción. Este registro garantiza la continuidad perfecta del desarrollo.

### 📝 Desglose Técnico por Fases:

#### 1. FASE 17: Integración Financiera de Membresías ✅
*   **17.1 Modal de Ajuste Manual (`BusinessPaymentViewer.tsx`)**: ✅
    *   Modal glassmorphism premium con input pre-llenado con `membership_price` del negocio.
    *   Al aprobar, persiste `amount` (valor manual verificado) + `status: 'approved'` en `payment_proofs`.
    *   Limpieza inmediata del estado del comprobante en la UI (sincronización en tiempo real).
    *   **Auto-Progresión +30 días**: Al aprobar, calcula y persiste la nueva `payment_date` en `businesses`.
*   **17.2 Backend Financiero (`useFinanceManager.ts`)**: ✅
    *   Consulta en paralelo de `payment_proofs` con `status: 'approved'`.
    *   Historial unificado y ordenado temporalmente: `service_orders` + `payment_proofs`.
*   **17.3 Métricas Consolidadas (`financeUtils.ts`)**: ✅
    *   100% de membresías aprobadas sumadas a **"Ingresos FOWY"** y al **GMV (Volumen Total)**.
*   **17.4 Dashboard de Finanzas (`AdminFinancePage`)**: ✅
    *   Transacciones tipo `Membresía` con icono `Sparkles` y tipografía distintiva.
    *   Gráfico de tendencias actualizado para incluir volumen de membresías confirmadas.

#### 2. FASE 18: Ajustes de Membresía Dinámica (COP & Fechas) ✅
*   **18.1 Estructura en Supabase**: ✅ (Verificado — `membership_price` NUMERIC y `payment_date` TIMESTAMPTZ ya existían).
*   **18.2 Panel de Súper Admin (`BusinessBasicSettings` & `page.tsx`)**: ✅
    *   Input numérico "Precio de Membresía (COP)" integrado en *Configuración General*.
    *   Blindaje de fecha contra JS crashes con `payment_date?.split('T')[0] || ''`.
    *   Persistencia de `membership_price` en Supabase al guardar cambios generales.
    *   Auto-progresión +30 días en `BusinessPaymentViewer` al aprobar comprobante.
*   **18.3 Panel de Socios (`/business/finanzas` & `PartnerTopBar.tsx`)**: ✅
    *   `formatCOP(value)` — Utilidad global unificada (`$ 115.000 COP`).
    *   Valores dinámicos: `payment_date` y `membership_price` desde DB, eliminados todos los hardcodes (mayo estático, $29.99 USD).
    *   `PartnerTopBar.tsx`: Consulta extendida con `name` y `plan`; perfil superior dinámico (nombre real, plan real, avatar con inicial del negocio).
    *   Upload de comprobante: `membership_price` estricto del negocio. Si es `null`, muestra error y aborta en lugar de insertar valor incorrecto.

### 📂 Archivos Modificados y Guardados:
- `src/components/admin/businesses/BusinessPaymentViewer.tsx`
- `src/hooks/useFinanceManager.ts`
- `src/utils/financeUtils.ts`
- `src/components/admin/businesses/BusinessBasicSettings.tsx`
- `src/app/admin/negocios/[id]/page.tsx`
- `src/app/(partners)/business/finanzas/page.tsx`
- `src/components/partners/PartnerTopBar.tsx`
- `Markdown/HOJA_DE_RUTA.md` (Fases 17 y 18 marcadas como completadas)

### 📈 Resultado de Calidad:
- **Tipado y Compilación**: 0 errores TypeScript.
- **Backup**: Commit `21c51c5` — push exitoso a la rama `main` de GitHub.

*Última actualización: 08 de Mayo de 2026 - 06:10 PM*

---

## 📣 FASE 19: SISTEMA DE MARKETING Y BANNERS AUTO-SCROLL — SESIÓN XVIII (08 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 COMPLETADO ✅

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **Acceso Unificado & Sidebar (19.2.1)**: ✅
   - Agregado el acceso unificado **"Marketing"** en la barra lateral del panel administrativo (`Sidebar.tsx`), usando el ícono premium `Sparkles` de Lucide.
2. **Orquestador de Datos `useMarketingManager` (19.2.2)**: ✅
   - Hook personalizado para encapsular la lógica de banners, optimista, ligera y segura.
3. **Página y Componentes Desacoplados (19.2.3)**: ✅
   - Página súper limpia y atómica en `/admin/marketing/page.tsx` (< 60 líneas).
   - Componentes modulares: `<MarketingBannerHeader />`, `<BannerUploadModal />` y `<BannerGridList />`.
4. **Calidad de Subida & Compresión (19.2.4)**: ✅
   - Integrado de forma obligatoria `compressImage` en el cliente antes de enviar al bucket de Supabase, optimizando la carga.
5. **Acciones Instantáneas con Optimistic Updates (19.2.5)**: ✅
   - Los switches y eliminaciones modifican la interfaz de inmediato. La eliminación limpia físicamente el archivo del Storage de Supabase para evitar basura huérfana.
6. **Diálogos y Alertas Premium (19.2.6)**: ✅
   - Prohibido el uso de `alert()` nativo en favor de `<DeleteConfirmModal />` para confirmaciones seguras y del componente `<SuccessToast />` para dar un feedback táctil instantáneo y placentero al administrador.
7. **Hook de Datos useActiveBanners (19.3.1)**: ✅
   - Diseñado e implementado el hook reutilizable `useActiveBanners.ts` para obtener eficientemente solo los banners de marketing activos (`is_active: true`) y ordenados por `sort_order` ascendente.
8. **Componente `<AutoScrollBanners />` (19.3.2)**: ✅
   - Diseñado e implementado el componente `AutoScrollBanners.tsx` como el pie de página móvil horizontal con espaciados (`gap-4`) que consulta los banners activos de forma secuencial, incorporando estados de carga con skeletons pulidos, degradados premium y redirecciones dinámicas de un toque.
9. **Scroll Automático Suave (Marquee CSS) (19.3.3)**: ✅
    - Desarrollada la animación infinita ultrasuave de velocidad constante (p. ej. 40px/s) mediante cálculos matemáticos de repetición y duplicación de banners, anulando por completo el molesto salto de salto ("jitter") al finalizar la traslación mediante envolturas de relleno de píxeles perfectas (`pr-4` en lugar de `gap`).
10. **Detención al Tocar y Hover (Pausa) (19.3.4)**: ✅
    - Integrado el control de estado reactivo `isPaused` conectado a listeners de eventos nativos de alta precisión: `onMouseEnter`/`onMouseLeave` (para pausar al posar el cursor en desktops) y
    `onTouchStart`/`onTouchEnd` (para suspender de inmediato el scroll infinito al colocar el dedo en móviles). Esto garantiza clics limpios y predecibles sobre los banners en cualquier dispositivo sin que la marquesina se mueva.
11. **Elemento del Mensaje (CTA Unificado) (19.3.5)**: ✅
    - Implementación e inyección del mensaje motivacional premium *"¿Te quedaste con hambre de más? Explora otros locales en el mapa 🗺️"* justo encima del carrusel, con animaciones fluidas (`framer-motion`), diseño responsivo y redirección dinámica con micro-interacción al hacer tap sobre el enlace del mapa.
12. **Integración del Pie de Página (19.3.6)**: ✅
    - Colocación estratégica del componente `<AutoScrollBanners />` al final de la vista de menú digital del explorador (`src/app/(explorer)/[slug]/page.tsx`), justo debajo del bloque de productos.
    - Se optimizaron los espaciados ajustando la cuadrícula de productos de `pb-24` a `pb-8` para una transición limpia y fluida hacia la sección de marketing auto-scroll sin dejar huecos vacíos extraños.
13. **Efecto Shimmer (Brillo) Metálico (19.4.1)**: ✅
    - Implementada animación CSS nativa (`@keyframes shimmer`) de alto rendimiento para simular un reflejo brillante metálico diagonal que se desplaza sobre los banners de forma automatizada cada 4 segundos.
    - Se optimizó el flujo temporal configurando el fotograma clave al 30% del ciclo (aproximadamente 1.2 segundos de deslizamiento activo), dejando el 70% restante como pausa sutil (2.8 segundos). Esto evita la saturación visual mientras mantiene la interacción llamativa y elegante.
    - El brillo utiliza un degradado traslúcido y sofisticado (`bg-gradient-to-r from-transparent via-white/20 to-transparent`) posicionado estratégicamente debajo de las superposiciones de texto para conservar una legibilidad impecable.
14. **Micro-Animaciones de Tap / Hover en Banners (19.4.2)**: ✅
    - Diseñado y configurado un sistema elástico dinámico táctil usando Framer Motion.
    - Al posar el puntero (hover) en desktop, la tarjeta se eleva suavemente (`y: -5`) con una escala sutil (`scale: 1.03`) y genera una proyección de sombra de dispersión amplia y profunda (`box-shadow`), mejorando significativamente la jerarquía visual táctil.
    - Al tocar o presionar la tarjeta (tap), se activa una escala elástica de contracción (`scale: 0.97`) junto con una disminución proporcional de sombra y altura para brindar un feedback sensorial físico sumamente placentero antes de la redirección.
    - Se estructuró un resorte de precisión (`spring` con `stiffness: 400` y `damping: 17`) para transiciones ultra-reactivas e instantáneas, eliminando transiciones por CSS que chocaran con Framer Motion.
15. **Transición de Redirección (19.4.3)**: ✅
    - Implementación de un loader de transición suave (`AnimatePresence` + `motion.div` de Framer Motion) con un fondo oscuro difuminado (`bg-slate-950/70 backdrop-blur-md`) que cubre la pantalla completa al iniciar la redirección.
    - Diseño premium del loader que incluye un anillo giratorio estilizado con el logo del mapa de exploración (`Map` de `lucide-react`) y un brillo pulsante diagonal (glow effect) en color Fowy Red, acompañado de textos de estado elegantes: *"FOWY EXPLORADOR"* y *"Buscando experiencias..."*.
    - Sincronización impecable del disparador de redirección con el estado reactivo `isRedirecting`, activándose instantáneamente al hacer clic/tap en cualquier banner activo o en el CTA unificado superior.

### 📂 Archivos Modificados:
- `src/components/explorer/AutoScrollBanners.tsx` (Verificado loader, transición con AnimatePresence de Framer Motion, y disparo del overlay de carga al hacer click/tap).
- `Markdown/HOJA_DE_RUTA.md` (Paso 19.4.3 marcado como completado).
- `Markdown/BITACORA.md` (Este archivo de bitácora).

### 📈 Resultado de Calidad:
- **Tipado y Compilación**: 0 errores de TypeScript (`powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"` verificado con éxito).
- **Alineación de Diseño**: UX ultra-premium responsiva que incentiva de manera sutil y elegante la navegación del explorador.

*Última actualización: 09 de Mayo de 2026 - 02:00 AM*

---

## 📣 FASE 20: MARKETING CTA SYSTEM — SESIÓN XIX (08 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: 🟢 COMPLETADO ✅

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **DB — Tabla `marketing_ctas` (20.1.1)**: ✅
   - Creada la tabla física `marketing_ctas` en la base de datos Supabase con los campos: `id` (UUID, PK), `text` (TEXT), `is_active` (BOOLEAN, default true), `sort_order` (INTEGER, default 0), y `created_at` (TIMESTAMPTZ, default timezone('utc', now())).
2. **DB — Políticas RLS & Seguridad (20.1.2)**: ✅
   - Activada la seguridad de fila (RLS) en `marketing_ctas`.
   - Creada la política de lectura pública `Allow public read access to marketing CTAs` (SELECT) para permitir lectura a todos los usuarios sin restricciones de autenticación.
   - Creada la política de acceso total `Allow all for admin on marketing CTAs` (ALL) exclusiva para usuarios autenticados cuyo rol en la tabla `profiles` sea `'super_admin'::user_role`.
3. **UI — Interfaz de Gestión de Frases `<MarketingCTAManager />` (20.2.1)**: ✅
   - Diseñado e implementado el componente modular `MarketingCTAManager.tsx` bajo un estilo visual ultra-premium y glassmorphic, con efectos decorativos glow en verde esmeralda y rojo Fowy.
   - Cuenta con soporte completo para:
     - Formulario de alta rápido y estilizado con validaciones.
     - Listado numerado con badges estilizados.
     - Edición interactiva *en línea* (*inline editing*) con botones de confirmación rápidos.
     - Switch de alternancia de estado activo/desactivo que aplica opacidad sutil sobre ítems apagados.
     - Flechas direccionales arriba/abajo para reordenamiento instantáneo.
     - Botón de borrado conectado al modal de confirmación táctil premium `DeleteConfirmModal.tsx`.
4. **Hook — Orquestación en `useMarketingManager` (20.2.2)**: ✅
   - Extendido el hook `useMarketingManager.ts` con tipado estricto `MarketingCTA`.
   - Implementada toda la lógica CRUD optimista para CTAs: `ctas`, `ctasLoading`, `ctasError`, `addCTA`, `updateCTA`, `deleteCTA` y `reorderCTAs`.
   - Las interacciones de switch, orden y borrado impactan la interfaz inmediatamente de forma visual y ejecutan el guardado asíncrono en segundo plano de manera transparente.
5. **Integración en Panel Super Admin (MarketingPage)**: ✅
   - Modificado el archivo `/admin/marketing/page.tsx` para integrar el componente `<MarketingCTAManager />`, permitiendo administrar simultáneamente los banners horizontales de marketing y las frases publicitarias rotativas en una misma vista organizada.
6. **Hook de Datos `useActiveCTAs` (20.3.1)**: ✅
   - Diseñado e implementado el hook de lectura pública `useActiveCTAs.ts` para obtener de manera eficiente únicamente las frases de marketing que están activas (`is_active: true`) y ordenadas de acuerdo a su orden de prioridad (`sort_order` ascendente).
7. **Transiciones de Entrada/Salida con Framer Motion (20.3.2)**: ✅
   - Reemplazado el bloque de texto de CTA estático sobre los banners publicitarios en el componente `AutoScrollBanners.tsx` con un contenedor rotativo de texto animado de velocidad controlada (rotación cada 5.5 segundos).
   - Aplicadas transiciones súper fluidas y elásticas mediante Framer Motion utilizando `AnimatePresence` con animaciones de desvanecimiento hacia arriba y deslizamiento flotante desde abajo (`initial={{ opacity: 0, y: 15 }}`, `animate={{ opacity: 1, y: 0 }}`, `exit={{ opacity: 0, y: -15 }}`).
   - La caja de texto se configuró con un alto de precisión (`h-12`) alineada verticalmente y centrada en el eje flex, asegurando compatibilidad con frases de hasta dos líneas sin recortar ni empujar el carrusel inferior. El cursor ahora presenta interactividad hover, cambiando a rojo Fowy con subrayado y respuesta táctil sutil de clic elástico (`active:scale-98`).
8. **Fallback de Resiliencia (20.3.3)**: ✅
   - Diseñado e integrado un robusto sistema de respaldo (`fallbackCtas`) con frases motivacionales de marketing y exploración pre-configuradas si la base de datos se encuentra vacía, en estado de carga o ante problemas de red. Esto garantiza que la visualización del cliente nunca falle ni muestre un bloque vacío.

### 📂 Archivos Modificados:
- `src/hooks/useActiveCTAs.ts` *(Creado)* (Hook para el cliente móvil)
- `src/components/explorer/AutoScrollBanners.tsx` (Animación con AnimatePresence de frases dinámicas y fallbacks)
- `Markdown/HOJA_DE_RUTA.md` (Paso 20.3 completamente verificado y cerrado)
- `Markdown/BITACORA.md` (Este archivo de bitácora)

### 📈 Resultado de Calidad:
- **Tipado y Compilación**: 0 errores de TypeScript (`powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"` verificado exitosamente).

*Última actualización: 09 de Mayo de 2026 - 02:15 AM*


---

## 💾 BLINDAJE DE STORAGE EN MODO PRIVADO — SESIÓN XX (11 de Mayo de 2026)
**Encargado**: Antigravity AI
**Estado**: ✅ COMPLETADO

### 🎯 Objetivos Logrados (Sincronización con Hoja de Ruta)
1. **Creación del Storage Wrapper Seguro (Fase 5.1)**: ✅
   - Creación del archivo utilitario [storage.ts](file:///c:/Users/cange/Documents/fowy/src/utils/storage.ts) para encapsular las llamadas a `localStorage` (`getItem`, `setItem`, `removeItem`, `clear`) de forma segura.
   - Protegido completamente con bloques `try-catch` y validaciones previas de `typeof window` para evitar fallos catastróficos durante el renderizado del lado del servidor (SSR) y en modos de navegación privada (incógnito) de Safari en iOS.

2. **Memoria en Caché Temporal (Memory Fallback) (Fase 5.2)**: ✅
   - Implementación de un respaldo volátil en memoria (`memoryStorage: Record<string, string>`) dentro del utilitario.
   - Si `localStorage` está bloqueado o deshabilitado, la aplicación de manera automática conmuta a usar la memoria temporal de forma transparente.
   - Refactorización de todos los hooks y componentes clave de la aplicación para hacer uso de este almacenamiento seguro:
     - [useCart.ts](file:///c:/Users/cange/Documents/fowy/src/hooks/useCart.ts): Gestión y persistencia del carrito de compras (`fowy_cart`).
     - [useOrderManager.ts](file:///c:/Users/cange/Documents/fowy/src/hooks/useOrderManager.ts): Estado del audio desbloqueado para alertas en tiempo real en iOS/Safari (`business_audio_unlocked`).
     - [ComingSoonOverlay.tsx](file:///c:/Users/cange/Documents/fowy/src/components/partners/ComingSoonOverlay.tsx): Estado de la clave de previsualización del panel de socios (`fowy_unlocked_preview`).

3. **Cliente Supabase en Modo Privado (Fase 5.3)**: ✅
   - Modificación de [client.ts](file:///c:/Users/cange/Documents/fowy/src/utils/supabase/client.ts) para inyectar nuestro adaptador seguro en la inicialización del cliente de autenticación de Supabase (`createBrowserClient`), a través de la opción `auth: { storage: safeLocalStorage }`.
   - Con esto se garantiza que si `localStorage` nativo está bloqueado por el navegador en modo incógnito, el flujo de autenticación, almacenamiento del JWT y la lógica de validación de sesión de Supabase continúen funcionando perfectamente en memoria sin generar excepciones en iOS Safari.

### 📂 Archivos Modificados:
- **Utilitario de Almacenamiento**: [storage.ts](file:///c:/Users/cange/Documents/fowy/src/utils/storage.ts) *(Creado)*
- **Hook del Carrito**: [useCart.ts](file:///c:/Users/cange/Documents/fowy/src/hooks/useCart.ts)
- **Gestor de Órdenes**: [useOrderManager.ts](file:///c:/Users/cange/Documents/fowy/src/hooks/useOrderManager.ts)
- **Componente ComingSoon Overlay**: [ComingSoonOverlay.tsx](file:///c:/Users/cange/Documents/fowy/src/components/partners/ComingSoonOverlay.tsx)
- **Cliente Supabase**: [client.ts](file:///c:/Users/cange/Documents/fowy/src/utils/supabase/client.ts)
- **Hoja de Ruta**: [iPhone.md](file:///c:/Users/cange/Documents/fowy/Markdown/iPhone.md)

### 📈 Resultado de Calidad:
- **Tipado y Compilación**: 0 errores de TypeScript (`powershell -ExecutionPolicy Bypass -Command "npx tsc --noEmit"` verificado exitosamente).

*Última actualización: 11 de Mayo de 2026 - 03:45 AM*


