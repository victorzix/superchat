import { IUserRepository } from '@/user/interfaces/user.repository.interface';
import { DataSource, Repository } from 'typeorm';
import { User } from '@/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@/user/repositories/user.repository';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { hash } from 'bcrypt';

describe('UserRepository', () => {
  let userRepository: IUserRepository;
  let mockDataSource: jest.Mocked<DataSource>;
  let mockRepository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    mockRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    } as any;

    mockDataSource = {
      getRepository: jest.fn().mockReturnValue(mockRepository),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          useClass: UserRepository,
          provide: 'USER_REPOSITORY',
        },
        {
          provide: 'DATA_SOURCE',
          useValue: mockDataSource,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>('USER_REPOSITORY');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create and save a new user', async () => {
      const registerDto: RegisterUserDto = {
        phone: '212121',
        password: await hash('a123sa', 12),
      };

      const mockUser = new User();
      Object.assign(mockUser, {
        id: '1',
        ...registerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await userRepository.register(registerDto);

      expect(mockRepository.create).toHaveBeenCalledWith(registerDto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });
});
