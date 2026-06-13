import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center text-center px-4">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="relative z-10 space-y-6">
        <p className="text-8xl font-black text-[var(--bg-elevated)] tabular-nums">404</p>
        <h1 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">Page not found</h1>
        <p className="text-[var(--text-muted)] text-sm">This page doesn't exist. Maybe the session expired?</p>
        <button onClick={() => navigate('/')}
          className="btn-primary mx-auto px-6 py-3">
          <ArrowLeft size={15} /> Back to Home
        </button>
      </div>
    </div>
  );
}
