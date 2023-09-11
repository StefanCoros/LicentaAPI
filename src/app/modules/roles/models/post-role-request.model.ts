import { ApiProperty } from '@nestjs/swagger';

export class PostRoleRequestModel {
  @ApiProperty()
  role: string;
}
