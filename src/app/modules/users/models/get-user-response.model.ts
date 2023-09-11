import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

export class GetUserResponseModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: RolesEnum;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
