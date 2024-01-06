import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { JobsService } from './jobs.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetJobResponseModel } from './models/get-job-response.model';
import { PostJobRequestModel } from './models/post-job-request.model';
import { PutJobRequestModel } from './models/put-job-request.model';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';
import { AdminRoleGuard } from 'src/app/@core/guards/admin-role.guard';

@ApiTags('Jobs Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/jobs')
export class JobsController {
  constructor(
    private jobsService: JobsService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @ApiResponse({
    type: [GetJobResponseModel],
  })
  getAllForCurrentUser(
    @Req() request: Request,
  ): Promise<GetJobResponseModel[]> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    return this.jobsService.getAllForCurrentUser(currentUserEmail);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: GetJobResponseModel,
  })
  async getById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<GetJobResponseModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.jobsService.getById(numberId);

      return response.send(result);
    }

    return response.send();
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
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: PutJobRequestModel,
  })
  async update(
    @Res() response: Response,
    @Param('id') id: string,
    @Body() payload: PutJobRequestModel,
  ): Promise<Response<PutJobRequestModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.jobsService.updateById(numberId, payload);

      return response.send(result);
    }

    return response.send();
  }

  @Delete(':id')
  @UseGuards(AdminRoleGuard)
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: Boolean,
  })
  async deleteById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<Boolean>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const result = await this.jobsService.deleteById(numberId);

      return response.send(result);
    }

    return response.send();
  }
}
