import { Client } from '@elastic/elasticsearch';
import { config } from '@/config';
import { winstonLogger } from '@rulerchen/tasker-shared-library';

const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_URL}`,
});

export async function checkElasticSearchConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    try {
      const health = await elasticSearchClient.cluster.health({});
      log.info(`Notification service Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.error('Notification service checkElasticSearchConnection() error:', error);
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
}
