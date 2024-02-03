import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';
import { CreateNewUserRequest } from './entity/dto/request/CreateNewUserRequest';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}

  async createNewUser(user: CreateNewUserRequest) {}
}
