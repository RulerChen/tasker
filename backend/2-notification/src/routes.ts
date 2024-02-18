import express, { type Router, type Request, type Response } from 'express';

const router = express.Router();

export function healthRoutes(): Router {
  router.get('/health', (_req: Request, res: Response) => {
    res.status(200).send('Notification service is healthy');
  });
  return router;
}
