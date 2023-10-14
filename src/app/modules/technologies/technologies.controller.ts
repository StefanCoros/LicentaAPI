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
import { TechnologiesService } from './technologies.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetTechnologyResponseModel } from './models/get-technology-response.model';
import { PostTechnologyRequestModel } from './models/post-technology-request.model';
import { PutTechnologyRequestModel } from './models/put-technology-request.model';

@ApiTags('Technologies Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/technologies')
export class TechnologiesController {
  constructor(private technologiesService: TechnologiesService) {}

  @Get()
  @ApiResponse({
    type: [GetTechnologyResponseModel],
  })
  getAll(): Promise<GetTechnologyResponseModel[]> {
    return this.technologiesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  getById(@Param('id') id): Promise<GetTechnologyResponseModel> {
    return this.technologiesService.getById(id);
  }

  @Post()
  @ApiBody({
    type: PostTechnologyRequestModel,
  })
  @ApiResponse({
    type: GetTechnologyResponseModel,
  })
  create(
    @Body() payload: PostTechnologyRequestModel,
  ): Promise<GetTechnologyResponseModel> {
    return this.technologiesService.create(payload);
  }

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
