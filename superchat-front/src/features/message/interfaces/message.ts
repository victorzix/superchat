import {MessageStatus} from "@/features/message/enums/MessageStatus";
import {MessageType} from "@/features/message/enums/MessageType.enum";

export interface IMessage {
  _id: string;
  text?: string;
  filePath?: string;
  fileType?: string;
  fileName?: string;
  chatId: string;
  senderId: string;
  messageType: MessageType;
  status: MessageStatus;
  createdAt: Date;
}