import { Inject, Injectable } from '@nestjs/common';
import { Message } from '@/message/entities/message.entity';
import { CryptoService } from '@/services/crypto.service';
import { CHAT_SERVICE } from '@/shared/symbols/chat.symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { IMessageService } from '@/message/interfaces/message.service.interface';
import { MESSAGE_REPOSITORY } from '@/shared/symbols';
import { IMessageRepository } from '@/message/interfaces/message.repository.interface';
import { MessageBuilder } from '@/message/builders/message.builder';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject() private readonly cryptoService: CryptoService,
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async sendMessage(
    dto: SendMessageRequestDto,
    senderId: string,
  ): Promise<MessageResponseDto> {
    const chatKeys = await this.chatService.getChatKeys(dto.chatId);
    const { ciphertext, iv, authTag } = this.cryptoService.encryptMessage(
      dto.messageText,
      Buffer.from(chatKeys.keys),
    );

    const message = await this.messageRepository.sendMessage({
      senderId,
      chatId: dto.chatId,
      ciphertext,
      iv,
      authTag,
    });

    const buildedMessage = MessageBuilder.buildMessageResponse(message, () =>
      this.cryptoService.decryptMessage(
        message.ciphertext,
        message.iv,
        message.authTag,
        Buffer.from(chatKeys.keys),
      ),
    );

    const cachedMessages = await this.cacheManager.get<MessageResponseDto[]>(
      `chat_${dto.chatId}:messages`,
    );

    cachedMessages.push(buildedMessage);

    await this.cacheManager.set(`chat_${dto.chatId}:messages`, cachedMessages);
    return buildedMessage;
  }

  async findMessages(chatId: string) {
    const cachedMessages = await this.cacheManager.get<MessageResponseDto[]>(
      `chat_${chatId}:messages`,
    );

    if (cachedMessages) return cachedMessages;

    const keys = await this.chatService.getChatKeys(chatId);

    const newMessages = await this.messageRepository.findMessages(chatId);

    const buildedMessages = newMessages.map((msg: Message) => {
      return MessageBuilder.buildMessageResponse(msg, () =>
        this.cryptoService.decryptMessage(
          msg.ciphertext,
          msg.iv,
          msg.authTag,
          Buffer.from(keys.keys),
        ),
      );
    });

    await this.cacheManager.set(`chat_${chatId}:messages`, buildedMessages, 5 * 24 * 60 * 60 * 1000);

    return buildedMessages;
  }
}
