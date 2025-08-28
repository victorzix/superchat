import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';
import { IPagination } from '@/shared/interfaces/pagination.interface';

export class FilterContactDto extends IPagination {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Sanitize()
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @Sanitize()
  phone?: string;
}
