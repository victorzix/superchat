import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message, MessageDocument } from '@/message/entities/message.entity';
import { CryptoService } from '@/services/crypto.service';
import { CHAT_SERVICE } from '@/shared/symbols/chat.symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { IMessageService } from '@/message/interfaces/message.service.interface';
import { MESSAGE_REPOSITORY } from '@/shared/symbols';
import { IMessageRepository } from '@/message/interfaces/message.repository.interface';
import { MessageBuilder } from '@/message/builders/message.builder';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @InjectModel('Message') private messageModel: Model<MessageDocument>,
    @Inject() private readonly cryptoService: CryptoService,
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
  ) {}

  async sendMessage(dto: SendMessageRequestDto, senderId: string) {
    const chatKeys = await this.chatService.getChatKeys(dto.chatId);
    const { ciphertext, iv, authTag } = this.cryptoService.encryptMessage(
      dto.messageText,
      Buffer.from(chatKeys.keys),
    );

    return this.messageRepository.sendMessage({
      senderId,
      chatId: dto.chatId,
      ciphertext,
      iv,
      authTag,
    });
  }

  async findMessages(chatId: string) {
    const keys = await this.chatService.getChatKeys(chatId);

    const newMessages = await this.messageRepository.findMessages(chatId);

    return newMessages.map((msg: Message) => {
      return MessageBuilder.buildMessageResponse(msg, () =>
        this.cryptoService.decryptMessage(
          msg.ciphertext,
          msg.iv,
          msg.authTag,
          Buffer.from(keys.keys),
        ),
      );
    });
  }
}
