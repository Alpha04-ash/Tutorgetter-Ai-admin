
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateQuestions } from '@/lib/ai/generator';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    const params = await props.params;
    const categoryId = parseInt(params.id);
    console.log(`[Finalize API] Starting generation for category ${categoryId}`);

    try {
        const category = await prisma.category.findUnique({
            where: { id: categoryId },
            include: { questions: true }
        });

        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        const currentCount = category.questions.length;
        const needed = Math.max(0, 40 - currentCount);

        if (needed === 0) {
            return NextResponse.json(category.questions);
        }

        // Generate questions
        const existingTexts = category.questions.map(q => q.text);
        const newQuestionTexts = await generateQuestions(category.name, existingTexts, needed);

        // Save to DB
        await prisma.question.createMany({
            data: newQuestionTexts.map(text => ({
                categoryId,
                text,
                source: 'AI',
                type: 'THEORY' // Default type
            }))
        });

        // Return updated list
        const updatedQuestions = await prisma.question.findMany({
            where: { categoryId }
        });

        return NextResponse.json(updatedQuestions);

    } catch (error) {
        console.error("Finalize API Error:", error);
        return NextResponse.json({ error: 'Failed to generate questions' }, { status: 500 });
    }
}
