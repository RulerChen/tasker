import 'express-async-errors';
import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import compression from 'compression';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from './config.js';
import { checkElasticSearchConnection } from './elasticsearch.js';
import { appRoutes } from './routes/index.js';
import { createConnection } from './queues/connect.js';

const PORT = process.env.PORT ?? 8000;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'authenticationServer', 'debug');

export let authChannel;

export function start(app) {
  securityMiddleware(app);
  standardMiddleware(app);
  routesMiddleware(app);
  startQueues();
  startElasticSearch();
  authErrorHandler(app);
  startServer(app);
}

function securityMiddleware(app) {
  app.set('trust proxy', 1);
  app.use(hpp());
  app.use(helmet());
  app.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );
  app.use((req, res, next) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload = jwt.verify(token, config.JWT_TOKEN);
      req.currentUser = payload;
    }
    next();
  });
}

function standardMiddleware(app) {
  app.use(compression());
  app.use(express.json({ limit: '200mb' }));
  app.use(express.urlencoded({ extended: true, limit: '200mb' }));
}

function routesMiddleware(app) {
  appRoutes(app);
}

async function startQueues() {
  authChannel = await createConnection();
}

function startElasticSearch() {
  checkElasticSearchConnection();
  // createIndex('gigs');
}

function authErrorHandler(app) {
  app.use((error, req, res, next) => {
    if (error?.message) {
      log.log('error', 'GatewayService Error:', error);
      res.status(error.status ?? 500).json({ message: 'Error occurred.' });
    }
    next();
  });
}

function startServer(app) {
  try {
    log.info(`Authentication server has started with process id ${process.pid}`);
    app.listen(PORT, () => {
      log.info(`Authentication server running on port ${PORT}`);
    });
  } catch (error) {
    log.log('error', 'AuthService startServer() method error:', error);
  }
}
