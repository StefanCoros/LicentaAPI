import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../@core/guards/auth.guard';
import { Request } from 'express';
import { PostLoginRequestModel } from './models/post-login-request.model';
import { PostLoginResponseModel } from './models/post-login-response.model';
import { JwtGuard } from 'src/app/@core/guards/jwt.guard';
import { PostRegisterRequestModel } from './models/post-register-request.model';

@ApiTags('Auth Controller')
@Controller('api/auth')
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
  async login(@Req() request: Request, @Body() payload: PostLoginRequestModel) {
    if (request['user']?.role) {
      payload['role'] = request['user']?.role;
    }

    return this.authService.login(payload);
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(JwtGuard)
  async logout(@Req() request: Request) {
    return this.authService.logout(request);
  }

  @Post('register')
  @ApiBody({
    type: PostRegisterRequestModel
  })
  async register(@Body() payload: PostRegisterRequestModel) {
    return this.authService.register(payload);
  }
}
