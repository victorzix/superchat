import { MessageStatus } from '@/message/enums/MessageStatus.enum';

export class MessageResponseDto {
  text: string;
  chatId: string;
  senderId: string;
  status: MessageStatus;
  createdAt: Date;
}
