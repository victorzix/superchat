import { Module } from '@nestjs/common';
import { ChatGateway } from '@/websocket/gateways/chat.gateway';
import { UserModule } from '@/user/user.module';
import { ChatModule } from '@/chat/chat.module';
import {MessageModule} from "@/message/message.module";

@Module({
  providers: [ChatGateway],
  imports: [UserModule, ChatModule, MessageModule],
})
export class WebSocketModule {}
