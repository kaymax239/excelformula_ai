export default async function handler(req, res) {
  if (req.method !== \"POST\") {
    return res.status(405).json({ error: \"Method not allowed\" });
  }

  const userMessage = req.body.message;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch(\"https://api.openai.com/v1/chat/completions\", {
      method: \"POST\",
      headers: {
        \"Content-Type\": \"application/json\",
        \"Authorization\": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: \"gpt-4\",
        messages: [
          { role: \"system\", content: \"Eres un experto en Excel. Responde con una sola fórmula de Excel que cumpla con lo que se pide. No expliques, solo da la fórmula.\" },
          { role: \"user\", content: userMessage }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    const formula = data.choices?.[0]?.message?.content || \"No se pudo generar una fórmula.\";
    res.status(200).json({ formula });
  } catch (error) {
    res.status(500).json({ error: \"Error al contactar con OpenAI\" });
  }
}
