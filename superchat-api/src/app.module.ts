import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ContactModule } from '@/contact/contact.module';
import { MessageModule } from '@/message/message.module';
import { ChatModule } from '@/chat/chat.module';
import { WebSocketModule } from '@/websocket/websocket.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bullmq';

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
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: {
            host: process.env.REDIS_MESSAGES_HOST,
            port: +process.env.REDIS_MESSAGES_PORT,
          },
          password: process.env.REDIS_MESSAGES_PASSWORD,
        }),
      }),
    }),
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_QUEUE_HOST,
        port: +process.env.REDIS_QUEUE_PORT,
        password: process.env.REDIS_QUEUE_PASSWORD,
      },
    }),
    ChatModule,
    WebSocketModule,
  ],
})
export class AppModule {}
