import { Message } from '@/message/entities/message.entity';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';

export class MessageBuilder {
  static buildMessageResponse(
    dto: Message,
    textDecrypt: () => string,
  ): MessageResponseDto {
    return {
      senderId: dto.senderId,
      chatId: dto.chatId,
      text: textDecrypt(),
      status: dto.status,
      createdAt: dto.createdAt,
    };
  }
}
