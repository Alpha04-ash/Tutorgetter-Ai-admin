
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    try {
        // Delete related answers first if necessary, or rely on cascade
        // Manual cleanup just in case
        await prisma.answer.deleteMany({ where: { questionId: id } });

        await prisma.question.delete({
            where: { id }
        });

        return NextResponse.json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error("Failed to delete question:", error);
        return NextResponse.json({ error: 'Failed to delete question' }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    try {
        const body = await request.json();
        const { text } = body;

        const updated = await prisma.question.update({
            where: { id },
            data: { text }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Failed to update question:", error);
        return NextResponse.json({ error: 'Failed to update question' }, { status: 500 });
    }
}
