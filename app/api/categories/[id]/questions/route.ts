
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const categoryId = parseInt(params.id);

    try {
        const questions = await prisma.question.findMany({
            where: { categoryId }
        });
        return NextResponse.json(questions);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 });
    }
}

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const categoryId = parseInt(params.id);

    try {
        const body = await request.json();
        const { text, metadata_json } = body;

        // Ensure metadata is a string for the DB
        const metaString = typeof metadata_json === 'object'
            ? JSON.stringify(metadata_json)
            : String(metadata_json || '{}');

        const question = await prisma.question.create({
            data: {
                categoryId,
                text,
                source: 'MANUAL',
                type: 'THEORY',
                metadataJson: metaString
            }
        });
        return NextResponse.json(question);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}
