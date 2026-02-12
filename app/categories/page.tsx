'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import CosmicBackground from '../components/CosmicBackground';
import GlassCard from '../components/GlassCard';
import HoloButton from '../components/HoloButton';
import Modal from '../components/Modal';

import { ArrowLeft, Plus, Edit2, Trash2, ArrowRight, Layers } from 'lucide-react';

interface Category {
    id: number;
    name: string;
    description: string;
}

export default function Categories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Modal States
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean, id: number | null }>({ isOpen: false, id: null });
    const [editModal, setEditModal] = useState<{ isOpen: boolean, category: Category | null }>({ isOpen: false, category: null });
    const [editForm, setEditForm] = useState({ name: '', description: '' });
    const [messageModal, setMessageModal] = useState<{ isOpen: boolean, title: string, message: string }>({ isOpen: false, title: '', message: '' });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/categories/');
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error(err);
            setError('Could not load categories');
        } finally {
            setLoading(false);
        }
    };

    // --- Delete Handlers ---
    const confirmDelete = (e: React.MouseEvent, id: number) => {
        e.preventDefault();
        setDeleteModal({ isOpen: true, id });
    };

    const handleDelete = async () => {
        if (!deleteModal.id) return;
        try {
            const res = await fetch(`/api/categories/${deleteModal.id}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setCategories(prev => prev.filter(c => c.id !== deleteModal.id));
                // showMessage("Success", "Category deleted successfully.");
            } else {
                showMessage("Error", "Failed to delete category.");
            }
        } catch (error) {
            showMessage("Error", "An error occurred while deleting.");
        } finally {
            setDeleteModal({ isOpen: false, id: null });
        }
    };

    // --- Edit Handlers ---
    const openEditModal = (e: React.MouseEvent, category: Category) => {
        e.preventDefault();
        setEditForm({ name: category.name, description: category.description || '' });
        setEditModal({ isOpen: true, category });
    };

    const handleUpdate = async () => {
        if (!editModal.category) return;
        try {
            const res = await fetch(`/api/categories/${editModal.category.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editForm)
            });

            if (res.ok) {
                const updated: Category = await res.json();
                setCategories(prev => prev.map(c => c.id === editModal.category!.id ? updated : c));
                showMessage("Success", "Category updated successfully.");
                setEditModal({ isOpen: false, category: null });
            } else {
                showMessage("Error", "Failed to update category.");
            }
        } catch (error) {
            showMessage("Error", "An error occurred while updating.");
        }
    };

    // --- Helper ---
    const showMessage = (title: string, message: string) => {
        setMessageModal({ isOpen: true, title, message });
    };

    if (loading) return (
        <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CosmicBackground />
            <GlassCard>Loading categories...</GlassCard>
        </div>
    );

    return (
        <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
            <CosmicBackground />
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <ArrowLeft size={16} /> Back to Dashboard
                    </Link>
                    <div>
                        <h1 className="cosmic-text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Categories</h1>
                        <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Manage interview categories and questions</p>
                    </div>
                </div>
                <HoloButton onClick={() => window.location.href = '/categories/new'}>
                    <Plus size={18} /> New Category
                </HoloButton>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {categories.length === 0 ? (
                    <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '4rem', color: '#64748b' }}>
                        No categories found. Create one to get started.
                    </div>
                ) : (
                    categories.map((cat: Category) => (
                        <GlassCard key={cat.id} className="group" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '48px', height: '48px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                                        <Layers size={24} />
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', margin: 0 }}>{cat.name}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                    <button
                                        onClick={(e) => openEditModal(e, cat)}
                                        style={{ background: 'rgba(56, 189, 248, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#38bdf8', padding: '0.4rem' }}
                                        title="Edit"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                    <button
                                        onClick={(e) => confirmDelete(e, cat.id)}
                                        style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#ef4444', padding: '0.4rem' }}
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.6, flex: 1 }}>
                                {cat.description || "No description provided."}
                            </p>

                            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                                <Link href={`/categories/${cat.id}`} style={{ width: '100%' }}>
                                    <HoloButton variant="secondary" style={{ width: '100%', fontSize: '0.9rem', padding: '0.75rem' }}>
                                        Manage Questions
                                    </HoloButton>
                                </Link>
                            </div>
                        </GlassCard>
                    ))
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <Modal
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ isOpen: false, id: null })}
                title="Delete Category"
                footer={
                    <>
                        <HoloButton variant="secondary" onClick={() => setDeleteModal({ isOpen: false, id: null })}>Cancel</HoloButton>
                        <HoloButton onClick={handleDelete} style={{ background: '#ef4444', boxShadow: '0 0 15px rgba(239, 68, 68, 0.3)' }}>Delete</HoloButton>
                    </>
                }
            >
                <div>
                    <p>Are you sure you want to delete this category?</p>
                    <p style={{ color: '#ef4444', marginTop: '0.5rem', fontSize: '0.9rem' }}>Warning: This will delete all questions associated with this category.</p>
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={editModal.isOpen}
                onClose={() => setEditModal({ isOpen: false, category: null })}
                title="Edit Category"
                footer={
                    <>
                        <HoloButton variant="secondary" onClick={() => setEditModal({ isOpen: false, category: null })}>Cancel</HoloButton>
                        <HoloButton onClick={handleUpdate}>Save Changes</HoloButton>
                    </>
                }
            >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Name</label>
                        <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#94a3b8' }}>Description</label>
                        <textarea
                            value={editForm.description}
                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '0.75rem',
                                background: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>
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
