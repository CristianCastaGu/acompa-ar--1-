export async function sendMessage(messages, emotionalState) {
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

  const data = await res.json();
  return data.reply;
}

export async function sendImage({ prompt, image }) {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt,
      image
    }),
  });

  const text = await res.text();

  try {
    const data = JSON.parse(text);
    return data.reply;
  } catch {
    console.error("Respuesta inválida:", text);
    throw new Error("El servidor no devolvió JSON válido");
  }
}