import { Client } from '@elastic/elasticsearch';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from './config.js';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkElasticSearchConnection() {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`Auth service Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.error('Auth service checkElasticSearchConnection() method error:', error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
