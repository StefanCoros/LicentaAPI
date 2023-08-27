import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { CoreModule } from './@core/core.module';
import { CitiesModule } from './modules/cities/cities.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getTypeORMConfig(),
    }),
    CoreModule,
    CitiesModule,
  ],
})
export class AppModule {}
