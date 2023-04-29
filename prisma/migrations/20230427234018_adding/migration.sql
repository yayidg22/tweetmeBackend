/*
  Warnings:

  - Added the required column `created_date` to the `Posts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Posts" ADD COLUMN     "created_date" TIMESTAMP(3) NOT NULL;
