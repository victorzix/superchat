-- CreateTable
CREATE TABLE "public"."ChatKeys" (
    "id" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "keys" BYTEA NOT NULL,

    CONSTRAINT "ChatKeys_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChatKeys_chatId_key" ON "public"."ChatKeys"("chatId");

-- AddForeignKey
ALTER TABLE "public"."ChatKeys" ADD CONSTRAINT "ChatKeys_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
