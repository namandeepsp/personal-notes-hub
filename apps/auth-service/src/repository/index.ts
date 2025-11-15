import prisma from '../db';

export const AuthRepository = {
    findUserByEmail: (email: string) => {
        return prisma.user.findUnique({ where: { email } });
    },

    createUser: (name: string, email: string, password: string) => {
        return prisma.user.create({
            data: { name, email, password }
        });
    },

    findUserById: (id: string) => {
        return prisma.user.findUnique({ where: { id } });
    }
};
