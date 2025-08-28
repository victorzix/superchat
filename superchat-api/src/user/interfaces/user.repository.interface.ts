import { User } from '../entities/user.entity';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';

export interface IUserRepository {
  register: (dto: RegisterUserDto) => Promise<User>;
  update: () => Promise<User>;
  delete: () => Promise<void>;
  getData: ({ id, phone }: { id?: string; phone?: string }) => Promise<User>;
}
