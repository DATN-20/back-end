import { GenerationRepository } from '@core/module/generation/GenerationRepository';

export const MockGenerationRepository: Partial<GenerationRepository> = {
  getById: jest.fn(),
  getByUserId: jest.fn(),
  create: jest.fn(),
  deleteById: jest.fn(),
  updateIsSentMail: jest.fn(),
  updateIsNotification: jest.fn(),
  updateStatus: jest.fn(),
};
