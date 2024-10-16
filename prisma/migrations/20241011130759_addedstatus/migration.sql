/*
  Warnings:

  - You are about to drop the column `timeLimit` on the `Challenge` table. All the data in the column will be lost.
  - The `status` column on the `Challenge` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Question` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `challengeId` on the `Question` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `Question` table. All the data in the column will be lost.
  - Added the required column `duration` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `creatorId` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `problemStatement` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "Question" DROP CONSTRAINT "Question_challengeId_fkey";

-- DropForeignKey
ALTER TABLE "TestCase" DROP CONSTRAINT "TestCase_questionId_fkey";

-- AlterTable
ALTER TABLE "Challenge" DROP COLUMN "timeLimit",
ADD COLUMN     "duration" INTEGER NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3),
DROP COLUMN "status",
ADD COLUMN     "status" "ChallengeStatus" NOT NULL DEFAULT 'NOT_STARTED';

-- AlterTable
ALTER TABLE "Question" DROP CONSTRAINT "Question_pkey",
DROP COLUMN "challengeId",
DROP COLUMN "content",
ADD COLUMN     "constraints" TEXT,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "inputFormat" TEXT,
ADD COLUMN     "outputFormat" TEXT,
ADD COLUMN     "problemStatement" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Question_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Question_id_seq";

-- AlterTable
ALTER TABLE "TestCase" ALTER COLUMN "questionId" SET DATA TYPE TEXT;

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "challengeId" INTEGER NOT NULL,
    "questionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "passedTestCases" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChallengeQuestions" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChallengeQuestions_AB_unique" ON "_ChallengeQuestions"("A", "B");

-- CreateIndex
CREATE INDEX "_ChallengeQuestions_B_index" ON "_ChallengeQuestions"("B");

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestCase" ADD CONSTRAINT "TestCase_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_challengeId_fkey" FOREIGN KEY ("challengeId") REFERENCES "Challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeQuestions" ADD CONSTRAINT "_ChallengeQuestions_A_fkey" FOREIGN KEY ("A") REFERENCES "Challenge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChallengeQuestions" ADD CONSTRAINT "_ChallengeQuestions_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
