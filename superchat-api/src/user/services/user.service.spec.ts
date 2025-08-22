import { IUserRepository } from '@/user/interfaces/user.repository.interface';
import { User } from '@/user/entities/user.entity';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { hash } from 'bcrypt';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { UserService } from '@/user/services/user.service';

describe('UserService', () => {
  let userService: IUserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    mockRepository = {
      register: jest.fn(),
      getData: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          useValue: mockRepository,
          provide: 'USER_REPOSITORY',
        },
        {
          provide: 'USER_SERVICE',
          useClass: UserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>('USER_SERVICE');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should create and return a new user', async () => {
      const password = await hash('a123sa', 12);
      const registerDto: RegisterUserDto = {
        phone: '212121',
        password,
      };

      const mockUser = new User();
      Object.assign(mockUser, {
        id: 'mock-id-123',
        ...registerDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockRepository.register.mockResolvedValue(mockUser);

      const result = await userService.register(registerDto);

      expect(mockRepository.register).toHaveBeenCalledWith({
        phone: registerDto.phone,
        password: expect.stringMatching(/^\$2[aby]\$.{56}$/),
      });
      expect(result).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          phone: registerDto.phone,
        }),
      );
      expect(result.phone).toBe(mockUser.phone);
    });
  });
});
