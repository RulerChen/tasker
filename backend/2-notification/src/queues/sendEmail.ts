import path from 'path';
import nodemailer, { type Transporter } from 'nodemailer';
import { config } from '@/config';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import Email from 'email-templates';
import { type EmailLocals } from '@/types';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'mailTransport', 'debug');

async function sendEmail(template: string, receiverEmail: string, locals: EmailLocals): Promise<void> {
  try {
    emailTemplates(template, receiverEmail, locals);
    log.info('Email sent successfully.');
  } catch (error) {
    log.log('error', 'Notification service MailTransport sendEmail() method error:', error);
  }
}

async function emailTemplates(template: string, receiver: string, locals: EmailLocals): Promise<void> {
  try {
    const smtpTransport: Transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.email',
      port: 465,
      auth: {
        user: config.SENDER_EMAIL,
        pass: config.SENDER_EMAIL_PASSWORD,
      },
    });
    const email: Email = new Email({
      message: {
        from: `Tasker <${config.SENDER_EMAIL}>`,
      },
      send: true,
      preview: false,
      transport: smtpTransport,
      views: {
        options: {
          extension: 'ejs',
        },
      },
      juice: true,
      juiceResources: {
        preserveImportant: true,
        webResources: {
          relativeTo: path.join(__dirname, '../build'),
        },
      },
    });

    await email.send({
      template: path.join(__dirname, '..', 'emails', template),
      message: { to: receiver },
      locals,
    });
  } catch (error) {
    log.error('Notification service EmailTemplates emailTemplates() method error:', error);
  }
}

export { sendEmail };
