import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { Inject, UseFilters, UseGuards } from '@nestjs/common';
import { WsAuthGuard } from '@/shared/guards/websocket.auth.guard';
import { WsExceptionFilter } from '@/shared/filters/ws-exception.filter';
import { CHAT_SERVICE, MESSAGE_SERVICE } from '@/shared/symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { IMessageService } from '@/message/interfaces/message.service.interface';
import { MessageStatus } from '@/message/enums/MessageStatus.enum';
import { MessageType } from '@/message/enums/MessageType.enum';
import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway(80, {
  namespace: 'chat',
  transports: ['websocket', 'polling'],
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
    @Inject(MESSAGE_SERVICE) private readonly messageService: IMessageService,
  ) {}

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('connectUser')
  async connectUser(
    @MessageBody() data: { chatId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;

    const chats = await this.chatService.getAll(userId);

    chats.forEach((chat) => client.join(`chat_${chat.id}`));

    client.emit('connected', { joinedChats: chats.map((c) => c.id) });
  }

  @UseGuards(WsAuthGuard)
  @SubscribeMessage('message')
  async sendMessage(
    @MessageBody()
    data: SendMessageRequestDto & {
      tempId: string;
    },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;

    const message = await this.messageService.sendMessage(data, userId);

    client.to(`chat_${data.chatId}`).emit('message', {
      chatId: data.chatId,
      from: userId,
      message,
      timestamp: new Date(),
    });

    await new Promise((res) => setTimeout(res, 3000));

    client.emit('messageStatus', {
      tempId: data.tempId,
      status: MessageStatus.SENT,
      message,
    });

    return { status: 'ok' };
  }
}
