/*
  Warnings:

  - You are about to drop the column `virtualBalance` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "virtualBalance",
ADD COLUMN     "salesCount" INTEGER NOT NULL DEFAULT 0;
