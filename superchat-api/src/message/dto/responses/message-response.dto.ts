import { MessageStatus } from '@/message/enums/MessageStatus.enum';
import { MessageType } from '@/message/enums/MessageType.enum';

export class MessageResponseDto {
  _id: string;
  text?: string;
  filePath?: string;
  fileType?: string;
  fileName?: string;
  chatId: string;
  senderId: string;
  status: MessageStatus;
  messageType: MessageType;
  createdAt: Date;
}
