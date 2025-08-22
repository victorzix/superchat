import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class RegisterUserDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  phone: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  password: string;
}
