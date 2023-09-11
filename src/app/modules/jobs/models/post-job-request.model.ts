import { ApiProperty } from '@nestjs/swagger';

export class PostJobRequestModel {
  @ApiProperty()
  title: string;

  @ApiProperty()
  company: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  salary: string;

  @ApiProperty()
  employeesNumber: string;

  @ApiProperty()
  companyType: string;

  @ApiProperty()
  experienceLevel: string;

  @ApiProperty()
  postType: string;

  @ApiProperty()
  language: string;

  @ApiProperty()
  requirements: string;

  @ApiProperty()
  responsibilities: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  link: string;
}
