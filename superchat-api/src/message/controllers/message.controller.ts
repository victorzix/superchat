import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { MESSAGE_SERVICE } from '@/shared/symbols';
import { IMessageService } from '@/message/interfaces/message.service.interface';

@ApiTags('Mensagens')
@Controller('message')
export class MessageController {
  constructor(
    @Inject(MESSAGE_SERVICE) private readonly messageService: IMessageService,
  ) {}

  @UseGuards(AuthGuard)
  @Post('send')
  async sendMessage(@Req() req: Request, @Body() dto: SendMessageRequestDto) {
    return this.messageService.sendMessage(dto, req.user.sub);
  }

  @Get(':chatId')
  async getMessages(@Param('chatId') chatId: string) {
    return this.messageService.findMessages(chatId);
  }
}
