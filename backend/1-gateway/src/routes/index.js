// import { authMiddleware } from '../services/auth-middleware.js';
import { healthRoutes } from './health.js';
// import { authRoutes } from '@gateway/routes/auth';
// import { currentUserRoutes } from '@gateway/routes/current-user';
// import { searchRoutes } from '@gateway/routes/search';
// import { buyerRoutes } from '@gateway/routes/buyer';
// import { sellerRoutes } from '@gateway/routes/seller';
// import { gigRoutes } from '@gateway/routes/gig';
// import { messageRoutes } from '@gateway/routes/message';
// import { orderRoutes } from '@gateway/routes/order';
// import { reviewRoutes } from '@gateway/routes/review';
// import { config } from '../config.js';

// const BASE_PATH = `/api/gateway/${config.API_VERSION}`;

export const appRoutes = (app) => {
  app.use('', healthRoutes.routes());
  // app.use(BASE_PATH, authRoutes.routes());
  // app.use(BASE_PATH, searchRoutes.routes());

  // app.use(BASE_PATH, authMiddleware.verifyUser, currentUserRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, buyerRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, sellerRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, gigRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, messageRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, orderRoutes.routes());
  // app.use(BASE_PATH, authMiddleware.verifyUser, reviewRoutes.routes());
};
