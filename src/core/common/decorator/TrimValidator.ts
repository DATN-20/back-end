import { Transform } from 'class-transformer';

export const TrimValidator = () => {
  return Transform(({ value }) => (typeof value === 'string' ? value.trim() : value));
};
