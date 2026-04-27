# 🎨 ESPECIFICACIONES DE DISEÑO PREMIUM (FOWY)

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
*   **Cards:** Bordes redondeados de `20px`, sombra muy suave (`shadow-sm`) y borde de `1px` casi invisible.
*   **Sidebar:** Efecto Glassmorphism lateral, iconos estilo "Outline" (lineales) con colores de degradado al estar activos.
*   **Buttons:** Efecto de elevación al hover, transición suave de 0.3s.
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
*Este diseño es el estándar de calidad para toda la interfaz de Fowy.*
