import { Body, Controller, HttpCode, HttpStatus, Post, ValidationPipe } from '@nestjs/common';
import { UserService } from './UserService';

@Controller('users')
export class UserController {
  public constructor(private readonly userService: UserService) {}
}
