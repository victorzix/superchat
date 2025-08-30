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
import { CHAT_SERVICE } from '@/shared/symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';

@UseFilters(new WsExceptionFilter())
@WebSocketGateway(80, {
  namespace: 'chat',
  transports: ['websocket', 'polling'],
  cors: { origin: 'http://localhost:3000', credentials: true },
})
export class ChatGateway {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
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
  @SubscribeMessage('mensagem')
  async sendMessage(
    @MessageBody() data: { chatId: string; message: string },
    @ConnectedSocket() client: Socket,
  ) {
    const userId = client.data.user.sub;

    client.to(`chat_${data.chatId}`).emit('mensagem', {
      chatId: data.chatId,
      from: userId,
      message: data.message,
      timestamp: new Date(),
    });

    return { status: 'ok' };
  }
}
