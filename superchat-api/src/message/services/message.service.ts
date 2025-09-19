import { Inject, Injectable } from '@nestjs/common';
import { Message } from '@/message/entities/message.entity';
import { CryptoService } from '@/services/crypto.service';
import { CHAT_SERVICE } from '@/shared/symbols/chat.symbols';
import { IChatService } from '@/chat/interfaces/chat.service.interface';
import { SendMessageRequestDto } from '@/message/dto/request/send-message-request.dto';
import { IMessageService } from '@/message/interfaces/message.service.interface';
import { MESSAGE_REPOSITORY, SUPABASE } from '@/shared/symbols';
import { IMessageRepository } from '@/message/interfaces/message.repository.interface';
import { MessageBuilder } from '@/message/builders/message.builder';
import { MessageResponseDto } from '@/message/dto/responses/message-response.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { MessageType } from '@/message/enums/MessageType.enum';
import { SupabaseClient } from '@supabase/supabase-js';
import { SendMessageDto } from '@/message/dto/request/send-message.dto';

@Injectable()
export class MessageService implements IMessageService {
  constructor(
    @Inject() private readonly cryptoService: CryptoService,
    @Inject(CHAT_SERVICE) private readonly chatService: IChatService,
    @Inject(MESSAGE_REPOSITORY)
    private readonly messageRepository: IMessageRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    @Inject(SUPABASE) private readonly supabase: SupabaseClient,
  ) {}

  async sendMessage(
    dto: SendMessageRequestDto,
    senderId: string,
  ): Promise<MessageResponseDto> {
    const cachedMessages = await this.cacheManager.get<MessageResponseDto[]>(
      `chat_${dto.chatId}:messages`,
    );

    let buildedMessage: MessageResponseDto;

    switch (dto.messageType) {
      case MessageType.TEXT:
        buildedMessage = await this.sendTextMessage(dto, senderId);
        break;
      case MessageType.FILE:
      case MessageType.IMAGE:
        buildedMessage = await this.sendFileMessage(dto, senderId);
        break;
    }

    if (cachedMessages) {
      cachedMessages.push(buildedMessage);
      await this.cacheManager.set(
        `chat_${dto.chatId}:messages`,
        cachedMessages,
      );
    } else {
      await this.cacheManager.set(`chat_${dto.chatId}:messages`, [
        buildedMessage,
      ]);
    }

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
      if (msg.ciphertext) {
        return MessageBuilder.buildMessageResponse(msg, () =>
          this.cryptoService.decryptMessage(
            msg.ciphertext,
            msg.iv,
            msg.authTag,
            Buffer.from(keys.keys),
          ),
        );
      } else {
        return {
          _id: msg._id,
          filePath: msg.filePath,
          messageType: msg.messageType,
          fileType: msg.fileType,
          chatId: msg.chatId,
          senderId: msg.senderId,
          status: msg.status,
          createdAt: msg.createdAt,
        };
      }
    });

    await this.cacheManager.set(
      `chat_${chatId}:messages`,
      buildedMessages,
      5 * 24 * 60 * 60 * 1000,
    );

    return buildedMessages;
  }

  private async sendTextMessage(dto: SendMessageRequestDto, senderId: string) {
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

    return MessageBuilder.buildMessageResponse(message, () =>
      this.cryptoService.decryptMessage(
        message.ciphertext,
        message.iv,
        message.authTag,
        Buffer.from(chatKeys.keys),
      ),
    );
  }

  private async sendFileMessage(dto: SendMessageRequestDto, senderId: string) {
    const chatKeys = await this.chatService.getChatKeys(dto.chatId);
    let baseMessage: SendMessageDto = {
      chatId: dto.chatId,
      senderId,
      filePath: dto.filePath,
      messageType: dto.messageType,
    };

    if (dto.messageText) {
      const { ciphertext, iv, authTag } = this.cryptoService.encryptMessage(
        dto.messageText,
        Buffer.from(chatKeys.keys),
      );

      baseMessage = {
        ...baseMessage,
        ciphertext,
        iv,
        authTag,
      };
    }

    const message = await this.messageRepository.sendMessage({
      ...baseMessage,
      fileType: dto.fileType,
    });

    if (dto.messageText) {
      return MessageBuilder.buildMessageResponse(message, () =>
        this.cryptoService.decryptMessage(
          message.ciphertext,
          message.iv,
          message.authTag,
          Buffer.from(chatKeys.keys),
        ),
      );
    } else {
      return {
        _id: message._id,
        filePath: message.filePath,
        messageType: message.messageType,
        fileName: message.fileName,
        fileType: message.fileType,
        chatId: message.chatId,
        senderId: message.senderId,
        status: message.status,
        createdAt: message.createdAt,
      };
    }
  }
}
