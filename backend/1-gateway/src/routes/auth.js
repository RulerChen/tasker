import { SignIn } from '../controllers/auth/signin.js';
import { SignOut } from '../controllers/auth/signout.js';
import { SignUp } from '../controllers/auth/signup.js';
import { VerifyEmail } from '../controllers/auth/verify-email.js';
import express from 'express';

class AuthRoutes {
  constructor() {
    this.router = express.Router();
  }

  routes() {
    this.router.post('/auth/signup', SignUp.prototype.create);
    this.router.post('/auth/signin', SignIn.prototype.read);
    this.router.post('/auth/signout', SignOut.prototype.update);
    this.router.put('/auth/verify-email', VerifyEmail.prototype.update);
    return this.router;
  }
}

export const authRoutes = new AuthRoutes();
