import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from '../config.js';
import { createConnection } from './connect.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authServiceProducer', 'debug');

export async function publishDirectMessage(channel, exchangeName, routingKey, message, logMessage) {
  try {
    if (!channel) {
      channel = await createConnection();
    }
    await channel.assertExchange(exchangeName, 'direct');
    channel.publish(exchangeName, routingKey, Buffer.from(message));
    log.info(logMessage);
  } catch (error) {
    log.log('error', 'AuthService Provider publishDirectMessage() method error:', error);
  }
}
