import { ApiProperty } from '@nestjs/swagger';

export class PostTechnologyRequestModel {
  @ApiProperty()
  name: string;
}
