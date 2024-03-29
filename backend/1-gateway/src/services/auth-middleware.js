import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class AuthMiddleware {
  verifyUser(req, res, next) {
    if (!req.session?.jwt) {
      throw new Error('Token is not available. Please login again.');
    }

    try {
      const payload = jwt.verify(req.session?.jwt, `${config.JWT_TOKEN}`);
      req.currentUser = payload;
    } catch (error) {
      throw new Error('Token is not available. Please login again.');
    }
    next();
  }

  checkAuthentication(req, res, next) {
    if (!req.currentUser) {
      throw new Error('Authentication is required to access this route.');
    }
    next();
  }
}

export const authMiddleware = new AuthMiddleware();
