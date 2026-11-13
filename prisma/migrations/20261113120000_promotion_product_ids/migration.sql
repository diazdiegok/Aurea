-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN "productIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
