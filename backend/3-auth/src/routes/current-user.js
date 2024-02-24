import { read } from '../controllers/current-user.js';
import { token } from '../controllers/refresh-token.js';
import express from 'express';

const router = express.Router();

export function currentUserRoutes() {
  router.get('/currentuser', read);
  router.get('/refresh-token/:username', token);

  return router;
}
