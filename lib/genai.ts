import { GoogleGenerativeAI, ModelParams } from "@google/generative-ai";



export const getGenAiModel = (options?: Omit<ModelParams, 'model'>) => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    ...(options?.systemInstruction ? { systemInstruction: options.systemInstruction } : {}),
  });

  return model;
};