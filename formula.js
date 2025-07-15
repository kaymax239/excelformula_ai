export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const userInput = req.body.formula;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API key not configured' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Eres un experto en Excel. Responde con una sola fórmula de Excel según la instrucción que reciba, en español o inglés. No expliques nada. Solo responde con la fórmula.',
          },
          {
            role: 'user',
            content: userInput,
          },
        ],
        temperature: 0.4,
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ error: data.error.message });
    }

    const result = data.choices?.[0]?.message?.content?.trim();
    res.status(200).json({ result: result || 'No se pudo generar una fórmula.' });
  } catch (error) {
    res.status(500).json({ error: 'Error al contactar OpenAI.' });
  }
}
