import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('categoryId');

    try {
        const where = categoryId ? { categoryId: parseInt(categoryId) } : {};
        const questions = await prisma.question.findMany({
            where,
            include: {
                category: true,
            },
        });
        return NextResponse.json(questions);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { categoryId, text, type, source } = body;

        if (!categoryId || !text) {
            return NextResponse.json({ error: 'Category ID and Text are required' }, { status: 400 });
        }

        const question = await prisma.question.create({
            data: {
                categoryId: parseInt(categoryId),
                text,
                type: type || 'THEORY',
                source: source || 'ADMIN',
            },
        });

        return NextResponse.json(question, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}
