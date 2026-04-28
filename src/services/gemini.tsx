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