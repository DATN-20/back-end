import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetNotificationsQuery {
  @ApiProperty({ default: false })
  @IsOptional()
  isRead: boolean;
}
