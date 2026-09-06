export type SubscriptionStatus = 'trial' | 'active' | 'grace_period' | 'suspended';
export type PaymentMethod = 'nequi' | 'daviplata' | 'bancolombia' | 'cash' | 'other';
export type ExpenseCategory = 'viaticos_calle' | 'transporte_movilidad' | 'material_negocios' | 'tecnologia_fija' | 'salario_ceo' | 'otros';
export type TaskType = 'visita' | 'impresion_volantes' | 'fotos' | 'reunion' | 'cobro' | 'otro';
export type PriorityLevel = 'alta' | 'media' | 'baja';
export type ActionStatus = 'pending' | 'executed' | 'cancelled' | 'expired' | 'superseded';
export type DeliverableStatus = 'pending' | 'in_progress' | 'delivered' | 'none';
export type DeliverablesMap = Record<string, DeliverableStatus | string>;
export type ModulesMap = Record<string, boolean>;

// --- DTOs de Procedimientos RPC ---
export interface FinancialHealthKpisDTO {
  cpi_onboarding: number;
  dso_days: number;
  runway_months: number;
  operating_margin_pct: number;
}

export interface AdminFinanceSummaryDTO {
  metrics: {
    month_income: number;
    month_expenses: number;
    expenses_by_category: Record<string, number>;
    net_profit: number;
    tithing: number;
    pending_receivables: number;
    total_paid_count: number;
    operating_margin_pct: number;
  };
  health_kpis: FinancialHealthKpisDTO;
  counts: { active: number; trial: number; grace_period: number; suspended: number; total: number; };
  accounts: Array<{ id: string; code: string; name: string; current_balance: number; }>;
  today_tasks: Array<{ id: string; title: string; task_type: TaskType; due_time: string | null; status: string; business_id: string | null; }>;
}

export interface BusinessBillingRowDTO {
  id: string;
  name: string;
  subscription_status: SubscriptionStatus;
  trial_ends_at: string | null;
  next_billing_date: string | null;
  monthly_fee: number;
  deliverables: DeliverablesMap;
  modules: ModulesMap;
  growth_pct?: number;
}

export interface BillingPageDTO {
  data: BusinessBillingRowDTO[];
  total: number;
  limit: number;
  offset: number;
}

export interface BusinessGrowthMetricsDTO {
  orders_wow_pct: number;
  orders_mom_pct: number;
  visits_wow_pct: number;
  visits_mom_pct: number;
  orders_current_7d?: number;
  visits_current_7d?: number;
  trend_status?: 'growing' | 'stable' | 'churn_risk';
}

export interface BusinessDossierDTO {
  business: {
    id: string;
    name: string;
    slug: string;
    subscription_status: SubscriptionStatus;
    next_billing_date: string | null;
    monthly_fee: number;
    deliverables: DeliverablesMap;
    modules: ModulesMap;
  };
  recent_metrics: {
    total_orders_last_30d: number;
    estimated_gross_sales: number;
    average_ticket: number;
    fowy_cost_per_order: number;
  };
  growth_metrics?: BusinessGrowthMetricsDTO;
  pending_commitments: Array<{ id: string; agreed_amount: number; agreed_date: string; notes: string; status: string; }>;
  agenda_tasks: Array<{ id: string; title: string; task_type: TaskType; due_date: string; due_time: string | null; status: string; }>;
}

export interface NetworkGrowthDTO {
  total_businesses: number;
  affiliations: { this_month: number; prev_month: number; growth_mom_pct: number; };
  visits: { this_month: number; prev_month: number; growth_mom_pct: number; growth_wow_pct: number; };
  orders_conversion: { this_month: number; prev_month: number; growth_mom_pct: number; };
}

// --- Recibo y UI ---
export interface ReceiptData {
  receipt_number: number;
  receipt_code: string;
  business_name: string;
  business_slug?: string;
  amount: number;
  payment_method: string;
  period_start: string;
  period_end: string;
  is_partial?: boolean;
  remaining_amount?: number;
  notes?: string;
}

export interface PendingActionDTO {
  id: string;
  channel: 'whatsapp' | 'web';
  action_type: 'register_payment' | 'register_expense' | 'register_transfer' | 'schedule_task';
  payload: Record<string, any>;
  status: ActionStatus;
  expires_at: string;
}

export interface CopilotChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  pendingAction?: PendingActionDTO | null;
  timestamp: string;
  receipt?: ReceiptData | null;
  quickAdjust?: boolean;
}

// --- Function Calling Args (10 Herramientas) ---
export interface GetCfoSummaryArgs {}
export interface QueryDossierArgs { business_identifier: string; }
export interface PreparePaymentArgs {
  business_id: string;
  amount: number;
  payment_method: PaymentMethod;
  extension_days?: number;
  is_partial?: boolean;
  remaining_amount?: number;
  remaining_due_date?: string;
  commitment_id?: string;
  notes?: string;
}
export interface PrepareExpenseArgs {
  account_code: string;
  category: ExpenseCategory;
  amount: number;
  description: string;
  related_business_id?: string;
}
export interface ScheduleTaskArgs {
  title: string;
  task_type: TaskType;
  due_date: string;
  due_time?: string;
  business_id?: string;
  priority?: PriorityLevel;
}
export interface QueryAgendaArgs { date_filter: 'today' | 'tomorrow' | 'this_week' | 'all_pending'; }
export interface CompleteTaskArgs { task_id: string; deliverable_key?: string; deliverable_status?: string; }
export interface PrepareCommitmentArgs { business_id: string; agreed_amount: number; agreed_date: string; notes: string; }
export interface PrepareTransferArgs { source_account_id: string; destination_account_id: string; amount: number; fee?: number; notes?: string; }
export interface GetNetworkGrowthArgs {}

// --- Evolution Webhook Payload ---
export interface EvolutionWebhookPayload {
  event: string;
  instance: string;
  data: {
    key: { remoteJid: string; fromMe: boolean; id: string; };
    pushName?: string;
    message?: {
      conversation?: string;
      extendedTextMessage?: { text: string };
      audioMessage?: { url?: string; mimetype?: string; seconds?: number };
      imageMessage?: { url?: string; mimetype?: string; caption?: string };
    };
    messageType?: string;
    messageTimestamp?: number;
    base64?: string;
  };
}
