import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CHAT_REPOSITORY } from '@/shared/symbols/chat.symbols';
import { IChatRepository } from '@/chat/interfaces/chat.repository.interface';
import * as crypto from 'crypto';
import { Chat } from '../../../generated/prisma';
import { ChatKeys } from '@/chat/entities/chat.entity';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { CreateChatDto } from '@/chat/dto/request/create-chat.dto';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @Inject(CHAT_REPOSITORY) private readonly chatRepository: IChatRepository,
  ) {}

  async create(dto: CreateChatDto): Promise<Chat> {
    const aesKey = crypto.randomBytes(32);
    const chat = await this.chatRepository.create(dto);
    await this.chatRepository.generateKeys(chat.id, aesKey);
    return chat;
  }

  async getAll(memberId: string): Promise<Chat[]> {
    return this.chatRepository.getAll(memberId);
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
