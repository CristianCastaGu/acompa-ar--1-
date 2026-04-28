/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string;

if (!API_KEY) {
  console.warn('[ACOMPAÑAR] VITE_GEMINI_API_KEY no está configurada. Las funciones de IA no estarán disponibles.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODEL_NAME = 'gemini-2.0-flash';

// ─── System Prompts ────────────────────────────────────────────────

const PATIENT_SYSTEM_PROMPT = `Eres un acompañante empático de cuidado paliativo en la plataforma ACOMPAÑAR.
Tu rol es escuchar, validar emociones y acompañar al paciente con calidez humana.
- Habla en español colombiano cálido y cercano.
- Usa un tono reconfortante, nunca clínico ni frío.
- No des diagnósticos ni consejos médicos.
- Puedes sugerir guardar recuerdos para la familia.
- Responde de forma breve (2-4 oraciones máximo).
- Si el paciente menciona dolor severo o pensamientos de autolesión, sugiere contactar al equipo médico.
- El paciente se llama Carlos García, tiene 68 años y está en cuidado paliativo.`;

const FAMILY_SYSTEM_PROMPT = `Eres un guía de apoyo emocional para familias de pacientes en cuidado paliativo en la plataforma ACOMPAÑAR.
- Habla en español colombiano cálido y cercano.
- Ofrece orientación emocional, no médica.
- Valida sus sentimientos de agotamiento, miedo o tristeza.
- Sugiere estrategias de autocuidado para cuidadores.
- Si mencionan síntomas clínicos del paciente, recomienda hablar con el equipo médico.
- Responde de forma breve (2-4 oraciones máximo).
- La familia cuida a Carlos García, paciente de 68 años en cuidado paliativo.
- IMPORTANTE: Siempre recuerda que eres apoyo emocional, no un sustituto del médico.`;

const MEDICAL_ANALYSIS_PROMPT = `Eres un asistente de análisis clínico en la plataforma ACOMPAÑAR para cuidado paliativo.
Analiza la siguiente descripción del estado observado del paciente y proporciona:
1. Expresión facial estimada (ej: Tranquilidad, Fatiga, Malestar, Dolor)
2. Nivel de malestar estimado en escala 1-10
3. Recomendación breve (1-2 oraciones)
Responde en español, de forma concisa y profesional.
NOTA: Como no puedes ver imágenes reales en este contexto, basa tu análisis en la información textual proporcionada.`;

// ─── Chat del Paciente ─────────────────────────────────────────────

export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Sanitizes chat history for Gemini API compatibility:
 * - Must start with a 'user' message
 * - Must alternate between 'user' and 'model'
 * - No consecutive same-role messages
 */
function sanitizeHistory(history: ChatMessage[]): ChatMessage[] {
  if (history.length === 0) return [];

  const sanitized: ChatMessage[] = [];

  for (const msg of history) {
    const lastRole = sanitized.length > 0 ? sanitized[sanitized.length - 1].role : null;

    // Skip if same role as previous (merge or skip)
    if (msg.role === lastRole) {
      // Merge text into previous message
      sanitized[sanitized.length - 1].parts[0].text += '\n' + msg.parts[0].text;
      continue;
    }

    sanitized.push({ ...msg, parts: [{ text: msg.parts[0].text }] });
  }

  // Gemini requires history to start with 'user'
  // Drop leading 'model' messages
  while (sanitized.length > 0 && sanitized[0].role === 'model') {
    sanitized.shift();
  }

  // Must have even number of messages (user/model pairs) for valid history
  if (sanitized.length % 2 !== 0) {
    sanitized.pop();
  }

  return sanitized;
}

/** Parse API errors into user-friendly messages */
function handleAIError(error: unknown, context: string): string {
  const msg = error instanceof Error ? error.message : String(error);
  console.error(`[ACOMPAÑAR] ${context}:`, msg);
  
  if (msg.includes('429') || msg.includes('quota') || msg.includes('Too Many Requests')) {
    return '⏳ Se alcanzó el límite de solicitudes por minuto. Espera unos 20 segundos e intenta de nuevo.';
  }
  if (msg.includes('API_KEY') || msg.includes('401') || msg.includes('403')) {
    return '🔑 Error de autenticación con la API. Verifica tu clave en el archivo .env.';
  }
  if (msg.includes('network') || msg.includes('fetch')) {
    return '🌐 Sin conexión a internet. Verifica tu red e intenta de nuevo.';
  }
  return 'Lo siento, tuve un problema para responder. ¿Puedes intentar de nuevo en unos segundos?';
}

export async function sendPatientMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
      systemInstruction: PATIENT_SYSTEM_PROMPT,
    });

    const cleanHistory = sanitizeHistory(history);

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    return handleAIError(error, 'Error en chat del paciente');
  }
}

// ─── Chat Familiar ─────────────────────────────────────────────────

export async function sendFamilyMessage(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
      systemInstruction: FAMILY_SYSTEM_PROMPT,
    });

    const cleanHistory = sanitizeHistory(history);

    const chat = model.startChat({
      history: cleanHistory,
    });

    const result = await chat.sendMessage(userMessage);
    const response = result.response;
    return response.text();
  } catch (error) {
    return handleAIError(error, 'Error en chat familiar');
  }
}

// ─── Análisis Visual Médico ────────────────────────────────────────

export async function analyzeFacialExpression(
  contextDescription: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
      systemInstruction: MEDICAL_ANALYSIS_PROMPT,
    });

    const prompt = `Analiza el estado del paciente basándote en la siguiente observación clínica: "${contextDescription || 'Paciente en reposo, expresión facial neutra, ojos abiertos, respiración pausada.'}"`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('[ACOMPAÑAR] Error en análisis facial:', error);
    return 'No se pudo completar el análisis. Intente de nuevo o registre la observación manualmente.';
  }
}

// ─── Generación de Narrativa para Álbum ────────────────────────────

export async function generatePhotoNarrative(
  photoContext: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
    });

    const prompt = `Eres un escritor cálido y empático que ayuda a preservar memorias de vida para un paciente en cuidado paliativo.
Genera una narrativa corta (3-4 oraciones) en español colombiano para una foto del álbum de vida del paciente Carlos García.
Contexto de la foto: "${photoContext}"
La narrativa debe ser en primera persona, emotiva pero esperanzadora, como si Carlos la contara.`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('[ACOMPAÑAR] Error generando narrativa:', error);
    return 'No se pudo generar la narrativa en este momento. Intente de nuevo.';
  }
}

// ─── Generación de Cuento desde Foto ───────────────────────────────

export async function generatePhotoStory(
  photoContext: string,
  narrative: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: MODEL_NAME,
      safetySettings,
    });

    const prompt = `Eres un narrador cálido. Convierte esta memoria en un cuento corto narrado en primera persona por Carlos García, un paciente de 68 años.
Contexto de la foto: "${photoContext}"
Narrativa base: "${narrative}"
Escribe un cuento de 4-6 oraciones en español colombiano, emotivo, con detalles sensoriales (olores, sonidos, colores).
Que empiece como: "Era un día de..." o "Recuerdo que..."`;

    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('[ACOMPAÑAR] Error generando cuento:', error);
    return 'No se pudo generar el cuento en este momento. Intente de nuevo.';
  }
}

export function isAIAvailable(): boolean {
  return !!API_KEY;
}
