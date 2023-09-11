import { ApiProperty } from '@nestjs/swagger';

export class PutTechnologyRequestModel {
  @ApiProperty()
  name: string;
}
