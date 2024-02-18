import { config } from '@/config';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import client, { type Channel, type Connection } from 'amqplib';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationQueueConnection', 'debug');

async function createConnection(): Promise<Channel | undefined> {
  try {
    const connection = await client.connect(`${config.RABBITMQ_ENDPOINT}`);
    const channel: Channel = await connection.createChannel();
    log.info('Notification server connected to queue successfully');
    closeConnection(channel, connection);
    return channel;
  } catch (error) {
    log.error('Notification service createConnection() error:', error);
  }
}

function closeConnection(channel: Channel, connection: Connection): void {
  process.once('SIGINT', async () => {
    await channel.close();
    await connection.close();
  });
}

export { createConnection };
