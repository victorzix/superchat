import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { MessageStatus } from '@/message/enums/MessageStatus.enum';
import { MessageType } from '@/message/enums/MessageType.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends Document {
  _id: string;

  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ type: String, required: true })
  chatId: string;

  @Prop({
    type: Number,
    enum: MessageStatus,
    default: MessageStatus.SENT,
  })
  status: MessageStatus;

  @Prop({
    type: String,
    enum: MessageType,
    required: true,
    default: MessageType.TEXT,
  })
  messageType: MessageType;

  @Prop({ type: String })
  authTag?: string;

  @Prop({ type: String })
  ciphertext?: string;

  @Prop({ type: String })
  iv?: string;

  @Prop({ type: String })
  filePath?: string;

  @Prop({ type: String })
  fileType?: string;

  @Prop({ type: String })
  fileName?: string;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
