import { Module } from '@nestjs/common';
import ChatRepository from '@/chat/repositories/chat.repository';
import { ChatService } from '@/chat/services/chat.service';
import { CHAT_REPOSITORY, CHAT_SERVICE } from '@/shared/symbols';
import { ChatController } from '@/chat/controllers/chat.controller';

@Module({
  providers: [
    {
      provide: CHAT_REPOSITORY,
      useClass: ChatRepository,
    },
    {
      provide: CHAT_SERVICE,
      useClass: ChatService,
    },
  ],
  exports: [CHAT_SERVICE],
  controllers: [ChatController],
})
export class ChatModule {}
