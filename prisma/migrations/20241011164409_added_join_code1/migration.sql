/*
  Warnings:

  - The primary key for the `Challenge` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "_ChallengeQuestions" DROP CONSTRAINT "_ChallengeQuestions_A_fkey";

-- DropForeignKey
ALTER TABLE "_ParticipatedChallenges" DROP CONSTRAINT "_ParticipatedChallenges_A_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP CONSTRAINT "Challenge_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "joinCode" SET DEFAULT substring((random() * 1000000)::int::text, 1, 6),
ADD CONSTRAINT "Challenge_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Challenge_id_seq";

-- AlterTable
ALTER TABLE "Submission" ALTER COLUMN "challengeId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ChallengeQuestions" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_ParticipatedChallenges" ALTER COLUMN "A" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ParticipatedChallenges" ADD CONSTRAINT "_ParticipatedChallenges_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeQuestions" ADD CONSTRAINT "_ChallengeQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
