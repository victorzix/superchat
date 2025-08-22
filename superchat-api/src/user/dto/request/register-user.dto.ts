import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';
import { Type } from 'class-transformer';

export class RegisterUserDto {
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

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  birthDate: Date;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Sanitize()
  profilePicture?: string;
}
