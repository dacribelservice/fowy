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
    *   **Efecto de Profundidad 3D:**
        *   *Biselado Sutil (Inner Shadow/Border):* Borde superior casi blanco y transparente, junto con sombra interior inferior para dar relieve físico y evitar el aspecto plano.
        *   *Gradiente de Volumen:* Uso del color principal (o `accent_color`) en un gradiente muy sutil (ligeramente más claro arriba, más oscuro abajo) para aportar volumen.
    *   **Glow (Sombra de Luz Exterior):** Uso de sombra proyectada suave y difuminada del mismo color del botón, creando un elegante "halo de luz", en lugar de la clásica sombra gris o negra.
    *   **Micro-interacción (El "Click" Perfecto):** Efecto de escala al presionar (ej. `active:scale-90` en Tailwind) para simular que el botón se hunde físicamente por unos milisegundos, otorgando satisfacción táctil.
*   **Inputs:** Fondos traslúcidos con bordes redondeados.

---

## ✨ 4. MICRO-ANIMACIONES (Framer Motion)
1.  **Entrada:** Los elementos deben aparecer con un leve "Slide Up" y "Fade In".
2.  **Hover Cards:** Elevación suave (`scale: 1.02`) and un ligero resplandor (`glow`).
3.  **Gráficos:** Animación de trazado fluido para las líneas de tendencia.

---

## 📱 5. RESPONSIVIDAD
*   **Desktop:** Sidebar expandido siempre visible.
*   **Mobile:** Sidebar colapsable con animación lateral. Grid de cards de 1 columna.

---
*Este diseño es el estándar de calidad para toda la interfaz de Fowy.*
