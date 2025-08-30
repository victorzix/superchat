-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "encryptedPrivateKey" TEXT,
ADD COLUMN     "keySalt" TEXT,
ADD COLUMN     "publicKey" TEXT;
