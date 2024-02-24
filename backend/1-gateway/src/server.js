import 'express-async-errors';
import { isAxiosError } from 'axios';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import express from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { appRoutes } from './routes/index.js';
import { config } from './config.js';
import { elasticSearch } from './elasticsearch.js';
import { axiosAuthInstance } from './services/api/auth.service.js';

const PORT = process.env.PORT ?? 8000;
const log = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'apiGatewayServer', 'debug');

export class GatewayServer {
  constructor(app) {
    this.app = app;
  }

  start() {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.startElasticSearch();
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  securityMiddleware(app) {
    app.set('trust proxy', 1);
    app.use(
      cookieSession({
        name: 'session',
        keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
        maxAge: 24 * 7 * 3600000,
        secure: config.NODE_ENV !== 'development',
        ...(config.NODE_ENV !== 'development' && {
          sameSite: 'none',
        }),
      }),
    );
    app.use(hpp());
    app.use(helmet());
    app.use(
      cors({
        origin: config.CLIENT_URL,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      }),
    );

    app.use((req, res, next) => {
      if (req.session?.jwt) {
        axiosAuthInstance.defaults.headers.Authorization = `Bearer ${req.session?.jwt}`;
      }
      next();
    });
  }

  standardMiddleware(app) {
    app.use(compression());
    app.use(express.json({ limit: '200mb' }));
    app.use(express.urlencoded({ extended: true, limit: '200mb' }));
  }

  routesMiddleware(app) {
    appRoutes(app);
  }

  startElasticSearch() {
    elasticSearch.checkConnection();
  }

  errorHandler(app) {
    app.use('*', (req, res, next) => {
      const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      log.log('error', `${fullUrl} endpoint does not exist.`, '');
      res.status(404).json({ message: 'The endpoint called does not exist.' });
      next();
    });

    app.use((error, req, res, next) => {
      if (error?.message) {
        log.log('error', 'GatewayService Error:', error);
        res.status(error.status ?? 500).json({ message: 'Error occurred.' });
      }

      if (isAxiosError(error)) {
        log.log('error', `GatewayService Axios Error - ${error?.response?.data?.comingFrom}:`, error);
        res.status(error?.response?.data?.statusCode ?? 500).json({ message: error?.response?.data?.message ?? 'Error occurred.' });
      }

      next();
    });
  }

  async startServer(app) {
    try {
      this.startHttpServer(app);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  startHttpServer(app) {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      app.listen(PORT, () => {
        log.info(`Gateway server running on port ${PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }
}
