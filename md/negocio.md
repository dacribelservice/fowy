# 🍱 HOJA DE RUTA: MENÚ DIGITAL (EXPERIENCIA DEL CLIENTE)

> **REGLA DE ORO:** Solo Cristian, el CEO de Fowy, va a poder dar la orden para hacer copias de seguridad en GitHub y dar la orden para ejecutar líneas de código.

Este documento define el flujo estándar y los componentes visuales del Menú Digital de Fowy. Todos los negocios compartirán esta estructura, variando únicamente su identidad visual (Logo y Color de Marca).

---

## 🗺️ FLUJO DEL USUARIO (CHECKLIST)

### 1. Acceso al Menú Digital
- [x] **Entrada al Establecimiento**: Al hacer clic en el negocio desde el explorador, se abre su menú dentro del marco del "iPhone Virtual" (en PC).

### 2. Interfaz del Menú (Establecimiento)
- [x] **Banner Slider**: Implementar slider de imágenes con navegación fluida.
- [x] **Indicador "Gota de Agua"**: Animación líquida para los puntos del slider al cambiar de imagen.
- [x] **Categorías de Texto**: Lista de categorías minimalista (solo nombres, sin iconos).
- [x] **Grilla de Productos**: Layout de 2 columnas para el catálogo.
- [x] **Tarjetas de Producto**: 
    - [x] Imagen del producto.
    - [x] Nombre y descripción.
    - [x] Precio Pleno vs. Precio Promo (Diferenciación visual).
    - [x] Botón "Agregar al Carrito".

### 3. Sistema de Carrito (Interacción)
- [x] **FAB de Carrito**: Botón flotante abajo a la derecha.
- [x] **Feedback Visual**: Efecto titilante (pulse) y contador de productos en tiempo real.
- [x] **Bottom Sheet de Carrito**: 
    - [x] Listado de productos agregados.
    - [x] Control de cantidades (+ / -).
    - [x] Cálculo automático de Precio Unitario y Total.
    - [x] Opción de eliminar producto (Icono de papelera).
    - [x] Botón "Finalizar Pedido".

### 4. Finalización y Despacho (Checkout)
- [x] **Pantalla de Resumen**: Detalle final de los productos seleccionados.
- [x] **Formulario de Datos**: 
    - [x] Nombre del cliente.
    - [x] Teléfono de contacto.
    - [x] Dirección de entrega.
    - [x] **Captura de Ubicación**: Registro de coordenadas GPS para precisión en el domicilio.
    - [x] **Notas del Pedido**: Campo crítico para detalles adicionales (ej. "Sin cebolla").
- [x] **WhatsApp Order Engine**: Botón verde de "Enviar pedido por WhatsApp" con mensaje estructurado.

---

## 💡 RECOMENDACIONES DE EXPERIENCIA (UX PREMIUM)

1. **Feedback de "Vuelo"**: Al agregar un producto, un punto visual del color de la marca viaja desde la tarjeta hacia el FAB del carrito para confirmar la acción.
2. **Formato Pro de WhatsApp**: El mensaje automático debe usar negritas y emojis estratégicos (ej. `*1x Pizza* 🍕`) para evitar errores de lectura del tendero.
3. **Confirmación de GPS**: Mostrar un indicador visual (ej: *"📍 Ubicación sincronizada"*) al capturar las coordenadas para dar seguridad al cliente.
4. **Carga Fluida (Skeleton)**: Uso de placeholders animados mientras se descarga la base de datos del menú para evitar saltos visuales.
5. **Cero Fricción**: Mantener solo los campos esenciales (Nombre, Teléfono, Dirección, Ubicación, Notas). **No pedir correo** para maximizar la rapidez del pedido.

---

## 🎨 PERSONALIZACIÓN POR MARCA (TOKENS)
Para mantener la escalabilidad, se inyectarán estas variables por cada negocio:
- `--brand-primary`: Color principal del negocio.
- `--brand-logo`: URL del logo del establecimiento.
- `--brand-banner`: Array de imágenes para el slider.

---
**"FOWY: Simplicidad que escala, diseño que cautiva."**
