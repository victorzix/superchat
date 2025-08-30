import { Module } from '@nestjs/common';
import { MessageService } from '@/message/services/message.service';
import { ChatModule } from '@/chat/chat.module';
import { MessageController } from '@/message/controllers/message.controller';
import { CryptoService } from '@/services/crypto.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MessageSchema } from '@/message/entities/message.entity';
import { MongodbModule } from '@/providers/mongodb/mongodb.module';
import { UserModule } from '@/user/user.module';
import { MESSAGE_REPOSITORY, MESSAGE_SERVICE } from '@/shared/symbols';
import { MessageRepository } from '@/message/repositories/message.repository';

@Module({
  providers: [
    {
      provide: MESSAGE_SERVICE,
      useClass: MessageService,
    },
    {
      provide: MESSAGE_REPOSITORY,
      useClass: MessageRepository,
    },
    CryptoService,
  ],
  imports: [
    UserModule,
    ChatModule,
    MongooseModule.forFeature([{ name: 'Message', schema: MessageSchema }]),
    MongodbModule,
  ],
  controllers: [MessageController],
  exports: [MESSAGE_SERVICE],
})
export class MessageModule {}
