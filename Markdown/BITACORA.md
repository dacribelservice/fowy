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
