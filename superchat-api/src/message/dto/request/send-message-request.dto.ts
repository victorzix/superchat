import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { Sanitize } from '@/shared/decorators/sanitize.decorator';
import { MessageType } from '@/message/enums/MessageType.enum';

export class SendMessageRequestDto {
  @ApiProperty()
  @IsString()
  @Sanitize()
  chatId: string;

  @ApiPropertyOptional()
  @IsString()
  @Sanitize()
  messageText: string;

  @ApiPropertyOptional()
  @IsString()
  filePath?: string;

  @ApiPropertyOptional()
  @IsString()
  fileType?: string;

  @ApiPropertyOptional()
  @IsString()
  fileName?: string;

  @ApiProperty()
  @IsEnum(MessageType)
  messageType: MessageType;
}
