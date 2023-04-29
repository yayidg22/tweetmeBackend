/*
  Warnings:

  - A unique constraint covering the columns `[alternalName]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "alternalName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_alternalName_key" ON "User"("alternalName");
