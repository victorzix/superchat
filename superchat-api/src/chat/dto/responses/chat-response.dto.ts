import { User } from '@/user/entities/user.entity';

export class ChatResponseDto {
  id: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: User[];
}
