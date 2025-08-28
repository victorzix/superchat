import { User } from '../entities/user.entity';
import { IUserRepository } from '../interfaces/user.repository.interface';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(private readonly db: PrismaService) {}

  async register(dto: RegisterUserDto): Promise<User> {
    return this.db.user.create({ data: dto });
  }

  update: () => Promise<User>;
  delete: () => Promise<void>;

  async getData({ id, phone }: { id?: string; phone?: string }): Promise<User> {
    return this.db.user.findFirst({
      where: { isActive: true, OR: [{ id }, { phone: { contains: phone } }] },
    });
  }
}
