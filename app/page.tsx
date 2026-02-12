'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
// Styles imported globally or via module if needed, assuming global styles or module from layout context.

interface Stats {
  total_candidates: number;
  total_assessments: number;
  average_score: number;
  recent_activity: Activity[];
}

interface Activity {
  id: number;
  candidate_name: string;
  category_name: string;
  score: string | number;
  status: string;
  time: string;
}

import CosmicBackground from './components/CosmicBackground';
import GlassCard from './components/GlassCard';
import HoloButton from './components/HoloButton';

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/stats')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => setStats(data))
      .catch(err => {
        console.error(err);
        setError(err.message || 'Failed to connect to backend');
      });
  }, []);

  if (error) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <CosmicBackground />
      <GlassCard style={{ borderColor: '#ef4444' }}>
        <h2 style={{ color: '#f87171', marginBottom: '1rem' }}>Connection Error</h2>
        <p>{error}</p>
        <p style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#94a3b8' }}>Please ensure the API routes are working correctly.</p>
        <HoloButton onClick={() => window.location.reload()} style={{ marginTop: '2rem' }}>Retry</HoloButton>
      </GlassCard>
    </div>
  );

  if (!stats) return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <GlassCard>Loading Dashboard...</GlassCard>
    </div>
  );

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="cosmic-text-gradient" style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Admin Dashboard</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>Overview of candidate performance and assessments</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <Link href="/assessments">
            <HoloButton>View Assessments</HoloButton>
          </Link>
          <Link href="/categories">
            <HoloButton variant="secondary">Manage Categories</HoloButton>
          </Link>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
        <StatCard title="Total Candidates" value={String(stats.total_candidates)} change="Active" />
        <StatCard title="Assessments" value={String(stats.total_assessments)} change="Submitted" color="#facc15" />
        <StatCard title="Average Score" value={String(stats.average_score)} change="Overall" color="#3b82f6" />
      </div>

      <GlassCard style={{ padding: '0' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ fontSize: '1.5rem', color: '#f8fafc' }}>Recent Activity</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', color: '#e2e8f0' }}>
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.02)', textAlign: 'left' }}>
              <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Candidate</th>
              <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Category</th>
              <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Score</th>
              <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Status</th>
              <th style={{ padding: '1.5rem', fontWeight: 500, color: '#94a3b8' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {stats.recent_activity.map((activity, idx) => (
              <TableRow key={idx} {...activity} />
            ))}
            {stats.recent_activity.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>No recent activity to display.</td></tr>
            )}
          </tbody>
        </table>
      </GlassCard>
    </div>
  );
}

function StatCard({ title, value, change, color }: { title: string, value: string, change: string, color?: string }) {
  return (
    <GlassCard style={{ padding: '2rem' }}>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</p>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <span style={{ fontSize: '3rem', fontWeight: 700, color: '#f8fafc', lineHeight: 1 }}>{value}</span>
        <span style={{
          color: color || '#4ade80',
          background: color ? `${color}20` : 'rgba(74, 222, 128, 0.1)',
          padding: '0.4rem 1rem',
          borderRadius: '99px',
          fontSize: '0.8rem',
          fontWeight: 600,
          border: `1px solid ${color ? color + '40' : 'rgba(74, 222, 128, 0.3)'}`
        }}>
          {change}
        </span>
      </div>
    </GlassCard>
  );
}

function TableRow({ candidate_name, category_name, score, status, time }: any) {
  return (
    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s' }}>
      <td style={{ padding: '1.5rem', fontWeight: 500 }}>{candidate_name}</td>
      <td style={{ padding: '1.5rem', color: '#cbd5e1' }}>{category_name}</td>
      <td style={{ padding: '1.5rem', fontWeight: 700, color: '#38bdf8' }}>{score}</td>
      <td style={{ padding: '1.5rem' }}>
        <StatusBadge status={status} />
      </td>
      <td style={{ padding: '1.5rem', color: '#94a3b8' }}>{time}</td>
    </tr>
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
      border: `1px solid ${color}30` // Subtle border
    }}>
      {status}
    </span>
  );
}
