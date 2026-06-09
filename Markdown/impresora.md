# 🖨️ ESPECIFICACIÓN TÉCNICA E IMPLEMENTACIÓN DE IMPRESIÓN

Este documento detalla el plan de implementación para la funcionalidad de impresión de tickets desde el panel de órdenes de negocio, rigiéndose por los estándares de modularidad y la **Ley del Remolque** establecidos en [conceptos.md](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md).

---

## 📊 1. ANÁLISIS DE COMPLEJIDAD Y ENFOQUES

### Opción A: Impresión Nativa Web (CSS Print)
* **Complejidad**: 2 / 10
* **Descripción**: Usa estilos CSS `@media print` para ocultar la interfaz del panel y dejar visible únicamente la plantilla de la factura. Al presionar el botón de PC, se dispara `window.print()`.
* **Compatibilidad**: Universal (PC, macOS, Android, iOS).

### Opción B: Protocolo RawBT (Android)
* **Complejidad**: 4.5 / 10
* **Descripción**: Genera una cadena de comandos de texto plano adaptada a formato ESC/POS (ancho de 58mm o 80mm) y la envía mediante un enlace profundo de Android (`intent://`) hacia la aplicación RawBT, imprimiendo sin mostrar diálogos de confirmación del navegador.
* **Compatibilidad**: Dispositivos Android con impresoras térmicas conectadas por USB o Bluetooth.

---

## 🛠️ 2. FLUJO DE USUARIO EN PANTALLA

Según la especificación, el comportamiento del botón "Completar" en la lista de pedidos pendientes será:

```mermaid
graph TD
    A[Presionar botón 'Completar'] --> B{¿Desplegar opciones de Impresión?}
    B --> C[Botón 1: Imprimir PC/Web 💻]
    B --> D[Botón 2: Imprimir Android/RawBT 📱]
    C --> E[Ejecuta Opción A y Completa Orden]
    D --> F[Ejecuta Opción B y Completa Orden]
```

1. El usuario da clic en el botón **"Completar"**.
2. En lugar de ejecutar la acción directamente, el botón se expande o despliega dos opciones con iconos de impresión:
   * **Opción PC / Web** (Impresión nativa de navegador).
   * **Opción Android** (Impresión directa por comandos RawBT).
3. Al hacer clic en cualquiera de las dos opciones, se ejecuta la impresión seleccionada y automáticamente se procesa el cambio de estado del pedido a completado.

---

## 📝 3. CHECKLIST DETALLADO DE IMPLEMENTACIÓN

Siguiente el principio de modularidad y desacoplamiento absoluto de componentes:

### 🗄️ Fase 0: Adecuación de Datos (Pre-requisito Crítico)
- [ ] **0.1. Modificar Tabla `orders` en Supabase**
  - Añadir columnas opcionales (nullable) para almacenar los datos de envío y pago que actualmente solo se envían por WhatsApp: `delivery_address` (text), `notes` (text), `payment_method` (text), y `cash_change` (text). No alterar los datos existentes.
- [ ] **0.2. Actualizar `useCheckoutLogic.ts`**
  - Modificar la función de guardado en Supabase para insertar estos nuevos campos en la tabla `orders` y asegurar que la información esté disponible para el panel de negocio al imprimir.

### 📦 Fase 1: Creación de Módulos Independientes (Código Nuevo - Desde Cero)
- [ ] **1.1. Diseñar el Componente del Ticket (`OrderTicket.tsx`)**
  - Crear un nuevo componente en `src/components/partners/orders/OrderTicket.tsx`.
  - **Tipado Estricto:** Definir una interfaz en TypeScript (ej. `OrderTicketData`) para los props del componente. Evitar el uso de `any` para el listado de ítems y tipar los nuevos campos de dirección/pago, cumpliendo la regla 7.1.
  - **ESTRUCTURA DETALLADA DE LA COMANDA (Plantilla Predeterminada):**
    - **A. Encabezado (Header Dinámico):** Extraer e imprimir únicamente el Nombre del Negocio y el Teléfono de contacto (Se omite dirección del negocio ya que no existe en base de datos).
    - **B. Datos del Cliente y Envío:** Imprimir Nombre, Celular y Dirección de Entrega. *(NOTA: La Ubicación GPS o URL no va en la estructura de la comanda)*.
    - **C. Cuerpo (Ítems y Notas):** Mapear el listado de `items` (cantidades, descripción, subtotales). **Crucial:** Renderizar de forma visible cualquier nota de preparación (ej: "sin salsas") debajo de cada producto.
    - **D. Totales y Pago (Devuelta):** Mostrar Subtotal y Total a Pagar. Mostrar el Método de Pago. **Crucial:** Si es "Efectivo", mostrar el monto "Paga con: $X" y calcular/mostrar la "Devuelta: $Y".
    - **E. Pie de Página (Footer dinámico):** Imprimir mensaje de agradecimiento y el enlace al menú web usando el `slug` del negocio:
      ¡Gracias por tu compra!           
            Visita nuestro menú
      https://www.fowy.pro/[slug_del_negocio]
  - Aplicar estilos CSS específicos de ancho fijo (ej. `w-[80mm]` o `w-[58mm]`) y clases específicas para ocultarlo en la vista normal de pantalla, mostrándolo únicamente en el flujo de impresión.
- [ ] **1.2. Desarrollar el Hook de Impresión (`useOrderPrinter.ts`)**
  - Crear un hook modular en `src/hooks/useOrderPrinter.ts`.
  - Implementar la función de formateo de texto plano ESC/POS para la opción RawBT (Opción B).
  - Implementar el disparador `window.print()` configurando el título del documento dinámicamente con el ID de la orden.
  - Implementar la lógica para disparar el Intent de Android hacia RawBT: `intent://...#Intent;scheme=rawbt;package=ru.a402d.rawbtprinter;end;`.

### 🔗 Fase 2: Integración en la Interfaz (Código Heredado - Ley del Remolque)
- [ ] **2.1. Adaptar el Estado en la Fila de Pedidos (Componente Orquestador)**
  - Para evitar que `page.tsx` supere las 250 líneas (Regla de la Carpeta Maestra), abstraer la lógica de la sección de acciones creando un nuevo componente `OrderActionButtons.tsx` en `src/components/partners/orders/`.
  - Este componente hijo manejará su propio estado local para controlar si se están mostrando las opciones de impresión.
- [ ] **2.2. Implementar los Botones de Acción con Calidad Premium**
  - Reemplazar el botón simple de "Completar" por el nuevo componente dinámico. Al hacer clic en "Completar", se mostrarán en su lugar los dos nuevos botones.
  - **Micro-animaciones:** Usar `AnimatePresence` de `framer-motion` para que los botones de impresión aparezcan con una transición suave.
  - **Botón Imprimir PC**: Muestra icono de PC + Icono de impresora. Llama a la impresión nativa y completa el pedido.
  - **Botón Imprimir Android**: Muestra icono de Android + Icono de impresora. Llama al comando RawBT y completa el pedido. En caso de error, usar Toasts Premium (nunca `alert()`).
- [ ] **2.3. Insertar el Componente Oculto en el DOM**
  - Renderizar el componente `<OrderTicket />` dentro del mapa de pedidos de forma oculta para que el navegador lo detecte al invocar la cola de impresión.
