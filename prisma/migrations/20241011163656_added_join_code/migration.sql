-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "joinCode" TEXT NOT NULL DEFAULT substring((random() * 1000000)::int::text, 1, 6);
