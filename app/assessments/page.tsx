"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import CosmicBackground from '../components/CosmicBackground';
import GlassCard from '../components/GlassCard';
import HoloButton from '../components/HoloButton';
import Modal from '../components/Modal';

interface Assessment {
    id: number;
    userId: number;
    categoryId: number;
    status: string;
    createdAt: string;
    finalScore: number | null;
    user?: {
        fullName: string;
        email: string;
    };
    category?: {
        name: string;
    };
}

export default function AssessmentsPage() {
    const [assessments, setAssessments] = useState<Assessment[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal States
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
    const [messageModal, setMessageModal] = useState<{ isOpen: boolean, title: string, message: string }>({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        fetchAssessments();
    }, []);

    const fetchAssessments = async () => {
        try {
            const res = await fetch('/api/assessments/');
            if (res.ok) {
                setAssessments(await res.json());
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const confirmDelete = (id: number) => {
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;

        try {
            const res = await fetch(`/api/assessments/${deleteModal.id}`, {
                method: 'DELETE'
            });
            if (res.ok) {
                setAssessments(prev => prev.filter(a => a.id !== deleteModal.id));
                // showMessage("Success", "Assessment deleted successfully.");
            } else {
                showMessage("Error", "Failed to delete assessment.");
            }
        } catch (e) {
            console.error(e);
            showMessage("Error", "An error occurred while deleting.");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    const showMessage = (title: string, message: string) => {
        setMessageModal({ isOpen: true, title, message });
    };

    if (loading) return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CosmicBackground />
            <GlassCard>Loading...</GlassCard>
        </div>
    );

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
            <CosmicBackground />
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/">
                        <HoloButton variant="secondary" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <ArrowLeft size={16} /> Back
                        </HoloButton>
                    </Link>
                    <div>
                        <h1 className="cosmic-text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Assessments</h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Review and manage candidate submissions.</p>
                    </div>
                </div>
            </header>

            <GlassCard style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>ID</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Candidate</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Category</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Status</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Date</th>
                            <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assessments.map((assessment) => (
                            <tr key={assessment.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
                                <td style={{ padding: '1.5rem', color: '#64748b' }}>#{assessment.id}</td>
                                <td style={{ padding: '1.5rem', fontWeight: 500 }}>
                                    <div style={{ color: '#f8fafc' }}>{assessment.user?.fullName || 'Unknown'}</div>
                                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{assessment.user?.email}</div>
                                </td>
                                <td style={{ padding: '1.5rem', color: '#cbd5e1' }}>{assessment.category?.name || 'Unknown'}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: '4px',
                                        background: assessment.status === 'completed' ? 'rgba(74, 222, 128, 0.1)' : 'rgba(250, 204, 21, 0.1)',
                                        color: assessment.status === 'completed' ? '#4ade80' : '#facc15',
                                        border: assessment.status === 'completed' ? '1px solid rgba(74, 222, 128, 0.2)' : '1px solid rgba(250, 204, 21, 0.2)',
                                        fontSize: '0.8rem',
                                        fontWeight: 600
                                    }}>
                                        {assessment.status.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '1.5rem', color: '#94a3b8' }}>{new Date(assessment.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '1.5rem' }}>
                                    <Link href={`/assessments/${assessment.id}`} style={{ textDecoration: 'none' }}>
                                        <HoloButton style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', marginRight: '0.5rem' }}>Review</HoloButton>
                                    </Link>
                                    <button
                                        onClick={() => confirmDelete(assessment.id)}
                                        style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem', marginLeft: '0.5rem' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {assessments.length === 0 && (
                    <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>
                        No assessments found.
                    </div>
                )}
            </GlassCard>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                title="Delete Assessment"
                footer={
                    <>
                        <HoloButton variant="secondary" onClick={() => setDeleteModal({ isOpen: false, id: null })}>Cancel</HoloButton>
                        <HoloButton onClick={handleDelete} style={{ background: '#ef4444', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>Delete</HoloButton>
                    </>
                }
            >
                <div>
                    <p>Are you sure you want to delete this assessment?</p>
                    <p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.9rem' }}>This action cannot be undone.</p>
                </div>
            </Modal>

            {/* Message Modal (Success/Error) */}
            <Modal
                isOpen={messageModal.isOpen}
                onClose={() => setMessageModal({ ...messageModal, isOpen: false })}
                title={messageModal.title}
                footer={
                    <HoloButton onClick={() => setMessageModal({ ...messageModal, isOpen: false })}>Close</HoloButton>
                }
            >
                <p>{messageModal.message}</p>
            </Modal>
        </div>
    );
}
