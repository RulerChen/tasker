import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { type Channel, type ConsumeMessage } from 'amqplib';
import { sendEmail } from '@/queues/sendEmail';
import { config } from '@/config';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'emailConsumer', 'debug');

async function consumeAuthEmailMessages(channel: Channel): Promise<void> {
  try {
    const exchangeName = 'tasker-email-notifications';
    const routingKey = 'auth-email';
    const queueName = 'auth-email-queue';
    await channel.assertExchange(exchangeName, 'direct');
    const queue = await channel.assertQueue(queueName, { durable: true, autoDelete: false });
    await channel.bindQueue(queue.queue, exchangeName, routingKey);
    channel.consume(queue.queue, async (msg: ConsumeMessage | null) => {
      const { receiverEmail, username, verifyLink, resetLink, template } = JSON.parse(msg!.content.toString());
      const locals = {
        appLink: `${config.CLIENT_URL}`,
        appIcon: 'https://i.ibb.co/Q8qTQG6/logo.png',
        username,
        verifyLink,
        resetLink,
      };
      await sendEmail(template, receiverEmail, locals);
      channel.ack(msg!);
    });
  } catch (error) {
    log.log('error', 'NotificatioService EmailConsumer consumeAuthEmailMessages() method error:', error);
  }
}

export { consumeAuthEmailMessages };
