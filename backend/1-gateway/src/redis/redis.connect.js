import { createClient } from 'redis';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from '../config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'gatewayRedisConnection', 'debug');

class RedisConnection {
  constructor() {
    this.client = createClient({ url: `${config.REDIS_HOST}` });
  }

  async redisConnect() {
    try {
      await this.client.connect();
      log.info(`GatewayService Redis Connection: ${await this.client.ping()}`);
      this.cacheError();
    } catch (error) {
      log.log('error', 'GatewayService redisConnect() method error:', error);
    }
  }

  cacheError() {
    this.client.on('error', (error) => {
      log.error(error);
    });
  }
}

export const redisConnection = new RedisConnection();
