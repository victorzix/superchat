import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Global()
@Module({
  imports: [MongooseModule.forRoot(process.env.MONGODB_URL)],
})
export class MongodbModule {}
