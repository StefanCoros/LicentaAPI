import { Module } from '@nestjs/common';
import { ConfigModule } from 'src/config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from 'src/config/config.service';
import { CoreModule } from './@core/core.module';
import { AuthModule } from './modules/auth/auth.module';
import { CitiesModule } from './modules/cities/cities.module';
import { JobsModule } from './modules/jobs/jobs.module';
import { RolesModule } from './modules/roles/roles.module';
import { TechnologiesModule } from './modules/technologies/technologies.module';
import { UsersModule } from './modules/users/users.module';

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
    AuthModule,
    CitiesModule,
    JobsModule,
    RolesModule,
    TechnologiesModule,
    UsersModule,
  ],
})
export class AppModule {}
