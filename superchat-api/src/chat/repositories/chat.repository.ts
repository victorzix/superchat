import { Chat, ChatKeys } from '@/chat/entities/chat.entity';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IChatRepository } from '@/chat/interfaces/chat.repository.interface';
import { CreateChatDto } from '@/chat/dto/request/create-chat.dto';

@Injectable()
export default class ChatRepository implements IChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateChatDto): Promise<Chat> {
    return this.prisma.chat.create({
      data: {
        ...dto,
        members: {
          connect: dto.members.map((id) => ({ id })),
        },
      },
      include: {
        ChatKeys: true,
        members: true,
      },
    });
  }

  getAll(memberId: string): Promise<Chat[]> {
    return this.prisma.chat.findMany({
      where: {
        members: {
          every: { id: memberId },
        },
      },
      include: {
        ChatKeys: true,
        members: true,
      },
    });
  }

  getChat(id: string): Promise<Chat> {
    return this.prisma.chat.findUnique({
      where: { id },
      include: {
        ChatKeys: true,
        members: true,
      },
    });
  }

  getKeys(chatId: string): Promise<ChatKeys> {
    return this.prisma.chatKeys.findUnique({
      where: { chatId },
    });
  }

  generateKeys(chatId: string, keys: Uint8Array): Promise<ChatKeys> {
    return this.prisma.chatKeys.create({
      data: {
        chatId,
        keys,
      },
    });
  }
}
