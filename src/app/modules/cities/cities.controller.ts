import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from 'src/db/typeorm/entities/city.entity';
import { CitiesService } from './cities.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetCityResponseModel } from './models/get-city-response.model';
import { PostCityRequestModel } from './models/post-city-request.model';
import { PutCityRequestModel } from './models/put-city-request.model';

@ApiTags('Cities Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  @ApiResponse({
    type: [GetCityResponseModel],
  })
  getAll(): Promise<GetCityResponseModel[]> {
    return this.citiesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetCityResponseModel,
  })
  getById(@Param('id') id): Promise<GetCityResponseModel> {
    return this.citiesService.getById(id);
  }

  @Post()
  @ApiBody({
    type: PostCityRequestModel,
  })
  @ApiResponse({
    type: GetCityResponseModel,
  })
  create(@Body() payload: PostCityRequestModel): Promise<GetCityResponseModel> {
    return this.citiesService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({
    type: PutCityRequestModel,
  })
  @ApiResponse({
    type: City,
  })
  update(
    @Param('id') id,
    @Body() payload: PutCityRequestModel,
  ): Promise<GetCityResponseModel> {
    return this.citiesService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.citiesService.deleteById(id);
  }
}
