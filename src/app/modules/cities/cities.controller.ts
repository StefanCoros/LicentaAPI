import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { City } from 'src/db/typeorm/entities/city.entity';
import { CitiesService } from './cities.service';

@ApiTags('Cities Controller')
@Controller('api/cities')
export class CitiesController {
  constructor(private citiesService: CitiesService) {}

  @Get()
  @ApiResponse({
    type: [City],
  })
  getAll(): Promise<City[]> {
    return this.citiesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: City,
  })
  getById(@Param('id') id): Promise<City> {
    return this.citiesService.getById(id);
  }

  @Post()
  @ApiResponse({
    type: City,
  })
  create(@Body() payload: City): Promise<City> {
    return this.citiesService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: City,
  })
  update(@Param('id') id, @Body() payload: City): Promise<City> {
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
