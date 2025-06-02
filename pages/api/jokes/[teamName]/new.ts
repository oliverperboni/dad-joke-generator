// pages/api/jokes/[teamName]/new.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; // Ajuste o caminho se necessário

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { teamName } = req.query;

  if (typeof teamName !== 'string') {
    return res.status(400).json({ error: 'Team name must be a string' });
  }

  if (req.method === 'POST') {
    try {
      // 1. Buscar uma nova piada da API externa
      const dadJokeResponse = await fetch("https://icanhazdadjoke.com/", {
        headers: { Accept: "application/json" },
      });

      if (!dadJokeResponse.ok) {
        throw new Error("Failed to fetch new dad joke from external API");
      }
      const dadJokeData = await dadJokeResponse.json();
      const newExternalJoke = dadJokeData.joke;

      // 2. Encontrar o time ou criar se não existir (upsert)
      const team = await prisma.team.upsert({
        where: { name: teamName },
        update: {}, 
        create: { name: teamName },
      });

      // 3. Atualizar as piadas do time
      const updatedTeam = await prisma.team.update({
        where: { name: teamName },
        data: {
          yesterdayJokeText: team.currentJokeText, // A antiga piada atual vira a de ontem
          currentJokeText: newExternalJoke,       // A nova piada externa é a atual
        },
      });

      res.status(200).json({
        currentJoke: updatedTeam.currentJokeText,
        yesterdayJoke: updatedTeam.yesterdayJokeText
      });

    } catch (error :any ) {
      console.error('Failed to fetch new joke and update team:', error);
      if (error.message.includes("external API")) {
        res.status(502).json({ error: 'Failed to get joke from Dad Jokes API' });
      } else {
        res.status(500).json({ error: 'Failed to process new joke' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}