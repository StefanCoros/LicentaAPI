import { ApiProperty } from '@nestjs/swagger';

export class PutRoleRequestModel {
  @ApiProperty()
  role: string;
}
