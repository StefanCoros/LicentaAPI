import { ApiProperty } from '@nestjs/swagger';

export class PutCityRequestModel {
  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number;

  @ApiProperty()
  longitude: number;
}
