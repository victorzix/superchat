import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/controllers/user.controller';
import { UserService } from '@/user/services/user.service';
import { UserRepository } from '@/user/repositories/user.repository';
import { DataSource } from 'typeorm';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import { testDbConfig } from '../config/test-db.config';
import { JwtModule, JwtService } from '@nestjs/jwt';

describe('User integration', () => {
  let userController: UserController;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1' },
        }),
      ],
      providers: [
        {
          provide: 'USER_SERVICE',
          useFactory: (ur: UserRepository, jwt: JwtService) =>
            new UserService(ur, jwt),
          inject: ['USER_REPOSITORY', JwtService],
        },
        {
          provide: 'USER_REPOSITORY',
          useFactory: (ds: DataSource) => new UserRepository(ds),
          inject: ['DATA_SOURCE'],
        },
        {
          provide: 'DATA_SOURCE',
          useFactory: async () => {
            const ds = new DataSource(testDbConfig);
            await ds.initialize();
            return ds;
          },
        },
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    dataSource = moduleRef.get<DataSource>('DATA_SOURCE');
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  describe('register', () => {
    it('should register a user successfully', async () => {
      const dto: RegisterUserDto = {
        name: 'name',
        birthDate: new Date(),
        phone: '11999999999',
        password: '123456',
      };

      const response = await userController.register(dto);

      expect(response).toHaveProperty('id');
      expect(response.phone).toBe(dto.phone);
      expect(response).not.toHaveProperty('password');
    });

    it('should throw when phone already registered', async () => {
      const dto: RegisterUserDto = {
        name: 'name',
        birthDate: new Date(),
        phone: '11999999998',
        password: '123456',
      };

      await userController.register(dto);

      await expect(userController.register(dto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
