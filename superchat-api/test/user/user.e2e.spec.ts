import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '@/app.module';
import { DataSource } from 'typeorm';
import { testDbConfig } from '../config/test-db.config';

describe('User (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider('DATA_SOURCE')
      .useFactory({
        factory: async () => {
          const ds = new DataSource(testDbConfig);
          await ds.initialize();
          return ds;
        },
      })
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

    dataSource = moduleFixture.get<DataSource>('DATA_SOURCE');
  });

  afterAll(async () => {
    await dataSource.destroy();
    await app.close();
  });

  describe('/user (POST)', () => {
    it('should register an user', async () => {
      const res = await request(app.getHttpServer())
        .post('/user')
        .send({
          name: 'name',
          birthDate: new Date(),
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
        birthDate: new Date(),
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
