import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { challengeId } = req.query; 

  if (req.method === 'GET') {
    try {
      const challenge = await prisma.challenge.findUnique({
        where: { id: String(challengeId) },
        include: {
          questions: {
            include: {
              testCases: true,
            },
          },
          participants: true, 
        },
      });

      if (!challenge) {
        return res.status(404).json({ error: 'Challenge not found' });
      }

      return res.status(200).json(challenge);
    } catch (error) {
      console.error('Error fetching challenge:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
