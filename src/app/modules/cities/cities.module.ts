import { Module } from '@nestjs/common';
import { CitiesController } from './cities.controller';
import { CitiesService } from './cities.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [CitiesController],
  imports: [JwtModule],
  providers: [CitiesService],
})
export class CitiesModule {}
