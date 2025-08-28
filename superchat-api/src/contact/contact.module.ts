import { Module } from '@nestjs/common';
import { ContactController } from '@/contact/controllers/contact.controller';
import { ContactService } from '@/contact/services/contact.service';
import { CONTACT_REPOSITORY, CONTACT_SERVICE } from '@/shared/symbols';
import { ContactRepository } from '@/contact/repositories/contact.repository';
import { UserModule } from '@/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ContactController],
  providers: [
    {
      provide: CONTACT_SERVICE,
      useClass: ContactService,
    },
    { provide: CONTACT_REPOSITORY, useClass: ContactRepository },
  ],
  exports: [CONTACT_SERVICE],
})
export class ContactModule {}
