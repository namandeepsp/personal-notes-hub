import { AuthRepository } from '../repository';
import { comparePassword, hashPassword, signToken, verifyToken } from '@naman_deep_singh/security';
import { eventBus } from '../events/eventBus';
import { AuthEvents } from '../events/events';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';

export const AuthService = {
    signup: async (name: string, email: string, password: string) => {
        const existingUser = await AuthRepository.findUserByEmail(email);

        if (existingUser) {
            return { error: 'User already exists' };
        }

        const hashed = await hashPassword(password);
        const user = await AuthRepository.createUser(name, email, hashed);

        const token = signToken({ userId: user.id }, JWT_SECRET, '7d');

        // 🔥 Emit event
        eventBus.emit(AuthEvents.USER_REGISTERED, {
            id: user.id,
            name: user.name,
            email: user.email
        });

        return {
            user: { id: user.id, name: user.name, email: user.email },
            token
        };
    },

    login: async (email: string, password: string) => {
        const user = await AuthRepository.findUserByEmail(email);

        if (!user || !user.password) {
            return { error: 'Invalid credentials' };
        }

        const valid = await comparePassword(password, user.password);
        if (!valid) {
            return { error: 'Invalid credentials' };
        }

        const token = signToken({ userId: user.id }, JWT_SECRET, '7d');

        // 🔥 Emit event
        eventBus.emit(AuthEvents.USER_LOGGED_IN, {
            id: user.id,
            name: user.name,
            email: user.email
        });

        return {
            user: { id: user.id, name: user.name, email: user.email },
            token
        };
    },

    verifyTokenAndGetUser: async (token: string) => {
        const decoded = verifyToken(token, JWT_SECRET) as { userId: string };
        const user = await AuthRepository.findUserById(decoded.userId);

        if (!user) return null;

        return {
            id: user.id,
            name: user.name,
            email: user.email
        };
    }
};
