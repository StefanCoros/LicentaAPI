import { Module } from '@nestjs/common';
import { PermissionsController } from './permissions.controller';
import { JwtModule } from '@nestjs/jwt';
import { PermissionsService } from './permissions.service';

@Module({
  controllers: [PermissionsController],
  imports: [JwtModule],
  providers: [PermissionsService],
})
export class PermissionsModule {}
