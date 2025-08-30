import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAT_REPOSITORY } from '@/shared/symbols/chat.symbols';
import { IChatRepository } from '@/chat/interfaces/chat.repository.interface';
import * as crypto from 'crypto';
import { Chat, ChatKeys } from '@/chat/entities/chat.entity';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { CreateChatDto } from '@/chat/dto/request/create-chat.dto';
import { ChatResponseDto } from '@/chat/dto/responses/chat-response.dto';
import { ChatBuilder } from '@/chat/builders/chat.builder';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: IChatRepository,
  ) {}

  async create(dto: CreateChatDto): Promise<ChatResponseDto> {
    const aesKey = crypto.randomBytes(32);
    const chat = await this.chatRepository.create(dto);
    await this.chatRepository.generateKeys(chat.id, aesKey);
    return ChatBuilder.buildChatResponse(chat);
  }

  async getAll(memberId: string): Promise<Chat[]> {
    const chats = await this.chatRepository.getAll(memberId);

    return chats.map((chat: Chat) => ChatBuilder.buildChatResponse(chat));
  }

  async getChat(id: string): Promise<Chat> {
    const chat = await this.chatRepository.getChat(id);
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  async getChatKeys(chatId: string): Promise<ChatKeys> {
    return this.chatRepository.getKeys(chatId);
  }
}
