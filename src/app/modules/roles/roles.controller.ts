import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
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
import { RolesService } from './roles.service';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { GetRoleResponseModel } from './models/get-role-response.model';
import { PostRoleRequestModel } from './models/post-role-request.model';
import { PutRoleRequestModel } from './models/put-role-request.model';
import { AdminRoleGuard } from 'src/app/@core/guards/admin-role.guard';
import { Response } from 'express';
import { ApiError } from 'src/app/@core/models/api-error.model';

@ApiTags('Roles Controller')
@UseGuards(JwtGuard, AdminRoleGuard)
@ApiBearerAuth()
@Controller('api/roles')
export class RolesController {
  constructor(private rolesService: RolesService) {}

  @Get()
  @ApiResponse({
    type: [GetRoleResponseModel],
  })
  getAll(): Promise<GetRoleResponseModel[]> {
    return this.rolesService.getAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: GetRoleResponseModel,
  })
  getById(@Param('id') id): Promise<GetRoleResponseModel> {
    return this.rolesService.getById(id);
  }

  @Post()
  @ApiBody({
    type: PostRoleRequestModel,
  })
  @ApiResponse({
    type: GetRoleResponseModel,
  })
  create(@Body() payload: PostRoleRequestModel): Promise<GetRoleResponseModel> {
    return this.rolesService.create(payload);
  }

  @Put(':id')
  @ApiParam({ name: 'id' })
  @ApiBody({
    type: PutRoleRequestModel,
  })
  @ApiResponse({
    type: GetRoleResponseModel,
  })
  update(
    @Param('id') id,
    @Body() payload: PutRoleRequestModel,
  ): Promise<GetRoleResponseModel> {
    return this.rolesService.updateById(id, payload);
  }

  @Delete(':id')
  @ApiParam({ name: 'id' })
  @ApiResponse({
    type: Boolean,
  })
  async deleteById(
    @Res() response: Response,
    @Param('id') id: string,
  ): Promise<Response<Boolean | string>> {
    const numberId = parseInt(id, 10);

    if (!numberId) {
      response.status(400);
    } else {
      let result = false;

      try {
        result = await this.rolesService.deleteById(numberId);

        return response.send(result);
      } catch (error) {
        if (error instanceof ApiError) {
          response.status(403);
          response.write(error.message);
        }
      } finally {
        return response.send(false);
      }
    }

    return response.send();
  }
}
