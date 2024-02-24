import { verifyGatewayRequest } from '@rulerchen/tasker-shared-library';
import { healthRoutes } from './health.js';
import { authRoutes } from './auth.js';
import { currentUserRoutes } from './current-user.js';
import { config } from '../config.js';

const BASE_PATH = `/api/${config.API_VERSION}/auth`;

export function appRoutes(app) {
  app.use('', healthRoutes());
  // app.use(BASE_PATH, searchRoutes());
  // app.use(BASE_PATH, seedRoutes());

  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
}
