import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  if (!session?.user) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'POST') {
    const { title, description, duration, questions } = req.body; // Include duration

    try {
      // Create a new challenge
      const challenge = await prisma.challenge.create({
        data: {
          title,
          description,
          creatorId: session.user.id, // Use creatorId instead of userId
          duration, // Include duration
          questions: {
            create: questions.map((question: any) => ({
              title: question.title,
              problemStatement: question.problemStatement,
              inputFormat: question.inputFormat,
              outputFormat: question.outputFormat,
              constraints: question.constraints,
              creatorId: session.user.id, // Add creatorId for questions
              testCases: {
                create: question.testCases.map((testCase: any) => ({
                  input: testCase.input,
                  expected: testCase.expectedOutput,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: {
              testCases: true, // Include test cases in the response
            },
          },
        },
      });

      return res.status(201).json({ challenge });
    } catch (error) {
      console.error('Error creating challenge:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}
