/*
  Warnings:

  - You are about to drop the column `description` on the `permissions` table. All the data in the column will be lost.
  - Added the required column `content` to the `permissions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "permissions" RENAME COLUMN "description" TO "content";
