import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthStrategy } from './strategies/auth.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigService } from 'src/config/config.service';
import { JwtModule } from '@nestjs/jwt';
import { Request } from 'express';

@Module({
  controllers: [AuthController],
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET_KEY'),
        };
      },
    }),
  ],
  providers: [
    AuthService,
    AuthStrategy,
    {
      provide: JwtStrategy,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return new JwtStrategy(configService.get('JWT_SECRET_KEY'));
      },
    },
  ],
})
export class AuthModule {}
