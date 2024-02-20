import express from 'express';
import { health } from '../controllers/health.js';

const router = express.Router();

export function healthRoutes() {
  router.get('/auth-health', health);

  return router;
}
