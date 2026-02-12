
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { analyzeTextAnswers, calculateFinalDecision } from '@/lib/ai/analysis';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const assessmentId = parseInt(id);

    try {
        const assessment = await prisma.assessment.findUnique({
            where: { id: assessmentId },
            include: {
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

        const results = analyzeTextAnswers(assessment.answers);
        const decision = calculateFinalDecision(
            results.technical_score,
            results.communication_score,
            results.teaching_score
        );

        const updated = await prisma.assessment.update({
            where: { id: assessmentId },
            data: {
                technicalScore: results.technical_score,
                communicationScore: results.communication_score,
                teachingScore: results.teaching_score,
                finalScore: (results.technical_score + results.communication_score + results.teaching_score) / 3,
                decision: decision,
                status: 'completed'
            },
            include: {
                user: true,
                category: true,
                answers: {
                    include: {
                        question: true,
                    }
                }
            }
        });

        // Update answers with feedback
        for (const ans of assessment.answers) {
            if (results.feedback_map[String(ans.questionId)]) {
                const feedback = results.feedback_map[String(ans.questionId)];
                await prisma.answer.update({
                    where: { id: ans.id },
                    data: { aiFeedback: JSON.stringify({ notes: feedback }) }
                });
            }
        }

        return NextResponse.json(updated);
    } catch (error) {
        console.error("Analysis error:", error);
        return NextResponse.json({ error: 'Failed to analyze assessment' }, { status: 500 });
    }
}
