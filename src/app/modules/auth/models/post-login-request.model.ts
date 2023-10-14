import { ApiProperty } from '@nestjs/swagger';
import { Role } from 'src/db/typeorm/entities/role.entity';

export class PostLoginRequestModel {
  @ApiProperty()
  email: string;

  @ApiProperty()
  password: string;
}
