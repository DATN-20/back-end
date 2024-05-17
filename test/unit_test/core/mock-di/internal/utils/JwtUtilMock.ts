import { JwtUtil } from '@core/common/util/jwt/JwtUtil';

export const MockJwtUtilL: Partial<JwtUtil> = {
  signToken: jest.fn(),
  verify: jest.fn(),
};
