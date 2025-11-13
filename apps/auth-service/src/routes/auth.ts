import { Router } from 'express';
import { signup, login, logout, verify } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';
import { rateLimit } from '@naman_deep_singh/server-utils';

const router = Router();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 5, // 5 attempts per window
  message: 'Too many authentication attempts, please try again later'
});

const signupRateLimit = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  maxRequests: 3, // 3 signups per hour
  message: 'Too many signup attempts, please try again later'
});

router.post('/signup', signupRateLimit, validateSignup, signup);
router.post('/login', authRateLimit, validateLogin, login);
router.post('/logout', logout);
router.post('/verify', verify);

export default router;