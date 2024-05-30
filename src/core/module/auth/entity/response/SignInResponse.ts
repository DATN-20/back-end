import { User } from '@core/module/user/entity/User';
import { SignInResponseJson } from './SignInResponseJson';
import { IResponse } from '@core/common/interface/IResponse';

export class SignInResponse implements IResponse<SignInResponseJson> {
  private accessToken: string;
  private refreshToken: string;

  constructor(access_token: string, refresh_token: string) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }

  public static convertFromUser(user: User): SignInResponse {
    return new SignInResponse(user.accessToken, user.refeshToken);
  }

  public toJson(): SignInResponseJson {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    };
  }
}
