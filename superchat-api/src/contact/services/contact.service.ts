import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { IContactService } from '@/contact/interfaces/contact.service.interface';
import { CONTACT_REPOSITORY, USER_SERVICE } from '@/shared/symbols';
import { IContactRepository } from '@/contact/interfaces/contact.repository.interface';
import { Contact } from '@/contact/entities/contact.entity';
import { UserService } from '@/user/services/user.service';
import { AddContactRequestDto } from '@/contact/dto/requests/add-contact-request.dto';
import { FilterContactDto } from '@/contact/dto/requests/filter-contact.dto';

@Injectable()
export class ContactService implements IContactService {
  constructor(
    @Inject(CONTACT_REPOSITORY) private readonly repository: IContactRepository,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  async addContact(
    dto: AddContactRequestDto & { ownerId: string },
  ): Promise<Contact> {
    const userToAddToContacts = await this.userService.getData({
      phone: dto.phone,
    });

    const contacts = await this.listContacts(dto.ownerId, { phone: dto.phone });

    if (contacts.length > 0) {
      throw new BadRequestException('Este número já está em sua agenda');
    }

    return this.repository.addContact({
      ...dto,
      contactId: userToAddToContacts.id,
    });
  }

  async getContact(id: string): Promise<Contact> {
    const contact = await this.repository.getContact(id);
    if (!contact) throw new NotFoundException('Contato não encontrado');

    return contact;
  }

  async listContacts(
    ownerId: string,
    query?: FilterContactDto,
  ): Promise<Contact[]> {
    return this.repository.listContacts(ownerId, query);
  }
}
