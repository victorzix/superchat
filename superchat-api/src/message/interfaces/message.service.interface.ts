import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';

export interface IMessageService {
  sendMessage(
    dto: SendMessageRequestDto,
    senderId: string,
    file?: Express.Multer.File,
  ): Promise<MessageResponseDto>;

  findMessages(chatId: string): Promise<MessageResponseDto[]>; // Add filter later
}
