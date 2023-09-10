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
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { TechnologiesService } from './technologies.service';
import { Technology } from 'src/db/typeorm/entities/technology.entity';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';

@ApiTags('Technologies Controller')
@UseGuards(JwtGuard)
@Controller('api/technologies')
export class TechnologiesController {
  constructor(private technologiesService: TechnologiesService) {}

  @Get()
  @ApiResponse({
    type: [Technology],
  })
  getAll(): Promise<Technology[]> {
    return this.technologiesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Technology,
  })
  getById(@Param('id') id): Promise<Technology> {
    return this.technologiesService.getById(id);
  }

  @Post()
  @ApiResponse({
    type: Technology,
  })
  create(@Body() payload: Technology): Promise<Technology> {
    return this.technologiesService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Technology,
  })
  update(@Param('id') id, @Body() payload: Technology): Promise<Technology> {
    return this.technologiesService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.technologiesService.deleteById(id);
  }
}
