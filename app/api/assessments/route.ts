import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const assessments = await prisma.assessment.findMany({
            include: {
                user: true,
                category: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });
        return NextResponse.json(assessments);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
    }
}
