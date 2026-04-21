# 🎨 DOCUMENTO DEL SISTEMA DE DISEÑO: EL ESPECTRO RADIANTE (THE RADIANT SPECTRUM)

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

## 1. Visión General y Norte Creativo
**Norte Creativo: "La Llamarada Solar" (The Solar Flare)**
Este sistema de diseño está construido para evocar la sensación de entornos de datos de alta energía y alta visibilidad. Nos alejamos de los "vacíos" atmosféricos para entrar en un mundo de claridad vibrante, calidez y energía cinética. El objetivo es hacer que un directorio de negocios global se sienta como un mapa vivo y palpitante de actividad, pasando de la "observación" a la "acción".

La interfaz utiliza **Energía de Alto Contraste**. Al movernos hacia una base de modo claro con acentos audaces y cálidos, creamos una sensación de urgencia y precisión. Los elementos se definen por sus firmas de color vibrantes y geometrías suaves en forma de píldora, lo que hace que la interfaz se sienta amigable pero increíblemente poderosa.

---

## 2. Colores y Energía de Superficie
Nuestra paleta está arraigada en un lienzo limpio y brillante, puntuado por pulsos intensos de color tipo mapa de calor.

### Roles de Color
- **Primario (`#ff0000`):** "La Llamarada" (The Flare). Se utiliza para CTAs críticos, alertas activas y momentos principales de la marca.
- **Secundario (`#f5ad28`):** "El Ámbar". Se utiliza para advertencias, interacciones secundarias y resaltados cálidos.
- **Terciario (`#35a3b0`):** "El Refrigerante". Un verde azulado oceánico utilizado para equilibrar el calor de la paleta primaria, ideal para visualización de datos e insignias.
- **Superficie:** Un lienzo nítido y claro diseñado para la máxima legibilidad y energía.

### La Regla de la "Píldora"
En este sistema, los bordes afilados se descartan en favor de la **Fluidez Máxima**. Todos los elementos interactivos y contenedores deben utilizar un nivel de `redondeado` de 3 (forma de píldora). Esto suaviza el impacto de alto contraste de la paleta roja y naranja, haciendo que los colores de alta energía se sientan accesibles.

### Jerarquía de Superficies y Espaciado
Utilizamos **Densidad Equilibrada** (Espaciado: 2). Los diseños deben sentirse organizados y eficientes, ni apretados ni excesivamente dispersos.
- **Nivel Base:** `superficie` (Claro/Blanco).
- **Nivel de Contenedor:** Superficies sutilmente sombreadas que proporcionan contraste para los elementos interactivos audaces en rojo y naranja.
- **Elevación:** Uso de sombras suaves y sutiles en lugar de desenfoques atmosféricos para mantener la claridad "Solar".

---

## 3. Tipografía
Utilizamos **Inter** por su precisión clínica, actuando como una fuerza de conexión contra la vibrante paleta de colores.

- **Display (grande/mediano/pequeño):** Titulares de alto impacto. Se prefieren pesos en negrita (Bold) para destacar frente al Rojo Primario.
- **Encabezados (Headline):** Configurados en `sobre-superficie` (on-surface) para una legibilidad máxima.
- **Cuerpo (Body):** Estandarizado para un escaneo de alta velocidad.
- **Etiquetas (Label):** A menudo emparejadas con el Verde Azulado Terciario o el Naranja Secundario para categorizar información sin abrumar a la Llamarada Primaria.

---

## 4. Elevación e Interacción

### El Principio Kinético
El movimiento y la profundidad se logran a través de la **Saturación del Color**.
1. **Fondo:** Neutro limpio y claro.
2. **Estados Interactivos:** Los elementos transicionan del Naranja Secundario al Rojo Primario para indicar una mayor importancia o compromiso.
3. **Contenedores en forma de Píldora:** Uso de radios grandes para crear un "burbuja" de enfoque para el contenido crítico.

### Sombras Táctiles
- **Color de Sombra:** Neutro/Gris con baja opacidad.
- **Sensación:** Nítida y definida, enfatizando la naturaleza de "superficie" del modo claro.

---

## 5. Componentes

### Píldoras de Acción (El Componente Insignia)
- **Radio:** `3` (Píldora completa).
- **Fondo:** Rojo Primario o Naranja Secundario.
- **Texto:** Alto contraste `sobre-primario` (blanco/claro) para máxima accesibilidad.

### Tarjetas de Datos (Data Cards)
- **Radio:** Redondeado máximo (Nivel 3).
- **Borde:** Contornos neutros sutiles o sombras suaves para definir límites sobre el fondo claro.
- **Acentos:** Uso del Verde Azulado Terciario para acentos decorativos o estados de éxito para dar un descanso visual de los colores primarios cálidos.

### Campos de Entrada (Input Fields)
- **Base:** Fondo claro con un borde neutro claro.
- **Enfoque (Focus):** El borde transiciona a Rojo Primario con un trazo de 2px, asegurando que el enfoque del usuario se capture instantáneamente.

---

## 6. Qué hacer y qué no hacer (Do’s and Don’ts)

### Qué hacer:
- **Sí** usar formas de píldora completa para todos los botones y etiquetas.
- **Sí** aprovechar el Verde Azulado Terciario para proporcionar un equilibrio "fresco" a un diseño muy "cálido".
- **Sí** mantener el espaciado "Normal" (Nivel 2) para que la densidad de información sea profesional y eficiente.

### Qué no hacer:
- **No** usar esquinas afiladas; rompe la estética de "Energía Fluida".
- **No** usar texto de bajo contraste sobre fondos Rojos Primarios; asegurar el cumplimiento de accesibilidad WCAG.
- **No** usar espaciado excesivo (Nivel 3); el objetivo es un entorno ajustado, energético y productivo.
- **No** usar glassmorphism de modo oscuro; este es un sistema de alta claridad y modo claro.
