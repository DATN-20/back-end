import {
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { NotificationService } from './NotificationService';
import { AuthGuard } from '@core/common/guard/AuthGuard';
import { User } from '@core/common/decorator/UserDecorator';
import { NotifcationResponseJson } from './entity/response/NotificationResponseJson';
import { GetNotificationsQuery } from './entity/request/GetNotificationsQuery';
import { NotificationMessage } from '@core/common/resource/message/NotificationMessage';
import { ParamValidator } from '@core/common/util/ParamValidator';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags(NotifiationController.name.replaceAll('Controller', ''))
@Controller('notifications')
@UseGuards(AuthGuard)
export class NotifiationController {
  constructor(private readonly notificationService: NotificationService) {}

  @ApiResponse({ status: HttpStatus.OK, type: NotifcationResponseJson, isArray: true })
  @Get()
  async getNotifications(
    @User() user: UserFromAuthGuard,
    @Query() query_data: GetNotificationsQuery,
  ): Promise<NotifcationResponseJson[]> {
    return this.notificationService.handleGetNotificationOfUser(user.id, query_data);
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Delete()
  async deleteNotifications(@User() user: UserFromAuthGuard): Promise<string> {
    await this.notificationService.handleDeleteNotifications(user.id);
    return NotificationMessage.DELETE_NOTIFICATIONS_SUCCESSFULLY;
  }

  @ApiResponse({ status: HttpStatus.OK, type: String })
  @Patch(':notificationId/change-status')
  async changeStatusOfNotifcation(
    @User() user: UserFromAuthGuard,
    @Param('notificationId', ParamValidator) notification_id: number,
  ): Promise<string> {
    await this.notificationService.handleChangeStatusOfNotification(notification_id, user.id);
    return NotificationMessage.CHANGE_STATUS_SUCCESSFULLY;
  }
}
