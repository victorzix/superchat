import { IMessageRepository } from '@/message/interfaces/message.repository.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Message, MessageDocument } from '@/message/entities/message.entity';
import { Model, Promise } from 'mongoose';
import { SendMessageDto } from '@/message/dto/request/send-message.dto';

export class MessageRepository implements IMessageRepository {
  constructor(
    @InjectModel('Message')
    private readonly messageModel: Model<MessageDocument>,
  ) {}

  findMessages(chatId: string): Promise<Message[]> {
    return this.messageModel.find({ chatId }).sort({ createdAt: 1 }).lean();
  }

  sendMessage(dto: SendMessageDto): Promise<Message> {
    const message = new this.messageModel(dto);
    return message.save();
  }
}
