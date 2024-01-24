import { ApiProperty } from '@nestjs/swagger';

export class GetCityResponseModel {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  latitude: number | null;

  @ApiProperty()
  longitude: number | null;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
