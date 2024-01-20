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
import { MailerModule } from '@nestjs-modules/mailer';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.getTypeORMConfig(),
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: `smtps://${configService.get(
          'MAILER_SERVICE_EMAIL',
        )}:${configService.get('MAILER_SERVICE_PASSWORD')}@smtp.gmail.com`,
        defaults: {
          from: '"It-Tracker" <ittrackerplatform@gmail.com>',
        },
        template: {
          dir: path.join(
            process.cwd(),
            'src',
            'app',
            '@core',
            'email-templates',
          ),
        },
      }),
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
