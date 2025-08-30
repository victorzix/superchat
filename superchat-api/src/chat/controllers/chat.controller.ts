import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Get, Inject, Param, Post } from '@nestjs/common';
import { CHAT_SERVICE } from '@/shared/symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { CreateChatDto } from '@/chat/dto/request/create-chat.dto';

@ApiTags('Chats')
@Controller('chat')
export class ChatController {
  constructor(
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
  ) {}

  @Post('create')
  async createChat(@Body() dto: CreateChatDto) {
    return this.chatService.create(dto);
  }

  @Get(':memberId')
  async listChats(@Param('memberId') memberId: string) {
    return this.chatService.getAll(memberId);
  }
}
