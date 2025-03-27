// This is your Vercel serverless function (Node.js)
// Save this as `api/chat.js` when setting up your Vercel project

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST requests allowed' });
  }

  const { message } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: "You are a helpful, friendly assistant for Gotham Production Studios. Answer in a conversational tone." },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm not sure how to answer that!";
    res.status(200).json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
