import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { Request } from 'express';
import { PermissionsService } from './permissions.service';
import { PermissionsEnum } from './models/enums/permissions.enum';

@ApiTags('Permissions Controller')
@UseGuards(JwtGuard)
@ApiBearerAuth()
@Controller('api/permissions')
export class PermissionsController {
  constructor(
    private permissionsService: PermissionsService,
    private jwtService: JwtService,
  ) {}

  @Get()
  @ApiResponse({
    schema: {
      enum: [PermissionsEnum],
    },
  })
  getAllForCurrentUser(@Req() request: Request): Promise<PermissionsEnum[]> {
    const currentUserEmail =
      (
        this.jwtService.decode(
          (request?.headers?.authorization || '').replace('Bearer ', ''),
        ) as any
      )?.email || null;

    return this.permissionsService.getAllForCurrentUser(currentUserEmail);
  }
}
