import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        return NextResponse.json({ status: 'Connected', userCount });
    } catch (error: any) {
        return NextResponse.json({
            status: 'Error',
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
