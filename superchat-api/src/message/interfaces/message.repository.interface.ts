import { Message } from '@/message/entities/message.entity';
import { SendMessageDto } from '@/message/dto/request/send-message.dto';

export interface IMessageRepository {
  sendMessage(dto: SendMessageDto): Promise<Message>;

  findMessages(chatId: string): Promise<Message[]>; // Add filter later
}
