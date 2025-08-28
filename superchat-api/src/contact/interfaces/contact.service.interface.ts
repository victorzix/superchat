import { Contact } from '@/contact/entities/contact.entity';
import { AddContactRequestDto } from '@/contact/dto/requests/add-contact-request.dto';
import { FilterContactDto } from '@/contact/dto/requests/filter-contact.dto';

export interface IContactService {
  addContact: (
    dto: AddContactRequestDto & { ownerId: string },
  ) => Promise<Contact>;
  getContact: (id: string) => Promise<Contact>;
  listContacts: (
    ownerId: string,
    query?: FilterContactDto,
  ) => Promise<Contact[]>;
}
