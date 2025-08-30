import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';

export class SendMessageRequestDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  messageText: string;

  @ApiProperty()
  @IsString()
  @Sanitize()
  chatId: string;
}
