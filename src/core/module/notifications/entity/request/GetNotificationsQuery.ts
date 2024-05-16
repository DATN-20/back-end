import { IsOptional } from 'class-validator';

export class GetNotificationsQuery {
  @IsOptional()
  isRead: boolean;
}
