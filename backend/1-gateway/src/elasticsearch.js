import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { Client } from '@elastic/elasticsearch';
import { config } from './config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayElasticConnection', 'debug');

class ElasticSearch {
  constructor() {
    this.elasticSearchClient = new Client({
      node: `${config.ELASTIC_SEARCH_URL}`,
    });
  }

  async checkConnection() {
    let isConnected = false;
    while (!isConnected) {
      log.info('GatewayService Connecting to ElasticSearch');
      try {
        const health = await this.elasticSearchClient.cluster.health({});
        log.info(`GatewayService ElasticSearch health status - ${health.status}`);
        isConnected = true;
      } catch (error) {
        log.error('Connection to ElasticSearch failed, Retrying...');
        log.log('error', 'GatewayService checkConnection() method error:', error);
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }
}

export const elasticSearch = new ElasticSearch();
