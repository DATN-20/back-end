import { Controller, Get, Param, Patch, Query, UseGuards } from '@nestjs/common';
import { NotificationService } from './NotificationService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { NotifcationResponseJson } from './entity/response/NotificationResponseJson';
import { GetNotificationsQuery } from './entity/request/GetNotificationsQuery';
import { NotificationMessage } from '@core/common/resource/message/NotificationMessage';

@Controller('notifications')
@UseGuards(AuthGuard)
export class NotifiationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  async getNotifications(
    @User() user: UserFromAuthGuard,
    @Query() query_data: GetNotificationsQuery,
  ): Promise<NotifcationResponseJson[]> {
    return this.notificationService.handleGetNotificationOfUser(user.id, query_data);
  }

  @Patch(':notificationId/change-status')
  async changeStatusOfNotifcation(
    @User() user: UserFromAuthGuard,
    @Param('notificationId') notification_id: number,
  ): Promise<string> {
    await this.notificationService.handleChangeStatusOfNotification(notification_id, user.id);
    return NotificationMessage.CHANGE_STATUS_SUCCESSFULLY;
  }
}
