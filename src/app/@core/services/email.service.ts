import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PostForgotPasswordRequestModel } from 'src/app/modules/auth/models/post-forgot-password-request.model';
import { ConfigService } from 'src/config/config.service';
import { User } from 'src/db/typeorm/entities/user.entity';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendRegistrationConfirmationEmail(user: User, password: string) {
    return this.mailerService
      .sendMail({
        to: user?.email,
        from: 'support@it-tracker.com',
        subject: `Bine ai venit pe platforma IT Tracker, ${user.firstName}`,
        text: `Bine ai venit pe platforma IT Tracker. Foloseste această parolă "${password}" la prima logare.`,
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async sendForgotPasswordEmail(
    payload: PostForgotPasswordRequestModel,
    link: string,
  ) {
    return this.mailerService
      .sendMail({
        to: payload.email,
        from: 'support@it-tracker.com',
        subject: 'Setare parolă nouă',
        text: `Foloseşte acest link ${link} pentru a reseta parola`,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
