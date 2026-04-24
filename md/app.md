# 🚀 FOWY: EL ECOSISTEMA MODULAR (BLUEPRINT MAESTRO)

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

> **Estado**: Planificación Analítica Inicial  
> **Versión**: 1.0.0  
> **Arquitectura**: Modular Monolith con Aislamiento de Dominio (Shopping Mall Strategy)

---

## 🏗️ 1. VISIÓN ARQUITECTÓNICA: "EL CENTRO COMERCIAL"

Para cumplir con la analogía del **Centro Comercial**, la estructura de FOWY no será una aplicación monolítica tradicional donde todo está entrelazado. Implementaremos un **Monolito Modular de Alta Cohesión y Bajo Acoplamiento**.

### ¿Por qué esta es la mejor decisión para FOWY?
1.  **Aislamiento de Fallos**: Cada "Local" (Módulo de Rol) tendrá sus propios `error.tsx` y `loading.tsx` a nivel de Layout. Si el dashboard de un Business falla, el Admin y el Usuario siguen operativos.
2.  **Escalabilidad Horizontal**: Podemos añadir nuevos roles o funciones (ej. un módulo de "Logística") simplemente enchufando una nueva carpeta en el sandbox de extensiones.
3.  **Mantenimiento**: Un cambio en la lógica de "Sellers" no afecta a "Professionals".

---

## 📁 2. ESTRUCTURA DE CARPETAS OPTIMIZADA (ADN FOWY)

Utilizaremos **Next.js App Router** con grupos de rutas balanceados para separar las experiencias de usuario de forma física y lógica.

```text
root/
├── app/
│   ├── (platform)/           # EL DOMINIO PRINCIPAL (El "Mall")
│   │   ├── admin/            # Dashboards de Control Total
│   │   ├── profecionales/    # Gestión de expertos
│   │   ├── vendedores/       # Gestión de captación y ventas
│   │   ├── negocios/         # Operatividad de locales individuales
│   │   └── user/             # Experiencia del cliente final
│   ├── (marketing)/          # Landing pages y SEO
│   ├── (menu)/               # EL PRODUCTO: Menú digital dinámico (Aislado)
│   ├── api/                  # El motor (Webhooks, Cron jobs)
│   └── layout.tsx            # El "Cimiento" (Providers globales)
├── modules/                  # LÓGICA ENCHUFABLE (Los "Locales")
│   ├── billing/              # Facturación independiente
│   ├── inventory/            # Gestión de stock
│   └── analytics/            # Motor de KPIs para todos los dashboards
├── lib/
│   ├── core/                 # Utilidades inmutables
│   └── integrations/         # Supabase, Pagos, Notificaciones
├── database/                 # Migraciones y Esquemas SQL
└── docs/                     # BIBLIOTECA DE INTELIGENCIA (Markdown)
    ├── app.md                # Este archivo
    ├── seguridad.md          # Protocolos de búnker
    ├── base-de-datos.md      # Esquema relacional
    └── arquitectura.md       # Lógica de módulos enchufables
```

---

## 🛡️ 3. SEGURIDAD "FRÍAMENTE CALCULADA" (REGLA DE ORO)

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

La seguridad no es un añadido, es la base. Utilizaremos el modelo **Zero-Trust**.

| Componente | Decisión Técnica | Razón de ser |
| :--- | :--- | :--- |
| **Arquitectura Urbana** | Multi-City GeoJSON | Permite instanciar nuevas ciudades (Bogotá, Medellín) sin cambios de código, solo añadiendo metadatos geográficos. |
| **Autenticación** | Supabase Auth + MFA | Delegamos la seguridad de identidad a un estándar industrial. |
| **Autorización** | RLS (Row Level Security) | La base de datos es la que decide quién ve qué. Si el frontend es hackeado, los datos siguen seguros. |
| **Validación** | Zod Schemas en Edge | Validamos los tipos de datos antes de que lleguen a la lógica del servidor. |
| **Aislamiento** | Middleware RBAC | Un usuario no puede ni siquiera "ver" la ruta `/admin` si no tiene el claim correspondiente en su JWT. |

---

## 📊 4. DASHBOARDS Y KPIs (MOTOR DE DATOS)

Cada rol tendrá un **Centro de Mando** específico. No compartiremos componentes de dashboard entre roles para evitar que un cambio estético en uno rompa otro.

1.  **Admin**: Vista macro (Volumen total, retención de negocios, salud del sistema).
2.  **Vendedores**: KPIs de conversión, negocios activos por zona, comisiones.
3.  **Negocios**: Ventas diarias, stock crítico, popularidad del Menú Digital.
4.  **Usuarios**: Historial de consumo, puntos de fidelidad.

---

## 🌍 4.5 ESTRATEGIA DE GEOLOCALIZACIÓN Y COBERTURA

Para garantizar una expansión global fluida, implementaremos una lógica de **Detección Activa de Ciudad**:

1.  **Auto-Detección**: Al cargar la aplicación (Explorador), se solicita permiso de ubicación vía navegador (Geolocation API).
2.  **Validación de Rango (Buffer)**: El sistema calcula si la ubicación del usuario se encuentra dentro de un radio de **X km** (configurable, sugerido 4km) de algún negocio activo.
3.  **Lógica de Fallback (Cobertura Cero)**:
    *   Si no hay negocios en el rango, la app bloquea la vista de mapa local y muestra el **Estado de Expansión**.
    *   Se invita al usuario a explorar zonas con cobertura (Cali como HUB inicial) o a registrar su zona para futura apertura.
4.  **Tracking de Demanda**: Cada intento de acceso desde una zona sin cobertura se registra (de forma anónima) para que el Admin Maestro identifique "Zonas Calientes" de demanda insatisfecha.

---

## 🚀 5. PLAN DE EJECUCIÓN (PRÓXIMOS PASOS)

1.  **Consolidar `base-de-datos.md`**: Definir las tablas de `profiles`, `businesses`, `orders` y sus relaciones multi-inquilino (Multitenancy).
2.  **Definir `seguridad.md`**: Escribir las políticas RLS exactas y el flujo de los JWT Claims.
3.  **Prototipado de UI**: Crear el sistema de diseño "The Radiant Spectrum" (Solar Flare) en CSS Vanilla/Tailwind.

---
**"FOWY: Construido para durar, diseñado para escalar."**
