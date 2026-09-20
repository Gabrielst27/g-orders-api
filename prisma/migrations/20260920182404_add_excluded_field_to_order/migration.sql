/*
  Warnings:

  - Added the required column `EXCLUDED` to the `ORDERS` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ORDERS" ADD COLUMN     "EXCLUDED" BOOLEAN NOT NULL;
