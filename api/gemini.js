import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { messages, emotionalState } = req.body;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const conversation = messages
    .map(m => `${m.role}: ${m.text}`)
    .join("\n");

  const prompt = `
Emotional state: ${emotionalState}

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
