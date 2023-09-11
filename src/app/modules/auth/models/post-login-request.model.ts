import { ApiProperty } from '@nestjs/swagger';

export class PostLoginRequestModel {
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
}
