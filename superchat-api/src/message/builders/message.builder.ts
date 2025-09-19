import { Message } from '@/message/entities/message.entity';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';

export class MessageBuilder {
  static buildMessageResponse(
    dto: Message,
    textDecrypt: () => string,
  ): MessageResponseDto {
    return {
      _id: dto._id,
      senderId: dto.senderId,
      chatId: dto.chatId,
      text: textDecrypt(),
      status: dto.status,
      createdAt: dto.createdAt,
      filePath: dto.filePath,
      messageType: dto.messageType,
    };
  }
}
