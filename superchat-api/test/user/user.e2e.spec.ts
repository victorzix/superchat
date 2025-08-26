import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { PrismaTestService } from '@/prisma/test/prisma.test.service';
import { PrismaService } from '@/prisma/prisma.service';

describe('User (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaTestService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(new PrismaTestService())
      .compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    await prisma.user.deleteMany({});
    await prisma.$disconnect();
  });

  describe('/user (POST)', () => {
    it('should register an user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'name',
          phone: '11999999999',
          password: '123456',
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
      expect(res.body.phone).toBe('11999999999');
      expect(res.body).not.toHaveProperty('password');
    });

    it('should throw when phone already registered', async () => {
      const dto = {
        name: 'name',
        phone: '11999999999',
        password: '123456',
      };

      await request(app.getHttpServer()).post('/user').send(dto).expect(400);

      const res = await request(app.getHttpServer())
        .post('/user')
        .send(dto)
        .expect(400);

      expect(res.body.message).toBe('Telefone já cadastrado');
    });
  });
});
