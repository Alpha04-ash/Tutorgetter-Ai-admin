
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    try {
        const category = await prisma.category.findUnique({
            where: { id }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        return NextResponse.json(category);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
    }
}

export async function DELETE(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const id = parseInt(params.id);

    try {
        // Delete related questions first (manual cascade if not set in DB)
        // Check schema first, but safe to do transaction
        await prisma.$transaction([
            prisma.question.deleteMany({ where: { categoryId: id } }),
            prisma.assessment.deleteMany({ where: { categoryId: id } }),
            prisma.category.delete({ where: { id } })
        ]);

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error("Delete error:", error);
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
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
        const { name, description } = body;

        const updatedCategory = await prisma.category.update({
            where: { id },
            data: { name, description }
        });

        return NextResponse.json(updatedCategory);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
    }
}
