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
import { CitiesService } from './cities.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetCityResponseModel } from './models/get-city-response.model';
import { PostCityLinkRequestModel } from './models/post-city-link-request.model';
import { JwtService } from '@nestjs/jwt';
import { Request, Response } from 'express';

@ApiTags('Cities Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/cities')
export class CitiesController {
  constructor(
    private citiesService: CitiesService,
    private jwtService: JwtService,
  ) {}

  @Get('all')
  @ApiResponse({
    type: [GetCityResponseModel],
  })
  getAll(): Promise<GetCityResponseModel[]> {
    return this.citiesService.getAll();
  }

  @Get()
  @ApiResponse({
    type: [GetCityResponseModel],
  })
  getAllForCurrentUser(
    @Req() request: Request,
  ): Promise<GetCityResponseModel[]> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    return this.citiesService.getAllForCurrentUser(currentUserEmail);
  }

  @Get(':id')
  @ApiParam({
    name: 'id',
    required: true,
    type: 'string',
  })
  @ApiResponse({
    type: GetCityResponseModel,
  })
  async getByIdForCurrentUser(
    @Req() request: Request,
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<GetCityResponseModel>> {
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

      const city = await this.citiesService.getByIdForCurrentUser(
        numberId,
        currentUserEmail,
      );

      if (!city) {
        response.status(204);
      } else {
        response.json(city);
      }
    }

    return response.send();
  }

  @Post()
  @ApiBody({
    type: PostCityLinkRequestModel,
  })
  @ApiResponse({
    type: GetCityResponseModel,
  })
  async createCityLinkForCurrentUser(
    @Req() request: Request,
    @Res() response: Response,
    @Body() payload: PostCityLinkRequestModel,
  ): Promise<Response<GetCityResponseModel>> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    const city = await this.citiesService.createCityLinkForCurrentUser(
      payload,
      currentUserEmail,
    );

    if (!city) {
      response.status(404);
    } else {
      response.json(city);
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

      const wasDeleted = await this.citiesService.deleteCityLinkForCurrentUser(
        numberId,
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
