import express from 'express';
import { CurrentUser } from '../controllers/auth/current-user.js';
import { Refresh } from '../controllers/auth/refresh-token.js';
import { authMiddleware } from '../services/auth-middleware.js';

class CurrentUserRoutes {
  constructor() {
    this.router = express.Router();
  }

  routes() {
    this.router.get('/auth/currentuser', authMiddleware.checkAuthentication, CurrentUser.prototype.read);
    this.router.get('/auth/refresh-token/:username', authMiddleware.checkAuthentication, Refresh.prototype.token);

    return this.router;
  }
}

export const currentUserRoutes = new CurrentUserRoutes();
