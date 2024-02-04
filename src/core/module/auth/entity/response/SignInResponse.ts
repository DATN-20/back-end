import { User } from '@core/module/user/entity/User';

export class SignInResponse {
  private accessToken: string;
  private refreshToken: string;

  constructor(access_token: string, refresh_token: string) {
    this.accessToken = access_token;
    this.refreshToken = refresh_token;
  }

  public static convertFromUser(user: User) {
    return new SignInResponse(user.accessToken, user.refeshToken);
  }

  public toJson() {
    return {
      access_token: this.accessToken,
      refresh_token: this.refreshToken,
    };
  }
}
