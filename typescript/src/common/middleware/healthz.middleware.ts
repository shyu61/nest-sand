import { NextFunction, Request, Response } from 'express';

export function healthz(req: Request, res: Response, next: NextFunction) {
  if (req.url === '/healthz') {
    console.log('Health check...');
    res.send('ok');
  } else {
    next();
  }
}
