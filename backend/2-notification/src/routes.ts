import express, { type Router, type Request, type Response } from 'express';

const router = express.Router();

export function healthRoutes(): Router {
  router.get('/notification-health', (_req: Request, res: Response) => {
    res.status(200).send('NotificationService is healthy');
  });
  return router;
}
