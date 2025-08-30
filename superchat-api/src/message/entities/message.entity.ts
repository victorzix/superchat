import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, HydratedDocument } from 'mongoose';
import { MessageStatus } from '@/message/enums/MessageStatus.enum';

export type MessageDocument = HydratedDocument<Message>;

@Schema({ timestamps: true })
export class Message extends Document {
  @Prop({ type: String, required: true })
  senderId: string;

  @Prop({ type: String, required: true })
  chatId: string;

  @Prop({
    type: Number,
    enum: MessageStatus,
    default: MessageStatus.PENDING,
  })
  status: MessageStatus;

  @Prop({ type: String, required: true })
  authTag: string;

  @Prop({ type: String, required: true })
  ciphertext: string;

  @Prop({ type: String, required: true })
  iv: string;

  createdAt: Date;
  updatedAt: Date;
}

export const MessageSchema = SchemaFactory.createForClass(Message);
