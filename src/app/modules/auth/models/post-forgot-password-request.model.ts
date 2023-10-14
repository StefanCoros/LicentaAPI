import { ApiProperty } from '@nestjs/swagger';

export class PostForgotPasswordRequestModel {
  @ApiProperty()
  email: string;
}
