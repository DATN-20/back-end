import { Readable } from 'stream';

export const SINGLE_FILE_MOCK: Express.Multer.File = {
  fieldname: 'avatar',
  originalname: 'avatar.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  size: 1024,
  buffer: Buffer.from('...'),
  stream: new Readable(),
  destination: '',
  filename: '',
  path: '',
};
