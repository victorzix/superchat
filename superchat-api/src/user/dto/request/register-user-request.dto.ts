import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class RegisterUserRequestDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  phone: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  password: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  name: string;
}
