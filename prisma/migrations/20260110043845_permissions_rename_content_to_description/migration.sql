/*
  Warnings:

  - You are about to drop the column `content` on the `permissions` table. All the data in the column will be lost.
  - Added the required column `description` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "permissions" RENAME COLUMN "content" TO "description";
