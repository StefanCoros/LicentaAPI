import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [JobsController],
  imports: [JwtModule],
  providers: [JobsService],
})
export class JobsModule {}
