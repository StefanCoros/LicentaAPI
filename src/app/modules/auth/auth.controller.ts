import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../@core/guards/auth.guard';
import { Request, Response } from 'express';
import { PostLoginRequestModel } from './models/post-login-request.model';
import { PostLoginResponseModel } from './models/post-login-response.model';

@ApiTags('Admin Controller | Auth Controller')
@Controller('api/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    type: PostLoginRequestModel,
  })
  @ApiResponse({
    type: PostLoginResponseModel,
  })
  @UseGuards(AuthGuard)
  async login(
    @Req() request: Request,
    @Body() payload: any,
    @Res() response: Response,
  ) {
    if (request['user']?.role) {
      payload['role'] = request['user']?.role;
    }

    const result = await this.authService.login(payload);

    return response.send(result);
  }
}
