import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { challengeCode } = req.body;

  try {
    // Find the challenge using the unique join code
    const challenge = await prisma.challenge.findUnique({
      where: { joinCode: challengeCode as string }, // Ensure challengeCode matches the unique field
    });

    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }

    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await prisma.challenge.update({
      where: { id: challenge.id },
      data: {
        participants: { connect: { id: userId } },
      },
    });

    res.status(200).json({ challengeId: challenge.id, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Something went wrong' });
  }
}
