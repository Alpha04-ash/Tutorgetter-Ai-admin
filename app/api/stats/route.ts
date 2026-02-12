import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const totalCandidates = await prisma.user.count({
            where: { role: 'user' }
        });

        const completedAssessments = await prisma.assessment.count({
            where: { status: 'completed' }
        });

        const pendingReviews = await prisma.assessment.count({
            where: {
                status: 'completed',
                decision: null
            }
        });

        const averageScoreAgg = await prisma.assessment.aggregate({
            _avg: {
                finalScore: true
            },
            where: {
                finalScore: { not: null }
            }
        });

        // Fetch recent activity
        const recentAssessments = await prisma.assessment.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                user: true,
                category: true
            }
        });

        const recentActivity = recentAssessments.map(a => ({
            id: a.id,
            candidate_name: a.user?.fullName || a.user?.email || 'Unknown User',
            category_name: a.category?.name || 'Unknown Category',
            score: a.finalScore ? Math.round(a.finalScore).toString() : 'N/A',
            status: a.decision || (a.status === 'completed' ? 'PENDING' : 'IN_PROGRESS'),
            time: a.createdAt ? new Date(a.createdAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));

        return NextResponse.json({
            total_candidates: totalCandidates || 0,
            total_assessments: completedAssessments || 0,
            completed_assessments: completedAssessments || 0,
            pending_reviews: pendingReviews || 0,
            average_score: typeof averageScoreAgg._avg.finalScore === 'number' ? Math.round(averageScoreAgg._avg.finalScore) : 0,
            recent_activity: recentActivity
        });
    } catch (error) {
        console.error("Stats API Error:", error);
        return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
    }
}
