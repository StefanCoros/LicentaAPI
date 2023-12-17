import { Module } from '@nestjs/common';
import { TechnologiesController } from './technologies.controller';
import { TechnologiesService } from './technologies.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [TechnologiesController],
  imports: [JwtModule],
  providers: [TechnologiesService],
})
export class TechnologiesModule {}
