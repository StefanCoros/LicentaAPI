import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

export class PutUserRequestModel {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;

  @ApiProperty()
  role: RolesEnum;
}
