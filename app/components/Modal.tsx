'use client';

import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            const timer = setTimeout(() => setIsVisible(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isVisible) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            pointerEvents: isAnimating ? 'auto' : 'none',
        }}>
            {/* Backdrop */}
            <div
                onClick={onClose}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(0, 0, 0, 0.6)',
                    backdropFilter: 'blur(4px)',
                    opacity: isAnimating ? 1 : 0,
                    transition: 'opacity 0.3s ease-in-out',
                }}
            />

            {/* Modal Content */}
            <div style={{
                position: 'relative',
                width: '90%',
                maxWidth: '500px',
                background: 'rgba(30, 41, 59, 0.8)', // Darker slate for better contrast
                backdropFilter: 'blur(16px)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.2)', // Cosmic glow
                opacity: isAnimating ? 1 : 0,
                transform: isAnimating ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(20px)',
                transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                maxHeight: '85vh',
            }}>
                {/* Header */}
                <div style={{
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <h3 style={{
                        margin: 0,
                        fontSize: '1.25rem',
                        fontWeight: 600,
                        background: 'linear-gradient(to right, #e2e8f0, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            padding: '0.25rem',
                            display: 'flex',
                            borderRadius: '6px',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = '#fff';
                            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = '#94a3b8';
                            e.currentTarget.style.background = 'transparent';
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div style={{
                    padding: '1.5rem',
                    overflowY: 'auto',
                    color: '#cbd5e1',
                    lineHeight: 1.6,
                }}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div style={{
                        padding: '1.25rem 1.5rem',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: '0.75rem',
                    }}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}
