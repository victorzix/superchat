import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ContactModule } from '@/contact/contact.module';
import { MessageModule } from '@/message/message.module';
import { ChatModule } from '@/chat/chat.module';

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
    PrismaModule,
    UserModule,
    ContactModule,
    MessageModule,
    ChatModule,
  ],
})
export class AppModule {}
