import {MessageStatus} from "@/features/chat/enums/MessageStatus";

export interface IMessage {
  _id: string;
  text: string;
  chatId: string;
  senderId: string;
  status: MessageStatus;
  createdAt: Date;
}