import { IUserRepository } from '@/user/interfaces/user.repository.interface';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRepository } from '@/user/repositories/user.repository';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaClient } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';
import { hash } from 'bcrypt';
import { mockUser } from '../../../test/user/mocks';
import {USER_REPOSITORY} from "@/shared/symbols";

describe('UserRepository', () => {
  let userRepository: IUserRepository;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    prisma = mockDeep<PrismaClient>();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          useClass: UserRepository,
          provide: USER_REPOSITORY,
        },
        {
          provide: PrismaService,
          useValue: prisma,
        },
      ],
    }).compile();

    userRepository = module.get<UserRepository>(USER_REPOSITORY);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const validRegisterDto: RegisterUserDto = {
      name: 'John Doe',
      phone: '11999999999',
      password: 'hashedPassword',
    };
    it('should create a new user', async () => {
      const expectedUser = { ...mockUser, ...validRegisterDto };
      prisma.user.create.mockResolvedValue(expectedUser);

      const result = await userRepository.register(validRegisterDto);

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: validRegisterDto,
      });
      expect(result).toEqual(expectedUser);
      expect(result.id).toBeDefined();
      expect(result.name).toBe(validRegisterDto.name);
      expect(result.phone).toBe(validRegisterDto.phone);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should throw if phone is already in use', async () => {
      const duplicatePhoneError = new Error(
        'Unique constraint failed on the fields: (`phone`)',
      );
      (duplicatePhoneError as any).code = 'P2002';
      prisma.user.create.mockRejectedValue(duplicatePhoneError);

      await expect(userRepository.register(validRegisterDto)).rejects.toThrow(
        'Unique constraint failed on the fields: (`phone`)',
      );

      expect(prisma.user.create).toHaveBeenCalledTimes(1);
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: validRegisterDto,
      });
    });

    it('should preserve password hash during registration', async () => {
      const hashedPassword = await hash('plainPassword', 12);
      const dtoWithHash = { ...validRegisterDto, password: hashedPassword };
      const expectedUser = { ...mockUser, password: hashedPassword };

      prisma.user.create.mockResolvedValue(expectedUser);

      const result = await userRepository.register(dtoWithHash);

      expect(result.password).toBe(hashedPassword);
      expect(result.password).not.toBe('plainPassword');
    });
  });

  describe('getData', () => {
    describe('when searching by id', () => {
      it('should return user when found by id', async () => {
        prisma.user.findFirst.mockResolvedValue(mockUser);

        const result = await userRepository.getData({ id: '123' });

        expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { OR: [{ id: '123' }, { phone: undefined }] },
        });
        expect(result).toEqual(mockUser);
      });

      it('should return null when user not found by id', async () => {
        prisma.user.findFirst.mockResolvedValue(null);

        const result = await userRepository.getData({ id: 'nonexistent' });

        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { OR: [{ id: 'nonexistent' }, { phone: undefined }] },
        });
        expect(result).toBeNull();
      });
    });

    describe('when searching by phone', () => {
      it('should return user when found by phone', async () => {
        prisma.user.findFirst.mockResolvedValue(mockUser);

        const result = await userRepository.getData({ phone: '11999999999' });

        expect(prisma.user.findFirst).toHaveBeenCalledTimes(1);
        expect(prisma.user.findFirst).toHaveBeenCalledWith({
          where: { OR: [{ id: undefined }, { phone: '11999999999' }] },
        });
        expect(result).toEqual(mockUser);
        expect(result.phone).toBe('11999999999');
      });

      it('should return null when user not found by phone', async () => {
        prisma.user.findFirst.mockResolvedValue(null);

        const result = await userRepository.getData({ phone: 'nonexistent' });

        expect(result).toBeNull();
      });
    });
  });
});
