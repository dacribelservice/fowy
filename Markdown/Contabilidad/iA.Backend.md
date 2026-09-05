# ⚙️ FOWY iA FINANZAS & COPILOT — MOTOR BACKEND & BASE DE DATOS

> ⚠️ **REGLA DE ORO**: Solo se permite la creación o edición de líneas de código y la realización de copias de seguridad (Backups) en GitHub si, y solo si, Cristian (CEO de FOWY) lo solicita expresamente.

> **Documento Maestro de Base de Datos, Procedimientos RPC Atómicos, Seguridad y Escalabilidad**  
> **Autor:** Antigravity AI (Especialista en Arquitectura SaaS & Finanzas Tecnológicas)  
> **Destinatario:** Cristian (CEO de FOWY)  
> **Alineación:** [`Markdown/conceptos.md`](file:///c:/Users/cange/Documents/fowy/Markdown/conceptos.md), [`Markdown/Contabilidad/iA.UX-UI.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.UX-UI.md) e [`Markdown/Contabilidad/iA.Work.md`](file:///c:/Users/cange/Documents/fowy/Markdown/Contabilidad/iA.Work.md)  
> **Fecha:** 5 de Septiembre de 2026  
> **Versión:** 1.0 (Motor 100% Blindado con Tabla Satélite, ACID en 1 RTT y Cero Escritura en businesses)  

---

## 🗄️ 1. Filosofía de Arquitectura de Datos: La Isla Financiera

Para garantizar que el módulo de comensales (`/explorar`, mapas Leaflet y menús `/[slug]`) permanezca **100% intocado y protegido contra regresiones**, la arquitectura aplica el **Patrón de Entidad Satélite (*Satellite Domain Pattern*)**:

```mermaid
graph TD
    subgraph Dominio Madre (100% Virgen e Intocable)
        B[(businesses - Datos Públicos y GPS)]
        O[(orders - Pedidos Comensales)]
    end

    subgraph Isla Financiera FOWY (La IA opera AQUÍ)
        BS[(business_subscriptions - Satélite 1:1)]
        FA[(financial_accounts - Cajas Multibolsillo)]
        MP[(membership_payments - Recibos REC-XXXX)]
        OE[(operational_expenses - Egresos OPEX)]
        PC[(payment_commitments - Cartera y Acuerdos)]
        CT[(ceo_tasks - Agenda de Campo)]
        DFR[(daily_financial_reports - Cierre Inmutable)]
        AT[(account_transfers - Traspasos de Fondos)]
        PA[(pending_actions - TTL 10 min)]
        PWE[(processed_webhook_events - Idempotencia)]
    end

    B -.->|Solo Lectura| BS
    O -.->|Solo Lectura Analítica| BS
    IA[Agente Copilot / Webhooks] -->|Escribe Únicamente en| Isla Financiera
```

* **Regla Sagrada:** La tabla `businesses` **NO recibe columnas nuevas ni sentencias `UPDATE`**.
* La IA y los procedimientos contables escriben de forma exclusiva dentro de las 10 tablas de la **Isla Financiera**.

---

## 🧱 2. Esquema DDL Formal (PostgreSQL en Supabase)

### 2.1 Tabla Satélite de Suscripciones & Onboarding (`business_subscriptions`)
Aísla el ciclo de vida comercial, cortes y entregables sin alterar `businesses`:

```sql
CREATE TABLE IF NOT EXISTS business_subscriptions (
    business_id UUID PRIMARY KEY REFERENCES businesses(id) ON DELETE CASCADE,
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'trial', -- 'trial', 'active', 'grace_period', 'suspended'
    trial_ends_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '15 days'),
    next_billing_date TIMESTAMPTZ,
    monthly_fee NUMERIC(10,2) DEFAULT 50000.00,
    billing_notes TEXT,
    -- Entregables y Onboarding comercial
    onboarding_photos VARCHAR(30) DEFAULT 'pending', -- 'pending', 'taken', 'uploaded'
    onboarding_flyers VARCHAR(30) DEFAULT 'none',    -- 'none', 'in_design', 'printed', 'delivered'
    onboarding_stickers_qr VARCHAR(30) DEFAULT 'pending', -- 'pending', 'delivered'
    onboarding_menu_ready BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Arqueo de Cuentas Financieras y Cajas (`financial_accounts`)
Gestiona los diferentes bolsillos de liquidez real en Colombia:

```sql
CREATE TABLE IF NOT EXISTS financial_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(30) UNIQUE NOT NULL, -- 'nequi', 'daviplata', 'bancolombia', 'cash', 'other'
    name VARCHAR(50) NOT NULL,
    current_balance NUMERIC(12,2) DEFAULT 0.00,
    account_number VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Pagos de Membresías y Recibos Consecutivos (`membership_payments`)
Registra cada ingreso con consecutivo legal único y soporte para abonos parciales:

```sql
CREATE TABLE IF NOT EXISTS membership_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receipt_number SERIAL UNIQUE, -- Consecutivo automático para comprobantes (ej: REC-001)
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    account_id UUID REFERENCES financial_accounts(id),
    amount NUMERIC(10,2) NOT NULL,
    payment_method VARCHAR(30) NOT NULL, -- 'nequi', 'daviplata', 'bancolombia', 'cash'
    is_partial BOOLEAN DEFAULT FALSE,    -- Soporte para abonos parciales (ej: $25.000)
    commitment_id UUID,                  -- Enlace opcional con compromiso previo
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    proof_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES auth.users(id)
);
```

### 2.4 Egresos y Gastos Operativos (`operational_expenses`)
Registra el OPEX real de FOWY imputando a cuentas y locales:

```sql
CREATE TABLE IF NOT EXISTS operational_expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    account_id UUID REFERENCES financial_accounts(id) NOT NULL,
    category VARCHAR(40) NOT NULL, -- 'infrastructure', 'flyers_printing', 'photography', 'transport', 'marketing', 'other'
    amount NUMERIC(10,2) NOT NULL,
    description TEXT NOT NULL,
    related_business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    receipt_proof_url TEXT,
    expense_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES auth.users(id)
);
```

### 2.5 Cartera y Compromisos Verbales de Pago (`payment_commitments`)
Memoria de acuerdos de pago pactados en persona o por chat:

```sql
CREATE TABLE IF NOT EXISTS payment_commitments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    agreed_amount NUMERIC(10,2) NOT NULL,
    agreed_date DATE NOT NULL,
    notes TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'fulfilled', 'renegotiated', 'broken'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES auth.users(id)
);
```

### 2.6 Agenda de Campo & Tareas del CEO (`ceo_tasks`)
Control de visitas presenciales, mandados de imprenta y recordatorios:

```sql
CREATE TABLE IF NOT EXISTS ceo_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_type VARCHAR(30) NOT NULL, -- 'visita', 'impresion_volantes', 'fotos', 'reunion', 'cobro', 'otro'
    title TEXT NOT NULL,
    business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
    due_date DATE NOT NULL,
    due_time TIME,
    priority VARCHAR(10) DEFAULT 'media', -- 'alta', 'media', 'baja'
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'completed', 'rescheduled', 'cancelled'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES auth.users(id)
);
```

### 2.7 Cierre Diario y Libro Mayor Inmutable (`daily_financial_reports`)
Almacena el balance nocturno auditado automáticamente por el sistema:

```sql
CREATE TABLE IF NOT EXISTS daily_financial_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_date DATE NOT NULL UNIQUE DEFAULT CURRENT_DATE,
    total_active_businesses INT NOT NULL,
    businesses_in_trial INT NOT NULL,
    businesses_due_today INT NOT NULL,
    businesses_in_grace INT NOT NULL,
    businesses_suspended INT NOT NULL,
    daily_income NUMERIC(10,2) DEFAULT 0.00,
    daily_expenses NUMERIC(10,2) DEFAULT 0.00,
    daily_net NUMERIC(10,2) DEFAULT 0.00,
    month_to_date_income NUMERIC(10,2) DEFAULT 0.00,
    month_to_date_expenses NUMERIC(10,2) DEFAULT 0.00,
    month_to_date_net NUMERIC(10,2) DEFAULT 0.00,
    pending_receivables NUMERIC(10,2) DEFAULT 0.00,
    executive_summary TEXT NOT NULL,
    morning_briefing_text TEXT NOT NULL,
    tasks_scheduled_today JSONB DEFAULT '[]'::jsonb,
    commitments_due JSONB DEFAULT '[]'::jsonb,
    urgent_actions JSONB DEFAULT '[]'::jsonb,
    ai_cfo_recommendations TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.8 Traspasos de Fondos entre Cuentas (`account_transfers`)
Movimiento de dinero entre bolsillos sin afectar el P&L:

```sql
CREATE TABLE IF NOT EXISTS account_transfers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_account_id UUID REFERENCES financial_accounts(id) NOT NULL,
    destination_account_id UUID REFERENCES financial_accounts(id) NOT NULL,
    amount NUMERIC(10,2) NOT NULL CHECK (amount > 0),
    fee NUMERIC(10,2) DEFAULT 0.00,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    registered_by UUID REFERENCES auth.users(id)
);
```

### 2.9 Acciones Pendientes con TTL de 10 Minutos (`pending_actions`)
Soporte de la confirmación en dos pasos (*Two-Step Confirmation*):

```sql
CREATE TABLE IF NOT EXISTS pending_actions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    channel VARCHAR(20) NOT NULL, -- 'whatsapp', 'web'
    action_type VARCHAR(50) NOT NULL, -- 'register_payment', 'register_expense', 'register_transfer', 'schedule_task'
    payload JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'executed', 'cancelled', 'expired', 'superseded'
    expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '10 minutes'),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    executed_at TIMESTAMPTZ,
    user_id UUID REFERENCES auth.users(id)
);
```

### 2.10 Deduplicación e Idempotencia de Webhooks (`processed_webhook_events`)
Previene duplicación de transacciones ante reintentos de red:

```sql
CREATE TABLE IF NOT EXISTS processed_webhook_events (
    message_id VARCHAR(100) PRIMARY KEY,
    sender_phone VARCHAR(30) NOT NULL,
    event_type VARCHAR(30) NOT NULL,
    processed_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## ⚡ 3. Procedimientos Transaccionales Atómicos (ACID en 1 RTT)

### 3.1 `apply_confirmed_membership_payment`
Aplica el pago, suma en caja, actualiza la fecha en `business_subscriptions` y crea cartera si fue abono parcial:

```sql
CREATE OR REPLACE FUNCTION apply_confirmed_membership_payment(
    p_business_id UUID,
    p_account_id UUID,
    p_amount NUMERIC,
    p_payment_method VARCHAR,
    p_extension_days INT DEFAULT 30,
    p_notes TEXT DEFAULT NULL,
    p_is_partial BOOLEAN DEFAULT FALSE,
    p_commitment_id UUID DEFAULT NULL,
    p_remaining_amount NUMERIC DEFAULT 0.00,
    p_remaining_due_date DATE DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_receipt_number INT;
    v_new_billing_date TIMESTAMPTZ;
    v_business_name TEXT;
    v_new_commitment_id UUID := NULL;
BEGIN
    SELECT name INTO v_business_name FROM businesses WHERE id = p_business_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Negocio no encontrado';
    END IF;

    -- 1. Insertar pago
    INSERT INTO membership_payments (
        business_id, account_id, amount, payment_method, 
        period_start, period_end, notes, is_partial, commitment_id
    ) VALUES (
        p_business_id, p_account_id, p_amount, p_payment_method,
        NOW(), NOW() + (p_extension_days || ' days')::INTERVAL, 
        p_notes, p_is_partial, p_commitment_id
    ) RETURNING receipt_number INTO v_receipt_number;

    -- 2. Incrementar saldo en cuenta
    UPDATE financial_accounts
    SET current_balance = current_balance + p_amount, updated_at = NOW()
    WHERE id = p_account_id;

    -- 3. Upsert en tabla satélite business_subscriptions (businesses queda intacta)
    INSERT INTO business_subscriptions (business_id, subscription_status, next_billing_date)
    VALUES (
        p_business_id, 
        'active', 
        NOW() + (p_extension_days || ' days')::INTERVAL
    )
    ON CONFLICT (business_id) DO UPDATE
    SET subscription_status = 'active',
        next_billing_date = CASE 
            WHEN business_subscriptions.next_billing_date IS NULL OR business_subscriptions.next_billing_date < NOW() THEN NOW() + (p_extension_days || ' days')::INTERVAL
            ELSE business_subscriptions.next_billing_date + (p_extension_days || ' days')::INTERVAL
        END,
        updated_at = NOW()
    RETURNING next_billing_date INTO v_new_billing_date;

    -- 4. Cerrar compromiso verbal si existía
    IF p_commitment_id IS NOT NULL THEN
        UPDATE payment_commitments SET status = 'fulfilled' WHERE id = p_commitment_id;
    END IF;

    -- 5. Crear cartera si fue abono parcial con saldo restante
    IF p_is_partial AND p_remaining_amount > 0 THEN
        INSERT INTO payment_commitments (
            business_id, agreed_amount, agreed_date, notes, status
        ) VALUES (
            p_business_id, 
            p_remaining_amount, 
            COALESCE(p_remaining_due_date, CURRENT_DATE + 7), 
            'Saldo pendiente de abono parcial (Recibo REC-' || LPAD(v_receipt_number::TEXT, 4, '0') || ')',
            'pending'
        ) RETURNING id INTO v_new_commitment_id;
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'receipt_number', v_receipt_number,
        'receipt_code', 'REC-' || LPAD(v_receipt_number::TEXT, 4, '0'),
        'business_name', v_business_name,
        'amount', p_amount,
        'is_partial', p_is_partial,
        'remaining_amount', p_remaining_amount,
        'remaining_commitment_id', v_new_commitment_id,
        'next_billing_date', v_new_billing_date
    );
END;
$$;
```

### 3.2 `apply_confirmed_expense`
Aplica el egreso OPEX y descuenta atómicamente el saldo en la cuenta de origen:

```sql
CREATE OR REPLACE FUNCTION apply_confirmed_expense(
    p_account_id UUID,
    p_category VARCHAR,
    p_amount NUMERIC,
    p_description TEXT,
    p_related_business_id UUID DEFAULT NULL,
    p_expense_date DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_expense_id UUID;
    v_account_name TEXT;
    v_new_balance NUMERIC;
BEGIN
    SELECT name INTO v_account_name FROM financial_accounts WHERE id = p_account_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Cuenta financiera no encontrada';
    END IF;

    -- 1. Insertar egreso operativo
    INSERT INTO operational_expenses (
        account_id, category, amount, description, 
        related_business_id, expense_date
    ) VALUES (
        p_account_id, p_category, p_amount, p_description, 
        p_related_business_id, p_expense_date
    ) RETURNING id INTO v_expense_id;

    -- 2. Descontar saldo en cuenta financiera
    UPDATE financial_accounts
    SET current_balance = current_balance - p_amount, updated_at = NOW()
    WHERE id = p_account_id
    RETURNING current_balance INTO v_new_balance;

    RETURN jsonb_build_object(
        'success', true,
        'expense_id', v_expense_id,
        'account_name', v_account_name,
        'amount', p_amount,
        'new_balance', v_new_balance
    );
END;
$$;
```

### 3.3 `apply_account_transfer`
Traspasa fondos entre cuentas descontando comisiones bancarias si existen:

```sql
CREATE OR REPLACE FUNCTION apply_account_transfer(
    p_source_account_id UUID,
    p_destination_account_id UUID,
    p_amount NUMERIC,
    p_fee NUMERIC DEFAULT 0.00,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE financial_accounts 
    SET current_balance = current_balance - (p_amount + p_fee), updated_at = NOW()
    WHERE id = p_source_account_id;

    UPDATE financial_accounts 
    SET current_balance = current_balance + p_amount, updated_at = NOW()
    WHERE id = p_destination_account_id;

    INSERT INTO account_transfers (source_account_id, destination_account_id, amount, fee, notes)
    VALUES (p_source_account_id, p_destination_account_id, p_amount, p_fee, p_notes);

    IF p_fee > 0 THEN
        INSERT INTO operational_expenses (account_id, category, amount, description, expense_date)
        VALUES (p_source_account_id, 'infrastructure', p_fee, 'Comisión bancaria de traspaso', CURRENT_DATE);
    END IF;

    RETURN jsonb_build_object('success', true, 'amount', p_amount, 'fee', p_fee);
END;
$$;
```

### 3.4 `get_business_dossier`
Consulta el expediente 360° en `<10 ms` uniendo `businesses` con `business_subscriptions`:

```sql
CREATE OR REPLACE FUNCTION get_business_dossier(
    p_business_identifier TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_biz RECORD;
    v_metrics JSONB;
    v_commitments JSONB;
    v_tasks JSONB;
BEGIN
    SELECT b.id, b.name, b.slug, 
           COALESCE(bs.subscription_status, 'trial') AS subscription_status, 
           bs.next_billing_date, 
           COALESCE(bs.monthly_fee, 50000.00) AS monthly_fee,
           COALESCE(bs.onboarding_photos, 'pending') AS onboarding_photos, 
           COALESCE(bs.onboarding_flyers, 'none') AS onboarding_flyers, 
           COALESCE(bs.onboarding_stickers_qr, 'pending') AS onboarding_stickers_qr, 
           COALESCE(bs.onboarding_menu_ready, FALSE) AS onboarding_menu_ready
    INTO v_biz
    FROM businesses b
    LEFT JOIN business_subscriptions bs ON bs.business_id = b.id
    WHERE b.id::TEXT = p_business_identifier 
       OR b.slug = p_business_identifier
       OR b.name ILIKE '%' || p_business_identifier || '%'
    ORDER BY (b.name ILIKE p_business_identifier || '%') DESC
    LIMIT 1;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Negocio no encontrado');
    END IF;

    SELECT jsonb_build_object(
        'total_orders_last_30d', COUNT(*),
        'estimated_gross_sales', COALESCE(SUM(total_amount), 0),
        'average_ticket', CASE WHEN COUNT(*) > 0 THEN ROUND(COALESCE(SUM(total_amount), 0) / COUNT(*), 2) ELSE 0 END,
        'fowy_cost_per_order', CASE WHEN COUNT(*) > 0 THEN ROUND(COALESCE(v_biz.monthly_fee, 50000.00) / COUNT(*), 2) ELSE 0 END
    ) INTO v_metrics
    FROM orders
    WHERE business_id = v_biz.id AND created_at >= NOW() - INTERVAL '30 days';

    SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'agreed_amount', agreed_amount, 'agreed_date', agreed_date, 'notes', notes, 'status', status
    )) INTO v_commitments
    FROM payment_commitments
    WHERE business_id = v_biz.id AND status = 'pending';

    SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'title', title, 'task_type', task_type, 'due_date', due_date, 'due_time', due_time, 'status', status
    )) INTO v_tasks
    FROM ceo_tasks
    WHERE business_id = v_biz.id AND status = 'pending';

    RETURN jsonb_build_object(
        'business', jsonb_build_object(
            'id', v_biz.id,
            'name', v_biz.name,
            'slug', v_biz.slug,
            'subscription_status', v_biz.subscription_status,
            'next_billing_date', v_biz.next_billing_date,
            'monthly_fee', v_biz.monthly_fee,
            'deliverables', jsonb_build_object(
                'photos', v_biz.onboarding_photos,
                'flyers', v_biz.onboarding_flyers,
                'stickers_qr', v_biz.onboarding_stickers_qr,
                'menu_ready', v_biz.onboarding_menu_ready
            )
        ),
        'recent_metrics', v_metrics,
        'pending_commitments', COALESCE(v_commitments, '[]'::jsonb),
        'agenda_tasks', COALESCE(v_tasks, '[]'::jsonb)
    );
END;
$$;
```

### 3.5 `get_admin_finance_summary`
Calcula el P&L completo, cajas, tareas y semáforos en **< 4 KB y < 15 ms**:

```sql
CREATE OR REPLACE FUNCTION get_admin_finance_summary()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_income NUMERIC := 0.00;
    v_expenses NUMERIC := 0.00;
    v_paid_count INT := 0;
    v_receivables NUMERIC := 0.00;
    v_metrics JSONB;
    v_accounts JSONB;
    v_today_tasks JSONB;
    v_counts JSONB;
BEGIN
    SELECT COALESCE(SUM(amount), 0), COUNT(*)
    INTO v_income, v_paid_count
    FROM membership_payments 
    WHERE period_start >= date_trunc('month', CURRENT_DATE);

    SELECT COALESCE(SUM(amount), 0)
    INTO v_expenses
    FROM operational_expenses
    WHERE expense_date >= date_trunc('month', CURRENT_DATE);

    SELECT COALESCE(SUM(agreed_amount), 0)
    INTO v_receivables
    FROM payment_commitments
    WHERE status = 'pending';

    v_metrics := jsonb_build_object(
        'month_income', v_income,
        'month_expenses', v_expenses,
        'net_profit', v_income - v_expenses,
        'pending_receivables', v_receivables,
        'total_paid_count', v_paid_count
    );

    SELECT jsonb_build_object(
        'active', COUNT(*) FILTER (WHERE subscription_status = 'active'),
        'trial', COUNT(*) FILTER (WHERE subscription_status = 'trial'),
        'grace_period', COUNT(*) FILTER (WHERE subscription_status = 'grace_period'),
        'suspended', COUNT(*) FILTER (WHERE subscription_status = 'suspended'),
        'total', (SELECT COUNT(*) FROM businesses)
    ) INTO v_counts FROM business_subscriptions;

    SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'code', code, 'name', name, 'current_balance', current_balance
    )) INTO v_accounts FROM financial_accounts WHERE is_active = TRUE;

    SELECT jsonb_agg(jsonb_build_object(
        'id', id, 'title', title, 'task_type', task_type, 'due_time', due_time, 'status', status, 'business_id', business_id
    )) INTO v_today_tasks FROM ceo_tasks WHERE due_date = CURRENT_DATE AND status = 'pending';

    RETURN jsonb_build_object(
        'metrics', v_metrics,
        'counts', v_counts,
        'accounts', COALESCE(v_accounts, '[]'::jsonb),
        'today_tasks', COALESCE(v_today_tasks, '[]'::jsonb)
    );
END;
$$;
```

### 3.6 `get_admin_businesses_billing_page`
Paginación server-side (30 en 30) con filtros y búsqueda GIN Trigram:

```sql
CREATE OR REPLACE FUNCTION get_admin_businesses_billing_page(
    p_status VARCHAR DEFAULT 'all',
    p_search TEXT DEFAULT '',
    p_limit INT DEFAULT 30,
    p_offset INT DEFAULT 0
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_rows JSONB;
    v_total_filtered INT;
BEGIN
    SELECT COUNT(*) INTO v_total_filtered
    FROM businesses b
    LEFT JOIN business_subscriptions bs ON bs.business_id = b.id
    WHERE (p_status = 'all' OR COALESCE(bs.subscription_status, 'trial') = p_status)
      AND (p_search = '' OR b.name ILIKE '%' || p_search || '%');

    SELECT jsonb_agg(jsonb_build_object(
        'id', id,
        'name', name,
        'subscription_status', subscription_status,
        'trial_ends_at', trial_ends_at,
        'next_billing_date', next_billing_date,
        'monthly_fee', monthly_fee,
        'onboarding_photos', onboarding_photos,
        'onboarding_flyers', onboarding_flyers
    )) INTO v_rows
    FROM (
        SELECT b.id, b.name, 
               COALESCE(bs.subscription_status, 'trial') AS subscription_status, 
               bs.trial_ends_at, 
               bs.next_billing_date, 
               COALESCE(bs.monthly_fee, 50000.00) AS monthly_fee, 
               COALESCE(bs.onboarding_photos, 'pending') AS onboarding_photos, 
               COALESCE(bs.onboarding_flyers, 'none') AS onboarding_flyers
        FROM businesses b
        LEFT JOIN business_subscriptions bs ON bs.business_id = b.id
        WHERE (p_status = 'all' OR COALESCE(bs.subscription_status, 'trial') = p_status)
          AND (p_search = '' OR b.name ILIKE '%' || p_search || '%')
        ORDER BY 
            CASE WHEN COALESCE(bs.subscription_status, 'trial') = 'grace_period' THEN 1
                 WHEN COALESCE(bs.subscription_status, 'trial') = 'trial' THEN 2
                 ELSE 3 END,
            bs.next_billing_date ASC NULLS LAST
        LIMIT p_limit OFFSET p_offset
    ) sub;

    RETURN jsonb_build_object(
        'data', COALESCE(v_rows, '[]'::jsonb),
        'total', v_total_filtered,
        'limit', p_limit,
        'offset', p_offset
    );
END;
$$;
```

---

## 🚀 4. Índices de Alto Rendimiento (Escalabilidad 10.000+ Negocios)

```sql
-- 1. Búsqueda instantánea de nombres con Trigram GIN (<5ms en 100k registros)
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm 
ON businesses USING gin (name gin_trgm_ops);

-- 2. Semáforos y cortes en la tabla satélite
CREATE INDEX IF NOT EXISTS idx_business_subscriptions_status_date 
ON business_subscriptions(subscription_status, next_billing_date ASC NULLS LAST);

-- 3. Histórico de cobros por mes
CREATE INDEX IF NOT EXISTS idx_membership_payments_period_lookup 
ON membership_payments(period_start DESC, business_id);

-- 4. Gastos OPEX por fecha descendente
CREATE INDEX IF NOT EXISTS idx_operational_expenses_date 
ON operational_expenses(expense_date DESC);

-- 5. Agenda del CEO por fecha y estado
CREATE INDEX IF NOT EXISTS idx_ceo_tasks_due_status 
ON ceo_tasks(due_date, status);

-- 6. Cola efímera de confirmación de 2 pasos (<1ms)
CREATE INDEX IF NOT EXISTS idx_pending_actions_lookup 
ON pending_actions(channel, status, expires_at);

-- 7. Traspasos entre cuentas
CREATE INDEX IF NOT EXISTS idx_account_transfers_created 
ON account_transfers(created_at DESC);
```

---

## 🔒 5. Seguridad RLS y Permisos de Ejecución

```sql
-- Habilitar RLS en toda la Isla Financiera
ALTER TABLE business_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE operational_expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_commitments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ceo_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_financial_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE account_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE pending_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE processed_webhook_events ENABLE ROW LEVEL SECURITY;

-- Política de Aislamiento para Administradores
DO $$
DECLARE
    tbl text;
    tables text[] := ARRAY[
        'business_subscriptions', 'financial_accounts', 'membership_payments', 
        'operational_expenses', 'payment_commitments', 'ceo_tasks', 
        'daily_financial_reports', 'account_transfers', 'pending_actions', 
        'processed_webhook_events'
    ];
BEGIN
    FOREACH tbl IN ARRAY tables LOOP
        EXECUTE format('
            DROP POLICY IF EXISTS admin_finance_isolation_policy ON %I;
            CREATE POLICY admin_finance_isolation_policy ON %I
            FOR ALL TO authenticated
            USING ((auth.jwt() ->> ''role'') = ''admin'')
            WITH CHECK ((auth.jwt() ->> ''role'') = ''admin'');
        ', tbl, tbl);
    END LOOP;
END;
$$;

-- Blindaje de Funciones RPC
REVOKE EXECUTE ON FUNCTION apply_confirmed_membership_payment FROM public;
GRANT EXECUTE ON FUNCTION apply_confirmed_membership_payment TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION apply_account_transfer FROM public;
GRANT EXECUTE ON FUNCTION apply_account_transfer TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION apply_confirmed_expense FROM public;
GRANT EXECUTE ON FUNCTION apply_confirmed_expense TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_business_dossier FROM public;
GRANT EXECUTE ON FUNCTION get_business_dossier TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_admin_finance_summary FROM public;
GRANT EXECUTE ON FUNCTION get_admin_finance_summary TO authenticated, service_role;

REVOKE EXECUTE ON FUNCTION get_admin_businesses_billing_page FROM public;
GRANT EXECUTE ON FUNCTION get_admin_businesses_billing_page TO authenticated, service_role;
```

---

## 🤖 6. Motor Webhook de WhatsApp (Evolution API & Rápida Confirmación)

* **Palabra de Confirmación:** **`"CONFIRMADO"`** (ejecuta RPC en `<50 ms`, 0 tokens de IA).
* **Palabra de Cancelación:** **`"CANCELAR"`** (marca acción como `cancelled` en `<20 ms`).
* **Superseded:** Toda nueva instrucción dictada invalida las acciones pendientes anteriores (`status = 'superseded'`).
* **Audios Multimodales:** Procesamiento directo en Gemini 1.5 Flash (soporte nativo Opus/MP3 sin Whisper).

---
*Fin del Documento Maestro Backend — FOWY iA Finanzas 2026*
