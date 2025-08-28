import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from '@/user/controllers/user.controller';
import { UserService } from '@/user/services/user.service';
import { UserRepository } from '@/user/repositories/user.repository';
import { RegisterUserDto } from '@/user/dto/request/register-user.dto';
import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { v2 as Cloudinary } from 'cloudinary';
import { PrismaTestService } from '@/prisma/test/prisma.test.service';

describe('User integration', () => {
  let userController: UserController;
  let prisma: PrismaTestService;

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
        PrismaTestService,
        {
          provide: 'USER_SERVICE',
          useFactory: (
            ur: UserRepository,
            jwt: JwtService,
            cloudinary: typeof Cloudinary,
          ) => new UserService(ur, cloudinary, jwt),
          inject: ['USER_REPOSITORY', JwtService, 'CLOUDINARY'],
        },
        {
          provide: 'USER_REPOSITORY',
          useFactory: (prismaTest: PrismaTestService) => {
            return new UserRepository(prismaTest);
          },
          inject: [PrismaTestService],
        },
        {
          provide: 'CLOUDINARY',
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
      ],
    }).compile();

    userController = moduleRef.get<UserController>(UserController);
    prisma = moduleRef.get<PrismaTestService>(PrismaTestService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
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
    it('should register an user successfully', async () => {
      await userController.register(res, validRegisterDto);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ id: expect.any(String) }),
      );
    });

    it('should throw when phone already registered', async () => {
      try {
        await userController.register(res, validRegisterDto);
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
        expect(err.message).toBe('Telefone já cadastrado');
      }
    });
  });
});
