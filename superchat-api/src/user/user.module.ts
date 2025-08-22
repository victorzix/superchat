import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user.repository';
import { DatabaseModule } from '../providers/database/database.module';
import { UserService } from '@/user/services/user.service';
import { UserController } from '@/user/controllers/user.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    {
      provide: 'USER_REPOSITORY',
      useClass: UserRepository,
    },
    {
      provide: 'USER_SERVICE',
      useClass: UserService,
    },
  ],
  exports: ['USER_SERVICE'],
  controllers: [UserController],
})
export class UserModule {}
