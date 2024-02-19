import 'express-async-errors';
import cors from 'cors';
import compression from 'compression';
import cookieSession from 'cookie-session';
import hpp from 'hpp';
import helmet from 'helmet';
import express from 'express';
import { isAxiosError } from 'axios';
import { winstonLogger } from '@rulerchen/tasker-shared-library';
import { config } from './config.js';
import { elasticSearch } from './elasticsearch.js';

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

    // app.use((req, _res, next) => {
    //   if (req.session?.jwt) {
    //     axiosAuthInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosBuyerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosSellerInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosGigInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosMessageInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosOrderInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //     axiosReviewInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;
    //   }
    //   next();
    // });
  }

  standardMiddleware(app) {
    app.use(compression());
    app.use(express.json({ limit: '200mb' }));
    app.use(express.urlencoded({ extended: true, limit: '200mb' }));
  }

  routesMiddleware(app) {
    // appRoutes(app);
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
      // const socketIO = await this.createSocketIO(httpServer);
      // this.socketIOConnections(socketIO);
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }

  // async createSocketIO(httpServer) {
  //   const io = new Server(httpServer, {
  //     cors: {
  //       origin: `${config.CLIENT_URL}`,
  //       methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  //     },
  //   });
  //   const pubClient = createClient({ url: config.REDIS_HOST });
  //   const subClient = pubClient.duplicate();
  //   await Promise.all([pubClient.connect(), subClient.connect()]);
  //   io.adapter(createAdapter(pubClient, subClient));
  //   socketIO = io;
  //   return io;
  // }

  async startHttpServer(httpServer) {
    try {
      log.info(`Gateway server has started with process id ${process.pid}`);
      httpServer.listen(PORT, () => {
        log.info(`Gateway server running on port ${PORT}`);
      });
    } catch (error) {
      log.log('error', 'GatewayService startServer() error method:', error);
    }
  }
}
