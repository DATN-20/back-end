import { BcryptHash } from '@core/common/util/hash/BcryptHash';

export const MockBcryptHash: Partial<BcryptHash> = {
  compare: jest.fn(),
  hash: jest.fn(),
};
