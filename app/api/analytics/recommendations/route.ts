import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const topAssessments = await prisma.assessment.findMany({
            where: {
                status: 'completed',
                finalScore: { not: null }
            },
            take: 10,
            orderBy: { finalScore: 'desc' },
            include: {
                user: true,
                category: true
            }
        });

        const leaderboard = topAssessments.map(a => ({
            assessment_id: a.id,
            candidate_name: a.user.fullName || a.user.email,
            candidate_email: a.user.email,
            category: a.category?.name || 'General',
            final_score: Math.round(a.finalScore || 0),
            technical_score: Math.round(a.technicalScore || 0),
            communication_score: Math.round(a.communicationScore || 0),
            teaching_score: Math.round(a.teachingScore || 0),
            decision: a.decision || 'PENDING',
            submitted_at: a.createdAt.toISOString().split('T')[0]
        }));

        return NextResponse.json(leaderboard);
    } catch (error) {
        console.error("Analytics API Error:", error);
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}
