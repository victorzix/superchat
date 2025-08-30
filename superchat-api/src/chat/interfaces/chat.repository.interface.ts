import { CreateChatDto } from '@/chat/dto/request/create-chat.dto';
import { Chat, ChatKeys } from '@/chat/entities/chat.entity';

export interface IChatRepository {
  create(dto: CreateChatDto): Promise<Chat>;

  getAll(memberId: string): Promise<Chat[]>;

  getChat(id: string): Promise<Chat>;

  getKeys(chatId: string): Promise<ChatKeys>;

  generateKeys(chatId: string, keys: Uint8Array): Promise<ChatKeys>;
}
