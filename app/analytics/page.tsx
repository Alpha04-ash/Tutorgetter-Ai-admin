'use client';

import { useEffect, useState } from 'react';
import { Trophy, Medal, Crown } from 'lucide-react';
import styles from '../page.module.css';

interface Recommendation {
    assessment_id: number;
    candidate_name: string;
    candidate_email: string;
    category: string;
    final_score: number;
    technical_score: number;
    communication_score: number;
    teaching_score: number;
    decision: string;
    submitted_at: string;
}

export default function AnalyticsPage() {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/analytics/recommendations')
            .then(res => res.json())
            .then(data => setRecommendations(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className={styles.container}>Loading Analytics...</div>;

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1 className={styles.title}>Analytics & Recommendations</h1>
                    <p style={{ opacity: 0.6 }}>Top performing candidates recommended for hiring.</p>
                </div>
            </header>

            <div className={styles.glassPanel} style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Trophy size={24} color="#facc15" /> Top Candidates Leaderboard
                </h2>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--glass-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Rank</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Candidate</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Category</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Final Score</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Breakdown (Tech / Comm / Teach)</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Decision</th>
                            <th style={{ padding: '1rem', opacity: 0.7 }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recommendations.map((rec, index) => (
                            <tr key={rec.assessment_id} style={{
                                borderBottom: '1px solid var(--glass-border)',
                                background: index < 3 ? 'rgba(255, 255, 255, 0.03)' : 'transparent'
                            }}>
                                <td style={{ padding: '1rem', fontWeight: 'bold' }}>
                                    {index === 0 ? <Crown size={20} color="#facc15" fill="#facc15" /> :
                                        index === 1 ? <Medal size={20} color="#e2e8f0" /> :
                                            index === 2 ? <Medal size={20} color="#b45309" /> :
                                                `#${index + 1}`}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontWeight: 600 }}>{rec.candidate_name}</div>
                                    <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{rec.candidate_email}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>{rec.category}</td>
                                <td style={{ padding: '1rem', fontWeight: 700, fontSize: '1.1rem' }}>{rec.final_score}</td>
                                <td style={{ padding: '1rem', fontSize: '0.9rem', opacity: 0.8 }}>
                                    {rec.technical_score} / {rec.communication_score} / {rec.teaching_score}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <StatusBadge status={rec.decision} />
                                </td>
                                <td style={{ padding: '1rem', opacity: 0.6, fontSize: '0.9rem' }}>{rec.submitted_at}</td>
                            </tr>
                        ))}
                        {recommendations.length === 0 && (
                            <tr><td colSpan={7} style={{ padding: '2rem', textAlign: 'center', opacity: 0.5 }}>No data available yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    let color = 'white';
    let bg = 'rgba(255,255,255,0.1)';

    if (status === 'GREEN') {
        color = '#4ade80';
        bg = 'rgba(74, 222, 128, 0.1)';
    } else if (status === 'YELLOW') {
        color = '#facc15';
        bg = 'rgba(250, 204, 21, 0.1)';
    } else if (status === 'RED') {
        color = '#f87171';
        bg = 'rgba(248, 113, 113, 0.1)';
    }

    return (
        <span style={{
            color, background: bg,
            padding: '0.25rem 0.75rem', borderRadius: '99px',
            fontSize: '0.75rem', fontWeight: 700,
            border: `1px solid ${color}30`
        }}>
            {status}
        </span>
    );
}
