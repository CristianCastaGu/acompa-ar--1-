import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // 1. Verificación de método
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 2. Inicialización de Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", 
    });

    // 3. Extracción de datos del body
    // Pueden venir messages/emotionalState (del chat) o prompt/image (del analizador)
    const { messages, emotionalState, prompt, image } = req.body;

    // ==========================================
    // CASO A: Análisis de Imagen
    // ==========================================
    if (image && prompt) {
      // Extraer el mimeType y la data en base64 limpia
      const mimeTypeMatch = image.match(/data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+).*,/);
      
      if (!mimeTypeMatch) {
        return res.status(400).json({ error: "Formato de imagen inválido. Debe ser base64." });
      }

      const mimeType = mimeTypeMatch[1];
      const base64Data = image.split(",")[1];

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType
        }
      };

      // Enviamos el array con el texto y la imagen
      const result = await model.generateContent([prompt, imagePart]);
      const response = await result.response;

      return res.status(200).json({ reply: response.text() });
    }

    // ==========================================
    // CASO B: Conversación (Chat)
    // ==========================================
    if (messages) {
      const conversation = messages
        .map(m => `${m.role}: ${m.text}`)
        .join("\n");

      const fullPrompt = `
Emotional state: ${emotionalState || "Neutral"}

${conversation}
AI:
`;

      const result = await model.generateContent(fullPrompt);
      const response = await result.response;

      return res.status(200).json({ reply: response.text() });
    }

    // ==========================================
    // CASO C: Payload inválido
    // ==========================================
    return res.status(400).json({ error: "Faltan parámetros requeridos (messages o image/prompt)" });

  } catch (err) {
    console.error("Error en Gemini API:", err);
    return res.status(500).json({ error: "Gemini failed" });
  }
}