import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class LoginPayloadDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  phone: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  password: string;
}