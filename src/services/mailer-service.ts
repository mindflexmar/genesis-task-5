import { MailerService } from '@nestjs-modules/mailer';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class NewMailerService {
  constructor(
	@Inject(MailerService)
		private mailerService: MailerService,
	) {}

  public async sendEmail(to: string, subject: string, message: string): Promise<void> {
		try {
			await this.mailerService.sendMail({
				to,
				subject,
				html: `<p>${message}</p>`,
			});
		} catch(error) {
			console.error('Error sending email:', error);
			throw new Error('Failed to send email');
		}
	}
}
