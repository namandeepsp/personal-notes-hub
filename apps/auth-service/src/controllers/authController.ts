import express from 'express';
type Request = express.Request;
type Response = express.Response;
import { comparePassword, hashPassword, signToken, verifyToken } from '@naman_deep_singh/security';
import { badRequest, created, serverError, success, unauthorized, logError } from '@naman_deep_singh/response-utils';
import prisma from '../db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log({ name, email, password });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    console.log({ existingUser });
    if (existingUser) {
      return badRequest("User already exists!", undefined, res);
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const token = signToken({ userId: user.id }, JWT_SECRET, '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return created({ user: { id: user.id, name: user.name, email: user.email } }, 'User created successfully', res);
  } catch (error) {
    logError('signup', error);
    return serverError(undefined, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return unauthorized('Invalid credentials', res);
    }

    const isValidPassword = await comparePassword(password, user.password);
    if (!isValidPassword) {
      return unauthorized('Invalid credentials', res);
    }

    const token = signToken({ userId: user.id }, JWT_SECRET, '7d');

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return success({ user: { id: user.id, name: user.name, email: user.email } }, 'Login successful', 200, res);
  } catch (error) {
    logError('login', error);
    return serverError(undefined, res);
  }
};

export const logout = async (req: Request, res: Response) => {
  res.clearCookie('token');
  return success(null, 'Logout successful', 200, res);
};

export const verify = async (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return unauthorized('No token provided', res);
    }

    const decoded = verifyToken(token, JWT_SECRET) as { userId: string };
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return unauthorized('Invalid token', res);
    }

    return success({ user: { id: user.id, name: user.name, email: user.email } }, 'Token verified', 200, res);
  } catch (error) {
    logError('verify', error);
    return unauthorized('Invalid token', res);
  }
};