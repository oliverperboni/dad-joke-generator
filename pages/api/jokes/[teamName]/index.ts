// pages/api/jokes/[teamName]/index.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma'; 

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  const { teamName } = req.query;

  if (typeof teamName !== 'string') {
    return res.status(400).json({ error: 'Team name must be a string' });
  }

  if (req.method === 'GET') {
    try {
      const team = await prisma.team.findUnique({
        where: { name: teamName },
      });

      res.status(200).json({
        currentJoke: team?.currentJokeText || null, // Se o time não existe, retorna nulo para as piadas
        yesterdayJoke: team?.yesterdayJokeText || null,
      });

    } catch (error) {
      console.error('Failed to fetch jokes for team:', error);
      res.status(500).json({ error: 'Failed to fetch jokes' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}