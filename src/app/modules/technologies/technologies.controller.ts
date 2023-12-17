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
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  async getByIdForCurrentUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id,
  ): Promise<Response> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    const technology = await this.technologiesService.getByIdForCurrentUser(
      parseInt(id, 10),
      currentUserEmail,
    );

    if (!technology) {
      response.status(204);
    } else {
      response.json(technology);
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
  ): Promise<Response> {
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

  /**
   * @todo Only an admin should be able to edit technologies
  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({
    type: PutTechnologyRequestModel,
  })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  update(
    @Param('id') id,
    @Body() payload: PutTechnologyRequestModel,
  ): Promise<GetTechnologyResponseModel> {
    return this.technologiesService.updateById(id, payload);
  } */

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  async deleteById(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response> {
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

    return response.send();
  }
}
