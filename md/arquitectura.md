# 🏗️ INGENIERÍA DE MÓDULOS: "SISTEMA PLUG & PLAY"

> **REGLA DE ORO:** Solo Cristian puede dar la orden de crear código.

> "Modulares por diseño, unidos por el éxito."

## 1. FILOSOFÍA DE AISLAMIENTO

**Decisión: Boundary Layouts (Layouts de Frontera)**
**Por qué es la mejor decisión:**
En Next.js, cada carpeta de rol `(admin)`, `(vendedores)`, etc., tiene su propio archivo `layout.tsx`. Esto actúa como un "Cortafuegos Estético y Lógico". Si el layout de Vendedores necesita una librería pesada de gráficos, no afecta la carga del Menú Digital de los clientes.

---

## 2. COMPONENTES "LOCALES" VS "CENTRO COMERCIAL"

### Atoms & UI (Shared)
Componentes básicos como botones, inputs y tarjetas de cristal (Glassmorphism) viven en `@/components/ui`. Son compartidos para mantener la coherencia de marca (El diseño premium de FOWY).

### Modules (Isolated)
Lógica compleja como un "Calculador de Comisiones" para Vendedores vive en `@/modules/vendedores`. 
**Ningún otro rol puede importar de esta carpeta.** Esto evita el "Efecto Dominó": si borras el módulo de vendedores, solo se rompe esa sección, no el núcleo de la app.

---

## 3. EL MENÚ DIGITAL (EL PRODUCTO ESTRELLA)

**Decisión: Renderizado Estático Incremental (ISR)**
**Por qué es la mejor decisión:**
El menú digital debe ser la parte más rápida de la app. Usando ISR, el menú se genera una vez y se sirve instantáneamente a miles de usuarios. Cuando el dueño del negocio cambia un precio, FOWY regenera la página en segundo plano sin que el usuario lo note.

---

## 4. COMUNICACIÓN ENTRE MÓDULOS e INTEGRACIONES

**Decisión: Eventos y Hooks, no Acoplamiento Directo**
Si el módulo de "Check-out" necesita avisar al módulo de "KPIs" que hubo una venta, no lo hace llamando a una función interna. Lo hace emitiendo un evento en la base de datos o un Webhook. 

**Integraciones Externas (Low Cost):**
*   **Navegación:** Uso de Deep Links para delegar el ruteo GPS a apps externas.
*   **Notificaciones:** Uso de la API nativa de WhatsApp para avisos de pedidos si es necesario.

**Resultado:** Los módulos son piezas de LEGO que se pueden quitar y poner sin pegamento.

---
**"FOWY: La flexibilidad de un subdominio, la potencia de un ecosistema."**
