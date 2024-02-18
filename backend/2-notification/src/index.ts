import express from 'express';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { healthRoutes } from '@/routes';
import { createConnection } from '@/queues/connect';
import { checkElasticSearchConnection } from '@/elasticsearch';
import { consumeAuthEmailMessages } from '@/queues/consumer';
import { config } from '@/config';
import 'express-async-errors';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT ?? 8000;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notification-service', 'debug');

function initializeServer(): void {
  startServer();
  app.use('/api/notification', healthRoutes());
  void startQueue();
  void startElasticSearch();
  log.info('Notification service Initialized');
}

initializeServer();

function startServer(): void {
  try {
    log.info(`Worker with process id of ${process.pid} on notification server has started`);
    app.listen(PORT, () => {
      log.info(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    log.error(`Notification startServer() error:`, error);
  }
}

async function startQueue(): Promise<void> {
  const emailChannel = await createConnection();
  await consumeAuthEmailMessages(emailChannel!);
}

async function startElasticSearch(): Promise<void> {
  await checkElasticSearchConnection();
}

export default app;
