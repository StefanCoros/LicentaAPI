import { Global, Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { DiacriticsService } from './services/diacritics.service';

@Global()
@Module({
  providers: [EmailService, DiacriticsService],
  exports: [EmailService, DiacriticsService],
})
export class CoreModule {}
