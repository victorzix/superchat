-- CreateTable
CREATE TABLE "public"."User"
(
    "id"             TEXT         NOT NULL,
    "password"       TEXT         NOT NULL,
    "phone"          TEXT         NOT NULL,
    "profilePicture" TEXT,
    "status"         TEXT,
    "isActive"       BOOLEAN      NOT NULL DEFAULT true,
    "createdAt"      TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"      TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "public"."User" ("phone");
