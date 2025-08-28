import { ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthGuard } from '@/shared/guards/auth.guard';
import { CONTACT_SERVICE } from '@/shared/symbols';
import { IContactService } from '@/contact/interfaces/contact.service.interface';
import { AddContactRequestDto } from '@/contact/dto/requests/add-contact-request.dto';
import { FilterContactDto } from '@/contact/dto/requests/filter-contact.dto';

@ApiTags('Contatos')
@Controller('contact')
export class ContactController {
  constructor(
    @Inject(CONTACT_SERVICE) private readonly contactService: IContactService,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  async addContact(@Req() req: Request, @Body() dto: AddContactRequestDto) {
    return this.contactService.addContact({ ...dto, ownerId: req.user.sub });
  }

  @UseGuards(AuthGuard)
  @Get()
  async listContact(@Req() req: Request, @Query() query?: FilterContactDto) {
    return this.contactService.listContacts(req.user.sub, query);
  }

  @Get(':id')
  async getContact(@Param('id') id: string) {
    return this.contactService.getContact(id);
  }
}
