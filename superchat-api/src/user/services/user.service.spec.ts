import { IUserRepository } from '@/user/interfaces/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { IUserService } from '@/user/interfaces/user.service.interface';
import { UserService } from '@/user/services/user.service';
import { JwtModule } from '@nestjs/jwt';
import { mockUser } from '../../../test/user/mocks';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import {CLOUDINARY, USER_REPOSITORY, USER_SERVICE} from "@/shared/symbols";

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
      imports: [
        JwtModule.register({
          secret: 'test-secret',
          signOptions: { expiresIn: '1' },
        }),
      ],
      providers: [
        {
          provide: CLOUDINARY,
          useValue: {
            uploader: {
              upload_stream: jest.fn().mockImplementation(() => {
                return {
                  end: jest.fn(),
                };
              }),
            },
          },
        },
        {
          useValue: mockRepository,
          provide: USER_REPOSITORY,
        },
        {
          provide: USER_SERVICE,
          useClass: UserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(USER_SERVICE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const res: any = {
    cookie: jest.fn(),
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockImplementation((x) => x),
  };

  describe('register', () => {
    const validRegisterDto: RegisterUserDto = {
      name: 'John Doe',
      phone: '11999999999',
      password: 'hashedPassword',
    };
    it('should create and return a new user', async () => {
      mockRepository.getData.mockResolvedValue(null);
      mockRepository.register.mockResolvedValue(mockUser);

      const result = await userService.register(res, validRegisterDto);

      expect(mockRepository.register).toHaveBeenCalledTimes(1);
      expect(mockRepository.register).toHaveBeenCalledWith(validRegisterDto);
      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(mockRepository.getData).toHaveBeenCalledWith({
        phone: validRegisterDto.phone,
      });
    });

    it('should upload a profile picture if sent in body', async () => {
      validRegisterDto.profilePicture = 'profile.jpg';
      mockRepository.getData.mockResolvedValue(null);
      mockRepository.register.mockResolvedValue(mockUser);

      const file = {
        buffer: Buffer.from('fake-image-bytes'),
        mimetype: 'image/png',
        originalname: 'avatar.png',
      } as Express.Multer.File;

      const mockUploadStream = jest.fn().mockImplementation((options, cb) => {
        return {
          end: jest.fn(() => {
            cb(null, { secure_url: 'profile.jpg' });
          }),
        };
      });

      (userService as any).cloudinary.uploader.upload_stream = mockUploadStream;

      const result = await userService.register(res, validRegisterDto, file);

      expect(mockUploadStream).toHaveBeenCalled();
      expect(mockRepository.register).toHaveBeenCalledWith(validRegisterDto);
      expect(result.profilePicture).toBe('profile.jpg');
    });

    it('should throw if phone is already in use', async () => {
      mockRepository.getData.mockResolvedValue(mockUser);

      await expect(userService.register(res, validRegisterDto)).rejects.toThrow(
        BadRequestException,
      );

      expect(mockRepository.getData).toHaveBeenCalledTimes(1);
      expect(mockRepository.getData).toHaveBeenCalledWith({
        phone: validRegisterDto.phone,
      });
    });
  });
  describe('getData', () => {
    it('should return an user by its id', async () => {
      mockRepository.getData.mockResolvedValue(mockUser);

      const result = await userService.getData('123');

      expect(result).toBeDefined();
      expect(result).toHaveProperty('id');
      expect(mockRepository.getData).toHaveBeenCalledTimes(1);
    });

    it('should throw not found if user does not exist', async () => {
      mockRepository.getData.mockResolvedValue(null);

      await expect(userService.getData('123')).rejects.toThrow(
        NotFoundException,
      );

      expect(mockRepository.getData).toHaveBeenCalledTimes(1);
    });
  });
});
