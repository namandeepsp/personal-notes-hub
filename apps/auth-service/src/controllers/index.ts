import { Request, Response } from '@naman_deep_singh/server-utils';
import { badRequest, created, serverError, success, unauthorized } from '@naman_deep_singh/response-utils';
import { AuthService } from '../services';

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const result = await AuthService.signup(name, email, password);

    if (result.error) {
      return badRequest(result.error, undefined, res);
    }

    // Set Token
    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return created({ user: result.user }, 'User created successfully', res);

  } catch (err) {
    return serverError(undefined, res);
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const result = await AuthService.login(email, password);

    if (result.error) {
      return unauthorized(result.error, res);
    }

    res.cookie('token', result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return success({ user: result.user }, 'Login successful', 200, res);

  } catch (err) {
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

    if (!token) return unauthorized('No token provided', res);

    const user = await AuthService.verifyTokenAndGetUser(token);
    if (!user) return unauthorized('Invalid token', res);

    return success({ user }, 'Token verified', 200, res);

  } catch (err) {
    return unauthorized('Invalid token', res);
  }
};
