import { HttpStatus } from "@nestjs/common";
import { ErrorBase } from "./ErrorBase";

export class AuthError {
    public static WRONG_USERNAME_OR_PASSWORD: ErrorBase = {
        error_code: '01001',
        message: 'Username or password is wrong',
        status_code: HttpStatus.BAD_REQUEST,
    }
}