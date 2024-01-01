import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetJobResponseModel } from './models/get-job-response.model';
import { PostJobRequestModel } from './models/post-job-request.model';
import { PutJobRequestModel } from './models/put-job-request.model';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AdminRoleGuard } from 'src/app/@core/guards/admin-role.guard';

@ApiTags('Jobs Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/jobs')
export class JobsController {
  constructor(private jobsService: JobsService, private jwtService: JwtService) {}

  @Get()
  @ApiResponse({
    type: [GetJobResponseModel],
  })
  getAllForCurrentUser(@Req() request: Request): Promise<GetJobResponseModel[]> {
    const currentUserEmail =
    (
      this.jwtService.decode(
        (request?.headers?.authorization || '').replace('Bearer ', ''),
      ) as any
    )?.email || null;

    return this.jobsService.getAllForCurrentUser(currentUserEmail);
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
  @UseGuards(AdminRoleGuard)
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
  @UseGuards(AdminRoleGuard)
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
  @UseGuards(AdminRoleGuard)
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  deleteById(@Param('id') id: number): any {
    return this.jobsService.deleteById(id);
  }
}
