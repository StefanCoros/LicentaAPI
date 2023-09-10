import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { AuthGuard } from '../../@core/guards/auth.guard';
import { Request, Response } from 'express';

@ApiTags('Admin Controller | Auth Controller')
@Controller('api/admin/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiBody({
    schema: {
      properties: {
        email: {
          type: 'string',
        },
        password: {
          type: 'string',
        },
      },
    },
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

    const { accessJwt, ...result } = await this.authService.login(payload);

    response.cookie('accessJwt', accessJwt, {
      httpOnly: process.env.NODE_ENV === 'development',
    });

    return response.send(result);
  }
}
