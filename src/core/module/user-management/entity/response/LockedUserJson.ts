import { LockUserType } from '@core/common/enum/LockUserType';
import { ApiProperty } from '@nestjs/swagger';

export class LockedUserJson {
  @ApiProperty()
  user_id: number;
  @ApiProperty()
  type: LockUserType;
  @ApiProperty()
  locked_at: Date;
  @ApiProperty()
  expired_at: Date;
}
