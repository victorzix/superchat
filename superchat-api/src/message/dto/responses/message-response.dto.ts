import { MessageStatus } from '@/message/enums/MessageStatus.enum';

export class MessageResponseDto {
  _id: string;
  text: string;
  chatId: string;
  senderId: string;
  status: MessageStatus;
  createdAt: Date;
}
