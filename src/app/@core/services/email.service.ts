import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { PostForgotPasswordRequestModel } from 'src/app/modules/auth/models/post-forgot-password-request.model';
import { ConfigService } from 'src/config/config.service';

@Injectable()
export class EmailService {
  constructor(
    private configService: ConfigService,
    private mailerService: MailerService,
  ) {}

  async sendForgotPasswordEmail(
    payload: PostForgotPasswordRequestModel,
    link: string,
  ) {
    return this.mailerService
      .sendMail({
        to: payload.email,
        from: 'support@it-tracker.com',
        subject: 'Setup new password',
        text: `Use this link to update your password ${link}`,
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
