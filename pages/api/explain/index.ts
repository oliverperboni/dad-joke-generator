import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  // Check if the request method is POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // The JSON body is available at req.body
    const { joke } = req.body;

    if (!joke) {
      return res.status(400).json({ error: 'Joke is required in the request body.' });
    }

    console.log("Received joke for explanation:", process.env.GEMINI_API_KEY!);
    // Initialize the Google Generative AI client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Explain this dad joke briefly and objectively: "${joke}"`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Send the JSON response
    return res.status(200).json({ explanation: text });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to explain joke." });
  }
}