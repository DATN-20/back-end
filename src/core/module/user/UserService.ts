import { Injectable } from '@nestjs/common';
import { UserRepository } from './UserRepository';

@Injectable()
export class UserService {
  public constructor(private readonly userRepository: UserRepository) {}
}
