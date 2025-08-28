import { Contact } from '@/contact/entities/contact.entity';
import { AddContactDto } from '@/contact/dto/requests/add-contact.dto';
import {FilterContactDto} from "@/contact/dto/requests/filter-contact.dto";

export interface IContactRepository {
  addContact: (dto: AddContactDto) => Promise<Contact>;
  getContact: (id: string) => Promise<Contact>;
  listContacts: (
    ownerId: string,
    query?: FilterContactDto,
  ) => Promise<Contact[]>;
}
