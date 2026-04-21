# 💸 INGENIERÍA FINANCIERA: EL FLUJO DE DINERO EN FOWY

> **REGLA DE ORO:** Solo Cristian puede dar la orden de crear código.

> "Transacciones claras, cuentas largas."

## 1. EL MODELO DE INGRESOS (REVENUE STREAMS)

FOWY genera ingresos por tres vías principales:
1.  **Suscripciones de Negocios**: Membrecía mensual/anual por usar el software (Menú, Dashboard).
2.  **Marketplace Fees**: Comisión por conectar Negocios con Profesionales (Service Fee).
3.  **Servicios Premium**: Venta de plantillas, hosting de subdominios personalizados o integraciones avanzadas (Zapier, etc.).

---

## 2. REPARTO DE COMISIONES (SELLERS)

**Decisión Técnica: Comisiones Recurrentes Automatizadas**
**Por qué es la mejor decisión:**
Para motivar a los vendedores, el sistema no paga una sola vez, sino que paga una comisión **cada mes** que el negocio se mantenga activo.

*   **Identificación**: El negocio está vinculado perpetuamente al `seller_id` que lo registró.
*   **Cálculo**: Al momento del pago, una función de base de datos (`trigger`) calcula el % del vendedor y lo deposita en su Wallet virtual.
*   **Transparencia**: El vendedor tiene un KPI de "Ingresos Pasivos Mensuales" en su dashboard.

---

## 3. GESTIÓN DE PAGOS Y ESCROW (PROFESIONALES)

Para los servicios del "Conector", FOWY actúa como **Agente de Escrow**:

1.  **Pago Total**: El negocio paga $100.
2.  **Retención**: Fowy guarda los $100 en una cuenta de tránsito.
3.  **Deducción de Service Fee**: Al finalizar el trabajo, Fowy toma su comisión (ej: 15% = $15).
4.  **Neto al Profesional**: El profesional recibe el restante ($85) en su Wallet.

---

## 4. SISTEMA DE WALLETS (BILLETERAS VIRTUALES)

Cada usuario (Sellers, Profesionales, Admin) tendrá una tabla de `wallets` en la base de datos para manejar su saldo disponible, pendiente y retirado.

*   **Saldo Pendiente**: Dinero de trabajos en curso (Escrow).
*   **Saldo Disponible**: Dinero que ya puede ser retirado.
*   **Historial de Transacciones**: Cada centavo debe tener un registro de auditoría (Auditable Ledger).

---

## 5. MÉTODOS DE PAGO Y SALIDA (PAYOUTS)

*   **Entrada de Dinero**: Integración con pasarelas locales e internacionales (Stripe, WhatsApp Pay, Pago Móvil o NOWPayments para Crypto).
*   **Retiros (Withdrawals)**: Los Sellers y Profesionales solicitan retiros. El Admin aprueba o se automatiza mediante Webhooks de pagos masivos.

---
**"FOWY Finanzas: Precisión industrial para tu economía digital."**
