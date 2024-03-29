import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
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
import { TechnologiesService } from './technologies.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetTechnologyResponseModel } from './models/get-technology-response.model';
import { PostTechnologyRequestModel } from './models/post-technology-request.model';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@ApiTags('Technologies Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/technologies')
export class TechnologiesController {
  constructor(
    private technologiesService: TechnologiesService,
    private jwtService: JwtService,
  ) {}

  @Get('all')
  @ApiResponse({
    type: [GetTechnologyResponseModel],
  })
  getAll() {
    return this.technologiesService.getAll();
  }

  @Get()
  @ApiResponse({
    type: [GetTechnologyResponseModel],
  })
  getAllForCurrentUser(
    @Req() request: Request,
  ): Promise<GetTechnologyResponseModel[]> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    return this.technologiesService.getAllForCurrentUser(currentUserEmail);
  }

  @Get(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  async getByIdForCurrentUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<GetTechnologyResponseModel>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const currentUserEmail =
        (
          this.jwtService.decode(
            (request?.headers?.authorization || '').replace('Bearer ', ''),
          ) as any
        )?.email || null;

      const technology = await this.technologiesService.getByIdForCurrentUser(
        numberId,
        currentUserEmail,
      );

      if (!technology) {
        response.status(204);
      } else {
        response.json(technology);
      }
    }

    return response.send();
  }

  @Post()
  @ApiBody({
    type: PostTechnologyRequestModel,
  })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  async createTechnologyLinkForCurrentUser(
    @Req() request: Request,
    @Res() response: Response,
    @Body() payload: PostTechnologyRequestModel,
  ): Promise<Response<GetTechnologyResponseModel>> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    const technology =
      await this.technologiesService.createTechnologyLinkForCurrentUser(
        payload,
        currentUserEmail,
      );

    if (!technology) {
      response.status(404);
    } else {
      response.json(technology);
    }

    return response.send();
  }

  @Delete(':id')
  @ApiParam({ name: 'id', required: true, type: 'string' })
  @ApiResponse({
    type: Boolean,
  })
  async deleteById(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<Boolean>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      const currentUserEmail =
        (
          this.jwtService.decode(
            (request?.headers?.authorization || '').replace('Bearer ', ''),
          ) as any
        )?.email || null;

      const wasDeleted =
        await this.technologiesService.deleteTechnologyLinkForCurrentUser(
          parseInt(id, 10),
          currentUserEmail,
        );

      if (!wasDeleted) {
        response.status(404);
      } else {
        response.status(200);
      }
    }

    return response.send();
  }
}
