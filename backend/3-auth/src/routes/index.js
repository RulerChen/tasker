import { healthRoutes } from './health.js';
// import { verifyGatewayRequest } from '@rulerchen/tasker-shared-library';

// const BASE_PATH = '/api/v1/auth';

export function appRoutes(app) {
  app.use('', healthRoutes());
  // app.use(BASE_PATH, searchRoutes());
  // app.use(BASE_PATH, seedRoutes());

  // app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  // app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
}
