import { LockedUserRepository } from '@core/module/user-management/repositories/LockedUserRepository';

export const MockLockedUserRepository: Partial<LockedUserRepository> = {
  getByUserId: jest.fn(),
  delete: jest.fn(),
};
