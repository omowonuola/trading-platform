/*
  Warnings:

  - You are about to drop the column `discountAmount` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `discountType` on the `Deal` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "discountAmount",
DROP COLUMN "discountType",
ADD COLUMN     "discount" JSONB;
