import express from 'express';
type Request = express.Request;
type Response = express.Response;
type NextFunction = express.NextFunction;
import { SERVICES } from '../config/services';
import { serverError, unauthorized } from '@naman_deep_singh/response-utils';

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const response = await fetch(`${SERVICES.AUTH}/verify`, {
      method: 'POST',
      headers: {
        'Cookie': req.headers.cookie || '',
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const userData = await response.json();
      (req as any).user = userData;
      next();
    } else {
      return unauthorized('Access denied', res);
    }
  } catch (error) {
    return serverError('Authentication service unavailable', res);
  }
};