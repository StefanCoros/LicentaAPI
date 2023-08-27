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
import { JobsService } from './jobs.service';
import { Job } from 'src/db/typeorm/entities/job.entity';

@ApiTags('Jobs Controller')
@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiResponse({
    type: [Job],
  })
  getAll(): Promise<Job[]> {
    return this.jobsService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Job,
  })
  getById(@Param('id') id): Promise<Job> {
    return this.jobsService.getById(id);
  }

  @Post()
  @ApiResponse({
    type: Job,
  })
  create(@Body() payload: Job): Promise<Job> {
    return this.jobsService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Job,
  })
  update(@Param('id') id, @Body() payload: Job): Promise<Job> {
    return this.jobsService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.jobsService.deleteById(id);
  }
}
