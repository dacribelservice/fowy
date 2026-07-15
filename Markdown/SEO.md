# 🚀 PLAN DE IMPLEMENTACIÓN SEO Y GEO — FOWY

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

Este documento detalla la arquitectura desacoplada y segura para posicionar a FOWY en **Google** y motores de búsqueda generativos de Inteligencia Artificial (**LLM SEO / GEO** como Perplexity, ChatGPT Search, Gemini y Claude).

---

## 🎨 Principios Arquitectónicos (Alineado con `conceptos.md`)
1. **Riesgo Cero (Failsafe)**: El SEO corre en una capa aislada (`layout.tsx`). Si la base de datos falla o se elimina el archivo, la web interactiva del cliente sigue funcionando sin enterarse.
2. **Carga Estática para Crawlers**: Los bots de IA y motores de búsqueda no ejecutan JavaScript. Serviremos los metadatos y el contenido de negocios pre-renderizados en el HTML inicial.
3. **JSON-LD (Schema.org)**: Inyectaremos microdatos estructurados para que las IAs entiendan perfectamente los menús, precios y horarios.
4. **Analítica Transparente (¡Trabajo Adelantado!)**: FOWY ya registra de forma pasiva el `referrer` (procedencia de visitas) de Google e IAs en producción. Solo resta habilitar su visualización en el panel.

---

## 📋 Checklist de Implementación

### 📁 Fase 1: Infraestructura de Indexación Global
- [x] **1.1** Crear el archivo `src/app/robots.ts` para configurar directivas amigables de rastreo. (¡COMPLETADO! ✔️)
  - *Detalle*: Permitir explícitamente a los bots tradicionales y crawlers de IA (`GPTBot`, `Claude-Web`, `PerplexityBot`, `Google-Extended`).
- [x] **1.2** Crear el sitemap dinámico en `src/app/sitemap.ts` integrado con la base de datos de Supabase. (¡COMPLETADO! ✔️)
  - *Detalle*: Consultar todos los `slugs` de negocios activos utilizando paginación eficiente de Supabase (`range(0, 1000)`) para evitar sobrecargar la memoria.

### 📁 Fase 2: Capa Desacoplada de SEO y Metadatos (Layout)
- [x] **2.1** Crear el archivo envoltorio en `src/app/(explorer)/[slug]/layout.tsx`. (¡COMPLETADO! ✔️)
  - *Detalle*: Mantener la página del menú `page.tsx` intacta (100% interactiva, sin modificar su lógica cliente).
- [x] **2.2** Desarrollar la función `generateMetadata` de Next.js en el Layout. (¡COMPLETADO! ✔️)
  - *Detalle*: Buscar en Supabase el perfil básico (`name`, `description`, `banner_url`) y construir las etiquetas dinámicas de Open Graph (para WhatsApp, Twitter) y Twitter Cards.
- [x] **2.3** Configurar el bloque protector `try-catch` para controlar errores en la consulta de base de datos. (¡COMPLETADO! ✔️)
  - *Detalle*: Si la consulta falla o el internet se cae, el sistema debe atrapar el error en silencio y devolver metadatos por defecto para que la web nunca muestre pantalla de error 500.
- [x] **2.4** Inyectar el script estructurado JSON-LD con formato de tipo `@type: Restaurant` o `LocalBusiness`. (¡COMPLETADO! ✔️)
  - *Detalle*: El JSON-LD debe contener el nombre, imagen, teléfono, rango de precios y la lista de platos (`Menu`) para indexación directa de las IAs.

### 📁 Fase 3: Pruebas, Validación y Estabilidad
- [x] **3.1** Realizar una prueba local de la URL `/sitemap.xml` en el entorno de desarrollo para validar que todos los slugs se autogeneren de forma correcta. (¡COMPLETADO! ✔️)
- [x] **3.2** Validar el JSON-LD inyectado utilizando la herramienta oficial [Google Schema Markup Testing Tool](https://search.google.com/test/rich-results) o la consola del desarrollador. (¡COMPLETADO! ✔️)
- [x] **3.3** Simular una desconexión intencionada de la base de datos (pasándole datos incorrectos o forzando un error) para validar que la página del menú (`page.tsx`) siga cargando perfectamente con los metadatos genéricos de respaldo. (¡COMPLETADO! ✔️)

### 📊 Fase 4: Visualización de Descubrimiento en el Panel (`/business/page.tsx`)
- [x] **4.1** **Captura en producción (YA ADELANTADO Y FUNCIONANDO ✔️)**: 
  - *Detalle*: El hook `useBusinessAnalytics.ts` ya registra automáticamente el campo `referrer: document.referrer || "direct"` en la tabla `analytics_visits`.
- [x] **4.2** Procesamiento de Referidos en el Dashboard: (¡COMPLETADO! ✔️)
  - *Detalle*: En `src/app/(partners)/business/page.tsx`, agrupar las visitas obtenidas de `analytics_visits` para separar los contadores de tráfico:
    * **Google (SEO)**: Si el string del `referrer` contiene `google.com` o `bing.com`.
    * **Buscadores de IA (GEO)**: Si contiene `perplexity.ai`, `chatgpt.com`, `claude.ai` o `gemini`.
    * **Social / Directo**: Si contiene `whatsapp.com`, `t.co`, `instagram.com` o es igual a `direct`.
- [x] **4.3** **Integración de Tráfico en la Tarjeta "Últimas Visitas"**: (¡COMPLETADO! ✔️)
  - *Detalle*: Integrar el resumen y origen de SEO directamente dentro del componente actual de "Últimas Visitas" de manera minimalista y estilizada (alineado con `diseño.md`):
    * **1. Cabecera con "Resumen Mínimo" (Top de la tarjeta)**: Justo debajo del título "Últimas Visitas", colocar una fila horizontal de píldoras (badges) minimalistas y traslúcidas que muestran la recopilación de datos en tiempo real:
      - `🔍 Google • 65%` (Fondo gris/azul sutil, texto nítido).
      - `✨ IA Search • 10%` (Fondo violeta traslúcido, texto morado con un micro-glow del token *Secondary Flow*).
      - `📱 Directo • 25%` (Fondo naranja/rojo traslúcido del token *Primary Energy*).
    * **2. Reemplazo del texto "Menu View" por "Origen de Tráfico"**: En cada fila de visita, en lugar del texto repetitivo "Menu View", colocar un badge ultra-estilizado alineado a la derecha que indique de dónde llegó:
      - *Si llegó de Google*: Un badge limpio que dice `🔍 Google`.
      - *Si llegó de una Inteligencia Artificial*: Un badge que dice `✨ Perplexity` o `✨ ChatGPT` usando el degradado `from-[#7B61FF] to-[#4D8BFF]` en su versión más suave y traslúcida.
      - *Si llegó directo o WhatsApp*: Un badge que dice `🔗 Directo` o `💬 WhatsApp`.

---

## 🛠️ Código de Referencia Failsafe (Ejemplos Técnicos)

### Ejemplo de `src/app/robots.ts` (Riesgo: 1/10)
```typescript
import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/explorar', '/[slug]'],
      disallow: ['/admin/', '/business/', '/login', '/registro'],
    },
    sitemap: `${process.env.NEXT_PUBLIC_APP_URL || 'https://fowy.pro'}/sitemap.xml`,
  }
}
```

### Ejemplo del Escudo Layout en `src/app/(explorer)/[slug]/layout.tsx` (Riesgo: 2/10)
```typescript
import type { Metadata } from 'next'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

interface Props {
  children: React.ReactNode
  params: { slug: string }
}

// 2.2 y 2.3: Metadatos dinámicos a prueba de fallas (Failsafe)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const defaultMeta = {
    title: 'FOWY - Tu Ciudad en un Click',
    description: 'Explora y conecta con los mejores negocios de tu ciudad.',
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
        }
      }
    )

    const { data: business } = await supabase
      .from('businesses')
      .select('name, description, banner_url, logo_url')
      .eq('slug', params.slug)
      .single()

    if (!business) return defaultMeta

    return {
      title: `${business.name} | Menú en FOWY`,
      description: business.description || `Explora el menú digital de ${business.name} en FOWY.`,
      openGraph: {
        title: `${business.name} | Menú Digital`,
        description: business.description || `Pide directamente desde el menú de ${business.name}.`,
        images: [{ url: business.banner_url || business.logo_url || '/assets/icono png.png' }],
      }
    }
  } catch (error) {
    console.error("Error silencioso cargando metadatos de SEO:", error)
    return defaultMeta
  }
}

export default function BusinessLayout({ children }: Props) {
  return <>{children}</>
}
```

### Ejemplo del Widget de Analíticas de SEO en el Dashboard (`src/app/(partners)/business/page.tsx`)
```typescript
// En la consulta de analíticas (fetchData):
const { data: allVisits } = await supabase
  .from('analytics_visits')
  .select('referrer')
  .eq('business_id', business.id);

let googleSEO = 0;
let aiGEO = 0;
let directSocial = 0;

allVisits?.forEach(v => {
  const ref = (v.referrer || '').toLowerCase();
  if (ref.includes('google') || ref.includes('bing') || ref.includes('yahoo')) {
    googleSEO++;
  } else if (ref.includes('perplexity') || ref.includes('chatgpt') || ref.includes('claude') || ref.includes('gemini')) {
    aiGEO++;
  } else {
    directSocial++;
  }
});
```

---
*Última actualización: 09 de Mayo de 2026 — Diseñado con desacoplamiento extremo de componentes.*
