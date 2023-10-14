import { ApiProperty } from '@nestjs/swagger';

export class PostResetPasswordRequestModel {
  @ApiProperty()
  password: string;

  @ApiProperty()
  confirmPassword: string;

  @ApiProperty()
  resetPasswordToken: string;
}
