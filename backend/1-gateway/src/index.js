import express from 'express';
import { GatewayServer } from './server.js';
// import { redisConnection } from '@gateway/redis/redis.connection';

class Application {
  initialize() {
    const app = express();
    const server = new GatewayServer(app);
    server.start();
    // redisConnection.redisConnect();
  }
}

const application = new Application();
application.initialize();
