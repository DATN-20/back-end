import { HttpStatus } from '@nestjs/common';
import { ErrorBase } from './ErrorBase';

export class MailError {

    public static SEND_MAIL_FAILED: ErrorBase = {
        error_code: '02001',
        message: 'Send mail failed!',
        status_code: HttpStatus.INTERNAL_SERVER_ERROR,
    };
}
