import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("✅ Connected to database successfully")
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

export const disconnectDB = async () => {
    await prisma.$disconnect();
    console.log('🧹 Disconnected from database');
}

export default prisma;

