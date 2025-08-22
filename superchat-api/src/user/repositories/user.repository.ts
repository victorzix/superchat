import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { Inject } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';

export class UserRepository implements IUserRepository {
  private user: Repository<User>;

  constructor(@Inject('DATA_SOURCE') db: DataSource) {
    this.user = db.getRepository(User);
  }

  async register(dto: RegisterUserDto): Promise<User> {
    const user = this.user.create(dto);
    return await this.user.save(user);
  }

  update: () => Promise<User>;
  delete: () => Promise<void>;

  async getData({ id, phone }: { id?: string; phone?: string }): Promise<User> {
    return await this.user.findOne({
      where: [{ id }, { phone }],
    });
  }
}
