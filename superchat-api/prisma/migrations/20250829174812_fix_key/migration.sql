/*
  Warnings:

  - You are about to drop the column `encryptedPrivateKey` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `keySalt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "encryptedPrivateKey",
DROP COLUMN "keySalt",
ADD COLUMN     "privateKey" TEXT;
