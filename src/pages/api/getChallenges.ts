import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, ChallengeStatus } from '@prisma/client'; // Import ChallengeStatus from Prisma
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]'; // Adjust the import path if necessary

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { type } = req.query; // Get the query parameter

  try {
    const userId = session.user.id;

    // Determine the challenge statuses based on the query parameter
    let statuses: ChallengeStatus[];
    if (type === 'active') {
      statuses = [ChallengeStatus.NOT_STARTED, ChallengeStatus.IN_PROGRESS];
    } else if (type === 'past') {
      statuses = [ChallengeStatus.COMPLETED, ChallengeStatus.CANCELLED];
    } else {
      return res.status(400).json({ error: 'Invalid type query parameter' });
    }

    const challenges = await prisma.challenge.findMany({
      where: {
        creatorId: userId, 
        status: {
          in: statuses,
        },
      },
      include: {
        questions: true, 
      },
    });

    return res.status(200).json({ challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
