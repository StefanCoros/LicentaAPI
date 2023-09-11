import { ApiProperty } from '@nestjs/swagger';

export class GetRoleResponseModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  role: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
