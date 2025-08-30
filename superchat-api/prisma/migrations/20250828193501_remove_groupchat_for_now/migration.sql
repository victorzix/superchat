/*
  Warnings:

  - You are about to drop the `GroupChat` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AdminUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."GroupChat" DROP CONSTRAINT "GroupChat_chatId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AdminUsers" DROP CONSTRAINT "_AdminUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_AdminUsers" DROP CONSTRAINT "_AdminUsers_B_fkey";

-- DropTable
DROP TABLE "public"."GroupChat";

-- DropTable
DROP TABLE "public"."_AdminUsers";
