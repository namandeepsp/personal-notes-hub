import { Router } from 'express';
import { signup, login, logout, verify } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

router.post('/signup', validateSignup, signup);
router.post('/login', validateLogin, login);
router.post('/logout', logout);
router.post('/verify', verify);

export default router;