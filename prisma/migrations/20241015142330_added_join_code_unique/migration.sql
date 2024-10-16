/*
  Warnings:

  - A unique constraint covering the columns `[joinCode]` on the table `Challenge` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Challenge" ALTER COLUMN "joinCode" SET DEFAULT substring((random() * 1000000)::int::text, 1, 6);

-- CreateIndex
CREATE UNIQUE INDEX "Challenge_joinCode_key" ON "Challenge"("joinCode");
