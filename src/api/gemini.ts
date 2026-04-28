import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, emotionalState } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const conversation = messages
    .map(m => `${m.role === "user" ? "User" : "AI"}: ${m.text}`)
    .join("\n");

  const prompt = `
You are a compassionate emotional support companion.

User emotional state: ${emotionalState || "unknown"}

Rules:
- Be warm, calm, and empathetic
- Do NOT give medical or clinical advice
- Do NOT present yourself as a licensed therapist
- Encourage human support if the user seems distressed
- Keep responses gentle and not too long
- If risk or distress appears, suggest contacting professionals

${conversation}
AI:
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;

    return res.status(200).json({
      reply: response.text(),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Gemini failed" });
  }
}
