import express from 'express';
import { create } from '../controllers/signup.js';
import { read } from '../controllers/signin.js';
import { update } from '../controllers/verify-email.js';

const router = express.Router();

export function authRoutes() {
  router.post('/signup', create);
  router.post('/signin', read);
  router.put('/verify-email', update);

  return router;
}
