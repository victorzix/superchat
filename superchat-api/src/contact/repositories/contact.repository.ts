import { IContactRepository } from '@/contact/interfaces/contact.repository.interface';
import { AddContactDto } from '../dto/requests/add-contact.dto';
import { Contact } from '../entities/contact.entity';
import { PrismaService } from '@/prisma/prisma.service';
import {Injectable} from "@nestjs/common";
import {FilterContactDto} from "@/contact/dto/requests/filter-contact.dto";
import {ContactBuilder} from "@/contact/builders/contact.builder";

@Injectable()
export class ContactRepository implements IContactRepository {
  constructor(private readonly db: PrismaService) {}

  addContact(dto: AddContactDto): Promise<Contact> {
    return this.db.contact.create({ data: dto });
  }

  getContact(id: string): Promise<Contact> {
    return this.db.contact.findUnique({
      where: { id },
    });
  }

  listContacts(
    ownerId: string,
    query?: FilterContactDto,
  ): Promise<Contact[]> {
    return this.db.contact.findMany({
      where: {
        ownerId,
        ...(ContactBuilder.buildFilterContact(query))
      },
      skip: (query.page - 1) * query.limit,
      take: query.limit,
    });
  }
}
