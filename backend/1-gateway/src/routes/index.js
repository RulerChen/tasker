import { authMiddleware } from '../services/auth-middleware.js';
import { healthRoutes } from './health.js';
import { authRoutes } from './auth.js';
import { currentUserRoutes } from './current-user.js';
import { config } from '../config.js';

const BASE_PATH = `/api/${config.API_VERSION}/gateway`;

export const appRoutes = (app) => {
  app.use('', healthRoutes.routes());
  app.use(BASE_PATH, authRoutes.routes());

  app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
};
