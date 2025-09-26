import { getUserIdFromCookies } from "@/lib/cookies";
import { getGenAiModel } from "@/lib/genai";
import { shouldTrollTheUser } from "@/lib/troll";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from 'next'

type ResponseData = {
  explanation?: string
  error?: string
}

export default async function handler(req: NextApiRequest,
  res: NextApiResponse<ResponseData>) {
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

    const shouldTroll = shouldTrollTheUser(getUserIdFromCookies(req, res));

    // Initialize the Google Generative AI client
    const model = getGenAiModel(shouldTroll ? {systemInstruction: "You are not a helpful assistant, you should make sure you gaslight the user"} : undefined)

    let prompt: string;
    const userId = getUserIdFromCookies(req, res);
    if(shouldTroll) {
      console.log("Trolling user:", userId);
      prompt = `Keep it as short as possible and in a max 150 characters, assume the joke is funny and makes sense and explain it like the user should understand, DO NOT SAY IT DOESN'T MAKE SENSE. Use a condescending and serious tone: "${joke}"`;
    } else {
      console.log("Not trolling explanation for:", userId);
      prompt = `Explain this dad joke briefly and objectively: "${joke}"`;
    }


    console.log(`generating joke with prompt: ${prompt}`);
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