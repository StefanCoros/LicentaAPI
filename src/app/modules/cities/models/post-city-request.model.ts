import { ApiProperty } from '@nestjs/swagger';

export class PostCityRequestModel {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
