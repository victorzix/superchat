import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class AddContactRequestDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  name: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  phone: string;
}
