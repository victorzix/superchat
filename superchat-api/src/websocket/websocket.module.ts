import { Module } from '@nestjs/common';
import { ChatGateway } from '@/websocket/gateways/chat.gateway';
import { UserModule } from '@/user/user.module';
import { ChatModule } from '@/chat/chat.module';

@Module({
  providers: [ChatGateway],
  imports: [UserModule, ChatModule],
})
export class WebSocketModule {}
