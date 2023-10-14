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
import { JobsService } from './jobs.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetJobResponseModel } from './models/get-job-response.model';
import { PostJobRequestModel } from './models/post-job-request.model';
import { PutJobRequestModel } from './models/put-job-request.model';

@ApiTags('Jobs Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService) {}

  @Get()
  @ApiResponse({
    type: [GetJobResponseModel],
  })
  getAll(): Promise<GetJobResponseModel[]> {
    return this.jobsService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetJobResponseModel,
  })
  getById(@Param('id') id): Promise<GetJobResponseModel> {
    return this.jobsService.getById(id);
  }

  @Post()
  @ApiBody({
    type: PostJobRequestModel,
  })
  @ApiResponse({
    type: GetJobResponseModel,
  })
  create(@Body() payload: PostJobRequestModel): Promise<GetJobResponseModel> {
    return this.jobsService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: PutJobRequestModel,
  })
  update(
    @Param('id') id,
    @Body() payload: PutJobRequestModel,
  ): Promise<GetJobResponseModel> {
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
