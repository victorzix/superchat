import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@/shared/guards/auth.guard';
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
  async createChat(@Req() req: Request, @Body() dto: CreateChatDto) {
    return this.chatService.create(dto);
  }
}
