"use client";

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Modal from '../../components/Modal';

interface Question {
    id: number;
    text: string;
    source: string;
}

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function CategoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);

    const [category, setCategory] = useState<Category | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);

    const [editingQ, setEditingQ] = useState<Question | null>(null);
    const [newText, setNewText] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [addText, setAddText] = useState("");

    const [showGenModal, setShowGenModal] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

    useEffect(() => {
        fetchData(id);
    }, [id]);

    const fetchData = async (catId: string) => {
        try {
            const catRes = await fetch('/api/categories/');
            const cats = await catRes.json();
            const foundCat = cats.find((c: any) => c.id == catId);
            setCategory(foundCat);

            const qRes = await fetch(`/api/categories/${catId}/questions`);
            const qs = await qRes.json();
            setQuestions(qs);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async () => {
        if (!addText.trim() || !category) return;
        try {
            const res = await fetch(`/api/categories/${category.id}/questions/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: addText,
                    metadata_json: {}
                })
            });
            if (res.ok) {
                const newQ = await res.json();
                setQuestions([...questions, newQ]);
                setAddText("");
                setIsAdding(false);
            } else {
                const err = await res.text();
                alert(`Error: ${err}`);
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleDeleteClick = (qId: number) => {
        setDeleteTargetId(qId);
        setShowDeleteModal(true);
    };

    const confirmDelete = async () => {
        if (!deleteTargetId) return;
        try {
            const res = await fetch(`/api/questions/${deleteTargetId}`, { method: 'DELETE' });
            if (res.ok) {
                setQuestions(questions.filter(q => q.id !== deleteTargetId));
                setShowDeleteModal(false);
                setDeleteTargetId(null);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to delete");
        }
    };

    const handleUpdate = async () => {
        if (!editingQ || !newText.trim()) return;
        try {
            const res = await fetch(`/api/questions/${editingQ.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: newText })
            });
            if (res.ok) {
                const updated = await res.json();
                setQuestions(questions.map(q => q.id === updated.id ? updated : q));
                setEditingQ(null);
                setNewText("");
            }
        } catch (e) { console.error(e); }
    };

    const handleGenerateConfirm = async () => {
        if (!category) return;
        setIsGenerating(true);
        try {
            const res = await fetch(`/api/categories/${category.id}/finalize`, {
                method: 'POST'
            });
            if (res.ok) {
                const newQs = await res.json();
                setQuestions(newQs);
                setShowGenModal(false);
            } else {
                alert("Generate failed");
            }
        } catch (e) {
            console.error(e);
            alert("Error in generation");
        } finally {
            setIsGenerating(false);
        }
    }

    if (loading) return <div>Loading...</div>;
    if (!category) return <div>Category not found</div>;

    return (
        <div>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                        <Link href="/categories" style={{ fontSize: '0.8rem', opacity: 0.5, textDecoration: 'none', color: 'white' }}>← Back</Link>
                        <h1 style={{ margin: 0 }}>{category.name}</h1>
                        <span style={{
                            background: 'rgba(255,255,255,0.1)',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '6px',
                            fontSize: '0.875rem'
                        }}>ID: {category.id}</span>
                    </div>
                    <p style={{ opacity: 0.6 }}>Manage Questions ({questions.length}/40)</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn btn-outline" onClick={() => setShowGenModal(true)}>Generate AI Questions</button>
                    {!isAdding && questions.length < 40 && (
                        <button className="btn btn-primary" onClick={() => setIsAdding(true)}>+ Add Question</button>
                    )}
                </div>
            </header>

            <div className="glass-panel" style={{ padding: '2rem' }}>
                <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Questions</h2>

                {/* Add Form */}
                {isAdding && (
                    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#334155', borderRadius: '8px' }}>
                        <div style={{ marginBottom: '0.5rem' }}>Text:</div>
                        <input
                            value={addText}
                            onChange={e => setAddText(e.target.value)}
                            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', marginBottom: '1rem', color: 'black' }}
                        />
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button className="btn btn-primary" onClick={handleAdd}>Save</button>
                            <button className="btn btn-outline" onClick={() => setIsAdding(false)}>Cancel</button>
                        </div>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {questions.map((q, idx) => (
                        <div key={q.id} style={{
                            padding: '1rem',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.05)',
                        }}>
                            {editingQ?.id === q.id ? (
                                <div>
                                    <input
                                        value={newText}
                                        onChange={e => setNewText(e.target.value)}
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', marginBottom: '0.5rem', color: 'black' }}
                                    />
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-primary" style={{ fontSize: '0.8rem' }} onClick={handleUpdate}>Save</button>
                                        <button className="btn btn-outline" style={{ fontSize: '0.8rem' }} onClick={() => setEditingQ(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', gap: '1rem', flex: 1 }}>
                                        <span style={{ opacity: 0.5, fontWeight: 600 }}>{idx + 1}.</span>
                                        <span>{q.text}</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <span style={{
                                            fontSize: '0.75rem',
                                            padding: '0.25rem 0.5rem',
                                            borderRadius: '4px',
                                            background: q.source === 'AI' ? 'rgba(139, 92, 246, 0.2)' : 'rgba(20, 184, 166, 0.2)',
                                            color: q.source === 'AI' ? '#d8b4fe' : '#5eead4'
                                        }}>
                                            {q.source}
                                        </span>
                                        <button
                                            onClick={() => { setEditingQ(q); setNewText(q.text); }}
                                            style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClick(q.id)}
                                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Empty States (Visual only, truncated for 40) */}
                    {questions.length < 40 && (
                        <div style={{ padding: '1rem', textAlign: 'center', opacity: 0.3, border: '1px dashed grey', borderRadius: '8px' }}>
                            ... {40 - questions.length} slots remaining ...
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showGenModal}
                onClose={() => setShowGenModal(false)}
                title="Generate AI Questions"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setShowGenModal(false)} disabled={isGenerating}>Cancel</button>
                        <button className="btn btn-primary" onClick={handleGenerateConfirm} disabled={isGenerating}>
                            {isGenerating ? "Generating..." : "Generate Details"}
                        </button>
                    </>
                }
            >
                <p>This will automatically generate questions to fill the remaining slots up to 40.</p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Current Questions:</span>
                        <b>{questions.length}</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span>Target:</span>
                        <b>40</b>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#34d399' }}>
                        <span>To Generate:</span>
                        <b>{Math.max(0, 40 - questions.length)}</b>
                    </div>
                </div>
            </Modal>
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Confirm Deletion"
                footer={
                    <>
                        <button className="btn btn-outline" onClick={() => setShowDeleteModal(false)}>Cancel</button>
                        <button className="btn btn-alert" style={{ background: '#ef4444', color: 'white', border: 'none' }} onClick={confirmDelete}>
                            Delete
                        </button>
                    </>
                }
            >
                <p>Are you sure you want to delete this question? This action cannot be undone.</p>
            </Modal>
        </div>
    );
}
