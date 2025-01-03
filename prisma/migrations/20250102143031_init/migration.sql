/*
  Warnings:

  - You are about to drop the column `totalCost` on the `Transaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "totalCost";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "imageUrl" TEXT;
