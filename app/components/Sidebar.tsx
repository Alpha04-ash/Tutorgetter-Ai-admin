'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Folder, FileText, BarChart } from 'lucide-react';

export default function Sidebar() {
    const pathname = usePathname();

    const NavLink = ({ href, label, icon: Icon }: { href: string, label: string, icon: any }) => {
        const isActive = pathname === href || (href !== '/' && pathname.startsWith(href));
        return (
            <Link href={href} style={{ textDecoration: 'none' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    color: isActive ? 'white' : '#94a3b8',
                    background: isActive ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                    border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
                    transition: 'all 0.2s'
                }}>
                    <Icon size={20} style={{ color: isActive ? '#38bdf8' : 'currentColor' }} />
                    <span style={{ fontWeight: 500 }}>{label}</span>
                </div>
            </Link>
        );
    };

    return (
        <aside className="glass-panel" style={{
            width: '260px',
            height: 'calc(100vh - 2rem)',
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 50
        }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    background: 'linear-gradient(to right, #a78bfa, #2dd4bf)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontWeight: '800'
                }}>
                    AI Mentor
                </h2>
                <p style={{ opacity: 0.6, fontSize: '0.875rem' }}>Admin Portal</p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
                <NavLink href="/" label="Dashboard" icon={LayoutDashboard} />
                <NavLink href="/categories" label="Categories" icon={Folder} />
                <NavLink href="/assessments" label="Assessments" icon={FileText} />
                <NavLink href="/analytics" label="Analytics" icon={BarChart} />
            </nav>

            <div style={{ marginTop: 'auto' }}>
                <div style={{
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#334155' }} />
                        <div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>Admin User</div>
                            <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>admin@softclub.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
