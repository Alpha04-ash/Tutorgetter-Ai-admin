'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Lightbulb } from 'lucide-react';
import styles from '../../page.module.css';

import CosmicBackground from '../../components/CosmicBackground';
import GlassCard from '../../components/GlassCard';
import HoloButton from '../../components/HoloButton';

interface Question {
    id: number;
    text: string;
}

interface Answer {
    questionId: number;
    answerText: string;
    transcript: string | null;
    question?: Question;
    aiFeedback?: string | null;
}

interface Assessment {
    id: number;
    userId: number;
    categoryId: number;
    status: string;
    createdAt: string;
    finalScore: number | null;
    technicalScore: number | null;
    communicationScore: number | null;
    teachingScore: number | null;
    decision: string | null;
    videoUrl: string | null;
    user?: {
        fullName: string;
        email: string;
        phoneNumber: string;
    };
    category?: {
        name: string;
    };
    answers: Answer[];
}

export default function AssessmentDetailPage() {
    const params = useParams();
    const id = params?.id as string;

    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);
    const [analyzing, setAnalyzing] = useState(false);

    useEffect(() => {
        if (id) {
            fetchData(id);
        }
    }, [id]);

    const fetchData = async (id: string) => {
        try {
            const res = await fetch(`/api/assessments/${id}`);
            if (res.ok) {
                setAssessment(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAnalyze = async () => {
        if (!assessment) return;
        setAnalyzing(true);
        try {
            const res = await fetch(`/api/assessments/${assessment.id}/analyze`, {
                method: 'POST'
            });
            if (res.ok) {
                const updated = await res.json();
                setAssessment(updated);
            } else {
                alert("Analysis failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error running analysis");
        } finally {
            setAnalyzing(false);
        }
    };

    if (loading) return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CosmicBackground />
            <GlassCard>Loading...</GlassCard>
        </div>
    );
    if (!assessment) return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CosmicBackground />
            <GlassCard>Assessment not found</GlassCard>
        </div>
    );

    const videoSrc = assessment.videoUrl
        ? `/uploads/${assessment.videoUrl}`
        : null;

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
            <CosmicBackground />
            <header style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Link href="/assessments">
                    <HoloButton variant="secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <ArrowLeft size={16} /> Back
                    </HoloButton>
                </Link>
                <div>
                    <h1 className="cosmic-text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Assessment #{assessment.id}</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1rem' }}>Detailed review and analysis</p>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>

                {/* Left Column: Details & Analysis */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

                    {/* Candidate Info */}
                    <GlassCard>
                        <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Candidate</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.75rem 1.5rem', fontSize: '1rem' }}>
                            <div style={{ color: '#94a3b8' }}>Name:</div>
                            <div style={{ color: '#e2e8f0', fontWeight: 500 }}>{assessment.user?.fullName}</div>
                            <div style={{ color: '#94a3b8' }}>Email:</div>
                            <div style={{ color: '#e2e8f0' }}>{assessment.user?.email}</div>
                            <div style={{ color: '#94a3b8' }}>Phone:</div>
                            <div style={{ color: '#e2e8f0' }}>{assessment.user?.phoneNumber}</div>
                        </div>
                    </GlassCard>

                    {/* AI Analysis */}
                    <GlassCard style={{ background: 'rgba(30, 41, 59, 0.4)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>
                            <h2 style={{ fontSize: '1.25rem', color: '#38bdf8', textShadow: '0 0 10px rgba(56, 189, 248, 0.5)' }}>AI Analysis</h2>
                            <HoloButton
                                onClick={handleAnalyze}
                                disabled={analyzing}
                                style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                            >
                                {analyzing ? 'Analyzing...' : 'Run Analysis'}
                            </HoloButton>
                        </div>

                        {assessment.finalScore !== null ? (
                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc' }}>
                                        {assessment.finalScore?.toFixed(1)} <span style={{ fontSize: '1rem', color: '#94a3b8', fontWeight: 400 }}>/ 100</span>
                                    </div>
                                    <StatusBadge status={assessment.decision || 'PENDING'} />
                                </div>
                                <div style={{ display: 'grid', gap: '1rem', fontSize: '1rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <span style={{ color: '#cbd5e1' }}>Technical Knowledge:</span>
                                        <span style={{ fontWeight: 600, color: '#38bdf8' }}>{assessment.technicalScore}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <span style={{ color: '#cbd5e1' }}>Communication:</span>
                                        <span style={{ fontWeight: 600, color: '#38bdf8' }}>{assessment.communicationScore}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                        <span style={{ color: '#cbd5e1' }}>Teaching Ability (Text):</span>
                                        <span style={{ fontWeight: 600, color: '#38bdf8' }}>{assessment.teachingScore}</span>
                                    </div>
                                    <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#64748b', fontStyle: 'italic', textAlign: 'center' }}>
                                        * Teaching Ability is analyzed based on text answers in Part 3.
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div style={{ color: '#94a3b8', fontStyle: 'italic', textAlign: 'center', padding: '2rem' }}>
                                Waiting for analysis...
                            </div>
                        )}
                    </GlassCard>

                    {/* Video Player */}
                    <GlassCard>
                        <h2 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '1rem' }}>Proctoring Video</h2>
                        {videoSrc ? (
                            <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
                                <video
                                    controls
                                    src={videoSrc}
                                    style={{ width: '100%', display: 'block' }}
                                />
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                                No proctoring video available
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* Right Column: Answers */}
                <GlassCard>
                    <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Candidate Answers</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {assessment.answers.map((answer, index) => (
                            <div key={index} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ marginBottom: '1rem', fontWeight: 600, color: '#e2e8f0', fontSize: '1.05rem' }}>
                                    <span style={{ color: '#38bdf8', marginRight: '0.5rem' }}>Q{index + 1}.</span>
                                    {answer.question?.text || `Question ID: ${answer.questionId}`}
                                </div>
                                <div style={{ color: '#cbd5e1', whiteSpace: 'pre-wrap', marginBottom: '1rem', lineHeight: 1.6, paddingLeft: '1rem', borderLeft: '2px solid rgba(255,255,255,0.1)' }}>
                                    {answer.answerText}
                                </div>
                                {answer.aiFeedback && (
                                    <div style={{
                                        padding: '1rem',
                                        background: 'rgba(234, 179, 8, 0.1)',
                                        border: '1px solid rgba(234, 179, 8, 0.2)',
                                        borderRadius: '8px',
                                        color: '#facc15',
                                        fontSize: '0.95rem',
                                        marginTop: '1rem',
                                        display: 'flex',
                                        gap: '0.5rem'
                                    }}>
                                        <Lightbulb size={20} />
                                        <div>
                                            <strong>AI Feedback:</strong> {JSON.parse(answer.aiFeedback).notes}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        {assessment.answers.length === 0 && (
                            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No text answers recorded.</div>
                        )}
                    </div>
                </GlassCard>
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
