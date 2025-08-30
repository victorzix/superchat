import { User } from '@/user/entities/user.entity';

export class Chat {
  id: string;
  isGroup: boolean;
  createdAt: Date;
  updatedAt: Date;
  members: User[];
  ChatKeys?: ChatKeys;
}

export class ChatKeys {
  id: string;
  chatId: string;
  keys: Uint8Array;
}
