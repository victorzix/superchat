import { FilterContactDto } from '@/contact/dto/requests/filter-contact.dto';

export class ContactBuilder {
  static buildFilterContact(entry: FilterContactDto) {
    if (!entry) return {};

    const or: any[] = [];

    if (entry.name) {
      or.push({ name: { contains: entry.name, mode: 'insensitive' } });
    }

    if (entry.phone) {
      or.push({ phone: { contains: entry.phone } });
    }

    if (or.length === 0) return {};

    return { OR: or };
  }
}
