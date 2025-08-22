import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { DatabaseModule } from './providers/database/database.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        switch (process.env.NODE_ENV) {
          case 'production':
            return '.env.production';
          case 'development':
          default:
            return '.env';
        }
      })(),
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
    }),
    DatabaseModule,
    UserModule,
  ],
})
export class AppModule {}
