import { Chat } from '@/chat/entities/chat.entity';
import { ChatResponseDto } from '@/chat/dto/responses/chat-response.dto';

export class ChatBuilder {
  static buildChatResponse(entry: Chat): ChatResponseDto {
    return {
      id: entry.id,
      members: entry.members,
      isGroup: entry.isGroup,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    };
  }
}
