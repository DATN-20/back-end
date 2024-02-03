import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './UserService';
import { AuthMessage } from '@core/common/resource/message/AuthMessage';
import { CreateNewUserRequest } from './entity/dto/request/CreateNewUserRequest';

@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleCreateNewUser(
    @Body(new ValidationPipe()) body: CreateNewUserRequest,
  ) {
    const new_user = await this.userService.createNewUser(body);

    return AuthMessage.CREATE_NEW_USER_SUCCESSFULLY;
  }
}
