// pages/api/jokes/[teamName]/new.ts - Alternative approach
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';
import { getUserIdFromCookies } from '@/lib/cookies';
import { getGenAiModel } from '@/lib/genai';
import { shouldTrollTheUser } from '@/lib/troll';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { teamName } = req.query;
  if (typeof teamName !== "string") {
    return res.status(400).json({ error: "Team name must be a string" });
  }

  try {
    // Identifica usuário
    const userId = getUserIdFromCookies(req, res);

    // Decide qual piada usar
    let newJoke: string | null = null;
    if (shouldTrollTheUser(userId)) {
      try {
        console.log("Trolling user:", userId);
        newJoke = await fetchTrollJoke();
      } catch (error) {
        console.error("Error fetching troll joke, falling back to normal joke:", error);
        newJoke = await fetchDadJoke();
      }
    }
    if (!newJoke) {
      console.log("Fetching normal dad joke for user:", userId);
      newJoke = await fetchDadJoke();
    }

    // Busca time atual
    const team = await prisma.team.findUnique({ where: { name: teamName } });

    // Atualiza ou cria
    const updatedTeam = await prisma.team.upsert({
      where: { name: teamName },
      update: {
        yesterdayJokeText: team?.currentJokeText ?? null,
        currentJokeText: newJoke,
        lastGeneratedBy: userId,
      },
      create: {
        name: teamName,
        lastGeneratedBy: userId,
        currentJokeText: newJoke,
        yesterdayJokeText: null,
      },
    });

    return res.status(200).json({
      currentJoke: updatedTeam.currentJokeText,
      yesterdayJoke: updatedTeam.yesterdayJokeText,
    });
  } catch (error: any) {
    console.error("Failed to fetch new joke and update team:", error);

    if (error.message.includes("external API")) {
      return res.status(502).json({ error: "Failed to get joke from Dad Jokes API" });
    }

    return res.status(500).json({ error: "Failed to process new joke" });
  }
}

const fetchDadJoke = async (): Promise<string> => {
  const response = await fetch("https://icanhazdadjoke.com/", {
    headers: { Accept: "application/json" },
  });

  if (!response.ok) {
    throw new Error("external API error");
  }

  const data = await response.json();
  return data.joke;
};

const fetchTrollJoke = async (): Promise<string | null> => {
  try {
    const model = getGenAiModel();
    const trollPrompt = `generate a nonsense small dad joke. 
      The joke must not make sense, it should just be a weird but readable phrase. Must be a unique sentence`;

    const result = await model.generateContent(trollPrompt);
    return result?.response?.text() ?? null;
  } catch (error) {
    console.error("Failed to generate troll joke:", error);
    return null;
  }
};
