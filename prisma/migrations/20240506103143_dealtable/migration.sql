/*
  Warnings:

  - The `status` column on the `Deal` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DealStatus" AS ENUM ('sold', 'available');

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "status",
ADD COLUMN     "status" "DealStatus" NOT NULL DEFAULT 'available';
