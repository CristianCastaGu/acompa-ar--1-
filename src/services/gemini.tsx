// src/services/gemini.tsx

export type ChatMessage = {
  role: 'ai' | 'user';
  text: string;
  type?: 'text' | 'audio';
};

// Esta es la función que verifica si la API key está configurada
export const isAIAvailable = () => {
  // En el cliente, esto suele ser true si no hay errores de red, 
  // pero podemos simularlo o checkear una variable de entorno si fuera necesario.
  return true; 
};

export async function sendMessage(messages: ChatMessage[], emotionalState: string | null) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messages,
      emotionalState,
    }),
  });

  if (!res.ok) throw new Error("Error en la comunicación con la IA");
  const data = await res.json();
  return data.reply;
}

// Creamos un alias para sendPatientMessage por si lo usas en otros lados
export const sendPatientMessage = sendMessage;

export async function sendImage({ prompt, image }: { prompt: string, image: string }) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt, image }),
  });

  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data.reply;
  } catch {
    throw new Error("El servidor no devolvió JSON válido");
  }
}
