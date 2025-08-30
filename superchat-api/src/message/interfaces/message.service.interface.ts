import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { Message } from '@/message/entities/message.entity';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';

export interface IMessageService {
  sendMessage(dto: SendMessageRequestDto, senderId: string): Promise<Message>;

  findMessages(chatId: string): Promise<MessageResponseDto[]>; // Add filter later
}
