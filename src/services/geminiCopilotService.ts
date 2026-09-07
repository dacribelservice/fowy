/**
 * Orquestador de inferencia multimodal Gemini 1.5 Flash consumido directamente vía REST API nativo.
 * Soporta Function Calling AUTO con 10 tools, audio nativo y visión OCR efímera 100% en memoria RAM.
 */

export interface CopilotMediaPart {
  mimeType: string;
  data: string; // Base64 sin encabezados data:...;base64,
}

export interface CopilotMessageInput {
  role: 'user' | 'model';
  text?: string;
  media?: CopilotMediaPart;
  functionCall?: { name: string; args: Record<string, any> };
  functionResponse?: { name: string; response: Record<string, any> };
}

export interface CopilotInferenceResult {
  text: string;
  functionCall?: { name: string; args: Record<string, any> };
  error?: string;
}

const SYSTEM_INSTRUCTION = `ERES EL AGENTE FOWY: CFO Y SECRETARIA EJECUTIVA PERSONAL DE CRISTIAN (CEO DE FOWY).
Tu misión es maximizar rentabilidad, auditar gastos OPEX, coordinar la agenda diaria de visitas y mandados, y asegurar cobros justos sin dejar restaurantes a medias.

REGLAS DE ORO:
1. ESTRUCTURA DE RESPUESTA: DATO + DIAGNÓSTICO + ACCIÓN RECOMENDADA. Nunca des números sin conclusión ejecutiva.
2. DIEZMO: 10% de la Utilidad Neta Real tras deducir todos los gastos OPEX. Si la utilidad neta es <= 0, el Diezmo es $0 COP.
3. OPEX & VIÁTICOS: Categorías: viaticos_calle, transporte_movilidad, material_negocios, tecnologia_fija, salario_ceo, otros. Si Cristian dicta gastos de calle generales, asígnalos a viaticos_calle sin pedir desglose café por café. Si viáticos > 25% del recaudo, emite alerta de fuga de caja.
4. SALUD FINANCIERA: Monitorea CPI Onboarding ($35k base), DSO de cartera (>5 días es alerta de dinero estancado en calle), Runway (>3 meses) y Margen Operativo %.
5. ANÁLISIS DE CRECIMIENTO: Usa get_network_growth_summary para el pulso macro de la red (% MoM). En query_business_dossier analiza orders_mom_pct y orders_wow_pct: alerta Churn si cae > -10%, argumento de renovación si crece > +15%.
6. CONFIRMACIÓN EN DOS PASOS: PROHIBIDO ejecutar pagos, gastos, compromisos o transferencias directamente. Invoca prepare_* para generar tarjetas pre-confirmadas.
7. MULTIMODALIDAD EN RAM: Lee comprobantes de Nequi/Daviplata o tickets de imprenta por OCR y extrae valores con exactitud. Si un audio de la calle es dudoso, pide confirmación sin inventar cifras.
8. MONEDA: Pesos Colombianos ($50.000 COP). Tono directivo, leal y respetuoso.`;

const COPILOT_TOOLS = [
  {
    functionDeclarations: [
      { name: 'get_cfo_financial_summary', description: 'Consulta balance general de caja, P&L, diezmo y KPIs de salud financiera.', parameters: { type: 'OBJECT', properties: {} } },
      { name: 'query_business_dossier', description: 'Consulta expediente 360°, entregables y % de crecimiento WoW/MoM de un restaurante.', parameters: { type: 'OBJECT', properties: { business_identifier: { type: 'STRING', description: 'Nombre comercial, slug o ID' } }, required: ['business_identifier'] } },
      { name: 'prepare_payment_action', description: 'Prepara tarjeta de confirmación para cobro de membresía o abono parcial.', parameters: { type: 'OBJECT', properties: { business_id: { type: 'STRING' }, amount: { type: 'NUMBER' }, payment_method: { type: 'STRING', enum: ['nequi', 'daviplata', 'bancolombia', 'cash', 'other'] }, extension_days: { type: 'INTEGER' }, is_partial: { type: 'BOOLEAN' }, remaining_amount: { type: 'NUMBER' }, remaining_due_date: { type: 'STRING' }, commitment_id: { type: 'STRING' }, notes: { type: 'STRING' } }, required: ['business_id', 'amount', 'payment_method'] } },
      { name: 'prepare_expense_action', description: 'Prepara tarjeta de egreso operativo OPEX con imputación de cuenta.', parameters: { type: 'OBJECT', properties: { account_code: { type: 'STRING', enum: ['nequi', 'daviplata', 'bancolombia', 'cash'] }, category: { type: 'STRING', enum: ['viaticos_calle', 'transporte_movilidad', 'material_negocios', 'tecnologia_fija', 'salario_ceo', 'otros'] }, amount: { type: 'NUMBER' }, description: { type: 'STRING' }, related_business_id: { type: 'STRING' } }, required: ['account_code', 'category', 'amount', 'description'] } },
      { name: 'schedule_secretary_task', description: 'Agenda una visita o mandado en la agenda del CEO.', parameters: { type: 'OBJECT', properties: { title: { type: 'STRING' }, task_type: { type: 'STRING', enum: ['visita', 'impresion_volantes', 'fotos', 'reunion', 'cobro', 'otro'] }, due_date: { type: 'STRING' }, due_time: { type: 'STRING' }, business_id: { type: 'STRING' }, priority: { type: 'STRING', enum: ['alta', 'media', 'baja'] } }, required: ['title', 'task_type', 'due_date'] } },
      { name: 'query_ceo_agenda', description: 'Consulta la agenda de tareas pendientes del CEO.', parameters: { type: 'OBJECT', properties: { date_filter: { type: 'STRING', enum: ['today', 'tomorrow', 'this_week', 'all_pending'] } }, required: ['date_filter'] } },
      { name: 'complete_secretary_task', description: 'Marca tarea completada y sincroniza mochila deliverables JSONB.', parameters: { type: 'OBJECT', properties: { task_id: { type: 'STRING' }, deliverable_key: { type: 'STRING' }, deliverable_status: { type: 'STRING' } }, required: ['task_id'] } },
      { name: 'prepare_commitment_action', description: 'Registra un acuerdo verbal de pago pactado con un negocio.', parameters: { type: 'OBJECT', properties: { business_id: { type: 'STRING' }, agreed_amount: { type: 'NUMBER' }, agreed_date: { type: 'STRING' }, notes: { type: 'STRING' } }, required: ['business_id', 'agreed_amount', 'agreed_date'] } },
      { name: 'prepare_account_transfer_action', description: 'Prepara traspaso entre cuentas sin afectar P&L.', parameters: { type: 'OBJECT', properties: { source_account_id: { type: 'STRING' }, destination_account_id: { type: 'STRING' }, amount: { type: 'NUMBER' }, fee: { type: 'NUMBER' }, notes: { type: 'STRING' } }, required: ['source_account_id', 'destination_account_id', 'amount'] } },
      { name: 'get_network_growth_summary', description: 'Consulta pulso macroeconómico de toda la red FOWY (% MoM, % WoW, % DoD).', parameters: { type: 'OBJECT', properties: {} } },
    ],
  },
];

/**
 * Ejecuta inferencia en Gemini 1.5 Flash consumiendo directamente la REST API oficial con fetch nativo.
 */
export async function generateCopilotResponse(
  messages: CopilotMessageInput[],
  liveContext?: Record<string, unknown>
): Promise<CopilotInferenceResult> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return { text: '', error: 'GEMINI_API_KEY no configurada en variables de entorno' };
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;
  const systemText = liveContext
    ? `${SYSTEM_INSTRUCTION}\n\n[CONTEXTO OPERATIVO EN VIVO]:\n${JSON.stringify(liveContext)}`
    : SYSTEM_INSTRUCTION;

  const contents = messages.map((msg) => {
    const parts: any[] = [];
    if (msg.media) {
      parts.push({
        inlineData: {
          mimeType: msg.media.mimeType,
          data: msg.media.data,
        },
      });
    }
    if (msg.text) parts.push({ text: msg.text });
    if (msg.functionCall) parts.push({ functionCall: msg.functionCall });
    if (msg.functionResponse) {
      parts.push({
        functionResponse: {
          name: msg.functionResponse.name,
          response: { content: msg.functionResponse.response },
        },
      });
    }
    return { role: msg.role, parts };
  });

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemText }] },
        contents,
        tools: COPILOT_TOOLS,
        toolConfig: { functionCallingConfig: { mode: 'AUTO' } },
        generationConfig: {
          temperature: 0.1,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      }),
    });

    if (!response.ok) {
      const err = await response.text().catch(() => 'Error desconocido');
      return { text: '', error: `Google AI HTTP ${response.status}: ${err.slice(0, 150)}` };
    }

    const data = await response.json();
    const candidateParts = data.candidates?.[0]?.content?.parts || [];
    let text = '';
    let functionCall: { name: string; args: Record<string, any> } | undefined;

    for (const part of candidateParts) {
      if (part.text) text += part.text;
      if (part.functionCall) functionCall = part.functionCall;
    }

    return { text, functionCall };
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : 'Error inesperado conectando con Gemini';
    return { text: '', error: msg };
  }
}

export const geminiCopilotService = {
  generateResponse: generateCopilotResponse,
};

export default geminiCopilotService;
