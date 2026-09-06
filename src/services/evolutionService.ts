/**
 * Servicio centralizado para comunicación saliente con WhatsApp mediante Evolution API v2.
 * Diseñado con fetch nativo, timeout controlado de 4s y tolerancia a fallos.
 */

export interface EvolutionSendTextOptions {
  delay?: number;
  linkPreview?: boolean;
}

export interface EvolutionServiceResult {
  success: boolean;
  messageId?: string;
  data?: unknown;
  error?: string;
}

export interface EvolutionApiSendResponse {
  key?: {
    id: string;
    remoteJid: string;
    fromMe: boolean;
  };
  status?: string;
  [key: string]: unknown;
}

/** Sanitiza números de teléfono asegurando el código de país (57 para Colombia) */
function sanitizePhoneNumber(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('3')) {
    cleaned = `57${cleaned}`;
  }
  return cleaned;
}

/** Obtiene la configuración de Evolution API desde las variables de entorno del servidor */
function getEvolutionConfig() {
  const apiUrl = process.env.EVOLUTION_API_URL?.replace(/\/+$/, '');
  const apiKey = process.env.EVOLUTION_API_KEY;
  const instanceName = process.env.EVOLUTION_INSTANCE_NAME;
  const ceoPhone = process.env.CEO_PHONE_NUMBER;

  return { apiUrl, apiKey, instanceName, ceoPhone };
}

/** Verifica si las variables de entorno de Evolution API están debidamente configuradas */
export function isEvolutionConfigured(): boolean {
  const { apiUrl, apiKey, instanceName } = getEvolutionConfig();
  return Boolean(apiUrl && apiKey && instanceName);
}

/**
 * Envía un mensaje de texto plano o con markdown básico por WhatsApp vía Evolution API v2.
 * Timeout controlado de 4000 ms para proteger el ciclo de respuesta.
 */
export async function sendWhatsAppMessage(
  phone: string,
  text: string,
  options: EvolutionSendTextOptions = {}
): Promise<EvolutionServiceResult> {
  const { apiUrl, apiKey, instanceName } = getEvolutionConfig();

  if (!apiUrl || !apiKey || !instanceName) {
    return { success: false, error: 'Evolution API no configurada en variables de entorno' };
  }

  const destinationNumber = sanitizePhoneNumber(phone);
  if (!destinationNumber) {
    return { success: false, error: 'Número de teléfono inválido' };
  }

  const url = `${apiUrl}/message/sendText/${encodeURIComponent(instanceName)}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: apiKey,
      },
      body: JSON.stringify({
        number: destinationNumber,
        text,
        delay: options.delay ?? 1200,
        linkPreview: options.linkPreview ?? true,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Error desconocido');
      return {
        success: false,
        error: `HTTP ${response.status}: ${errorText.slice(0, 150)}`,
      };
    }

    const json = (await response.json()) as EvolutionApiSendResponse;
    return {
      success: true,
      messageId: json.key?.id,
      data: json,
    };
  } catch (error: unknown) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === 'AbortError') {
      return { success: false, error: 'Timeout de 4 segundos superado en Evolution API' };
    }

    const message = error instanceof Error ? error.message : 'Error de conexión con Evolution API';
    return { success: false, error: message };
  }
}

/**
 * Despacha un mensaje directo al WhatsApp del CEO (Cristian).
 * Usado para Morning Briefing matutino, alertas críticas o confirmaciones de cobro.
 */
export async function notifyCeoWhatsApp(
  text: string,
  options?: EvolutionSendTextOptions
): Promise<EvolutionServiceResult> {
  const { ceoPhone } = getEvolutionConfig();

  if (!ceoPhone) {
    return { success: false, error: 'CEO_PHONE_NUMBER no configurado en el entorno' };
  }

  return sendWhatsAppMessage(ceoPhone, text, options);
}

export const evolutionService = {
  isConfigured: isEvolutionConfigured,
  sendMessage: sendWhatsAppMessage,
  notifyCeo: notifyCeoWhatsApp,
};

export default evolutionService;
