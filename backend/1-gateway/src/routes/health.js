import express from 'express';
import { Health } from '../controllers/health.js';

class HealthRoutes {
  constructor() {
    this.router = express.Router();
  }

  routes() {
    this.router.get('/health', Health.prototype.health);
    return this.router;
  }
}

export const healthRoutes = new HealthRoutes();
