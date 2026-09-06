# 🎨 LENGUAJE VISUAL: ETHEREAL HIGH-TECH (LIGHT MODE)

> ⚠️ **REGLA DE ORO**: Solo Cristian (CEO de FOWY) tiene autoridad para ordenar copias de seguridad (Backups) en GitHub.

Basado en el concepto visual "SaaS High-Tech" con enfoque en Glassmorfismo y degradados vibrantes.

---

## 🌈 1. PALETA DE COLORES (Design Tokens)

### A. Degradados Principales
*   **Primary (Energy):** `from-[#FF5A5F] to-[#FF9A3D]` (Rojo a Naranja)
*   **Secondary (Flow):** `from-[#7B61FF] to-[#4D8BFF]` (Morado a Azul)

### B. Fondos y Superficies
*   **Main Background:** Degradado suave de `[#FBFAFF]` a `[#EEF5FF]`.
*   **Glass Card:** Blanco traslúcido con desenfoque de fondo (`backdrop-blur-md`) y borde sutil.
*   **Text Primary:** Gris oscuro profundo (evitar negro puro para mantener el look premium).

---

## ✍️ 2. TIPOGRAFÍA
*   **Fuente:** `Inter` o `Poppins` (Google Fonts).
*   **Títulos (H1, H2):** Bold (700) / Semibold (600).
*   **Cuerpo:** Regular (400).
*   **Números/KPIs:** Bold (700) para máximo impacto visual.

---

## 🧊 3. COMPONENTES Y EFECTOS
*   **Cards:** Bordes redondeados de `20px` (clase `rounded-fowy`), sombra muy suave (`shadow-sm`) y borde de `1px` casi invisible.
*   **Sidebar:** Efecto Glassmorphism lateral, iconos estilo "Outline" (lineales) con colores de degradado al estar activos.
*   **Buttons (Diseño Premium Táctil):**
    *   **Centrado Matemático Perfecto:** Uso de íconos vectoriales pulidos (ej. Lucide) o texto en contenedores con `flex items-center justify-center` para una alineación milimétrica.
    *   **Acabado Táctil Minimalista (Sin 3D):**
        *   *Biselado Sutil:* Borde superior suave y transparente para delimitación limpia.
        *   *Gradiente Plano y Elegante:* Uso del color corporativo en gradientes lineales sobrios.
        *   *Glow (Sombra de Luz Exterior):* Sombra proyectada difuminada del color del botón como halo de luz sutil.
        *   *Micro-interacción:* Efecto de escala al presionar (`active:scale-95`) para respuesta táctil inmediata.
*   **Inputs:** Fondos traslúcidos con bordes redondeados.

---

## ✨ 4. MICRO-ANIMACIONES (Framer Motion)
1.  **Entrada:** Los elementos deben aparecer con un leve "Slide Up" y "Fade In".
2.  **Hover Cards:** Elevación suave (`scale: 1.02`) y un ligero resplandor (`glow`).
3.  **Gráficos:** Animación de trazado fluido para las líneas de tendencia.

---

## 📱 5. RESPONSIVIDAD
*   **Desktop:** Sidebar expandido siempre visible.
*   **Mobile:** Sidebar colapsable con animación lateral. Grid de cards de 1 columna.

---

## 🎯 6. REGLA MAESTRA DE ICONOGRAFÍA: 100% MINIMALISTA (CERO ICONOS O EMOJIS 3D)
* **Prohibición Total de Iconos y Emojis 3D:** Queda **terminantemente prohibido el uso de iconos, stickers o emojis en 3D** (burbujas tridimensionales infladas, renders volumétricos, efectos arcillosos o estilo Fluent 3D).
* **Estándar Vectorial Flat & Outline:** Todos los iconos de la plataforma deben ser **100% planos (*flat*), minimalistas y vectoriales**, con trazo estilizado de línea fina (*stroke* de 1.5px a 2px), utilizando exclusivamente la librería **`lucide-react`**.
* **Emojis Planos y Sobrios:** En mensajes de notificación, WhatsApp o badges informativos, los emojis deben ser estándar, planos y de apoyo sobrio; jamás elementos tridimensionales ni decorativos pesados.

---
*Este diseño es el estándar de calidad para toda la interfaz de Fowy.*
