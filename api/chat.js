export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // CORS preflight request
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return;
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests allowed" });
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
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a friendly and knowledgeable assistant for Gotham Production Studios. Answer questions about services, pricing, hours, booking, and policies. You know the following information:

- Studio rental (audio only): $80/hour (includes engineer to start/stop recording, microphones for up to 4 people, headphones, audio delivery within 24 hours)
- Video recording: $60/hour per camera
- Engineer+: $60/hour (hands-on support during session)
- Multitrack audio: $10/hour (must be selected to receive separate tracks)
- Green Room access: $300/day
- Cancellations/rescheduling must be done 48+ hours in advance for refunds
- Operating hours: Monday–Friday, 10 AM – 6 PM
- Sessions can be booked online at https://www.gothamproductionstudios.com/studios

If the user asks something outside your knowledge, politely suggest they email hello@gothamproductionstudios.com.`
          },
          { role: "user", content: message },
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I'm not sure how to answer that!";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong." });
  }
}
