import { MessageType } from '@/message/enums/MessageType.enum';

export class SendMessageDto {
  senderId: string;
  chatId: string;
  ciphertext?: string;
  messageType?: MessageType;
  iv?: string;
  authTag?: string;
  filePath?: string;
  fileType?: string;
  fileName?: string;
}
