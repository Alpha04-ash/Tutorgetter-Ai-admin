import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {

    const { id } = await params

    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id: parseInt(id) },
            include: {
                user: true,
                category: true,
                answers: {
                    include: {
                        question: true,
                    },
                },
            },
        });

        if (!assessment) {
            return NextResponse.json({ error: 'Assessment not found' }, { status: 404 });
        }

        return NextResponse.json(assessment);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch assessment' }, { status: 500 });
    }
}
