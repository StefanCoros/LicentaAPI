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
import { PostForgotPasswordRequestModel } from './models/post-forgot-password-request.model';
import { PostResetPasswordRequestModel } from './models/post-reset-password-request.model';

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
    // @ts-ignore ignore as it overlycomplicates things to check typings
    if (request['user']?.role?.role) {
      // @ts-ignore ignore as it overlycomplicates things to check typings
      payload['role'] = request['user']?.role?.role;
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

  @Post('forgot-password')
  @ApiBody({
    type: PostForgotPasswordRequestModel
  })
  async forgotPassword(@Req() request: Request, @Body() payload: PostForgotPasswordRequestModel) {
    return this.authService.forgotPassword(request, payload);
  }

  @Post('reset-password')
  @ApiBody({
    type: PostResetPasswordRequestModel
  })
  async resetPassword(@Body() payload: PostResetPasswordRequestModel) {
    return this.authService.resetPassword(payload);
  }
}
