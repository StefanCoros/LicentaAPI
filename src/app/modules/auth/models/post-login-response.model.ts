import { ApiProperty } from '@nestjs/swagger';
import { RolesEnum } from 'src/app/@core/models/enums/roles.enum';

export class PostLoginResponseModel {
  @ApiProperty()
  email: string;
  @ApiProperty()
  role: RolesEnum;
}
