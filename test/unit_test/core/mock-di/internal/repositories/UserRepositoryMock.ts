import { UserRepository } from '@core/module/user/UserRepository';

export const MockUserRepository: Partial<UserRepository> = {
  getById: jest.fn(),
  updateProfile: jest.fn(),
  addSocial: jest.fn(),
  updateAvatar: jest.fn(),
  updateBackground: jest.fn(),
  getByEmail: jest.fn(),
  updateToken: jest.fn(),
  create: jest.fn(),
  updatePassword: jest.fn(),
};
