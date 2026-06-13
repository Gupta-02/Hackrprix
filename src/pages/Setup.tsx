import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, AlertCircle, Cpu } from 'lucide-react';
import { generateId, generateJoinCode, saveSession, saveMembers } from '@/lib/storage';
import { Session } from '@/types';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const QUICK_DURATIONS = [12, 24, 36, 48];

export function Setup() {
  const navigate = useNavigate();
  const [problem, setProblem] = useState('');
  const [duration, setDuration] = useState(24);
  const [agenda, setAgenda] = useState('');
  const [loading, setLoading] = useState(false);

  const charCount = problem.length;
  const isValid = charCount >= 30 && charCount <= 1000 && duration >= 1 && duration <= 72;
  const charStatus = charCount === 0 ? 'empty' : charCount < 30 ? 'short' : charCount > 1000 ? 'over' : 'ok';

  const handleSubmit = async () => {
    if (!isValid || loading) return;
    setLoading(true);
    await new Promise(r => setTimeout(r, 350));
    const sessionId = generateId();
    const joinCode = generateJoinCode();
    const now = new Date();
    const session: Session = {
      id: sessionId, joinCode,
      problemStatement: problem.trim(),
      durationHours: duration,
      agendaText: agenda.trim() || undefined,
      createdAt: now.toISOString(),
      expiresAt: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
      status: 'active',
    };
    saveSession(session);
    saveMembers([]);
    toast.success(`Session ${joinCode} created`);
    navigate(`/session/${joinCode}/onboard?lead=true`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 py-14 relative">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb absolute w-[600px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: '-10%', right: '-5%', opacity: 0.06 }} />
      </div>
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <ThemeToggle />
        </div>

        <div className="panel panel-accent rounded-2xl p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--text-primary)] flex items-center justify-center shrink-0">
              <Cpu size={14} className="text-[var(--bg)]" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">Create Session</h1>
              <p className="text-[var(--text-muted)] text-xs mt-0.5">Team joins via 6-char code or QR</p>
            </div>
          </div>

          {/* Problem */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider">
                Problem Statement
              </label>
              <span className={cn('text-xs font-mono tabular-nums',
                charStatus === 'ok' ? 'text-[var(--success)]' :
                charStatus === 'over' ? 'text-[var(--danger)]' : 'text-[var(--text-muted)]')}>
                {charCount}/1000
              </span>
            </div>
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && e.metaKey && handleSubmit()}
              placeholder="Describe the problem your team will solve. Be specific about the target user, pain point, and context. Minimum 30 characters."
              className="input-base h-44 resize-none leading-relaxed"
            />
            {charStatus === 'short' && charCount > 0 && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--warning)]">
                <AlertCircle size={11} /> {30 - charCount} more characters needed
              </p>
            )}
          </div>

          {/* Duration */}
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
              Duration (hours)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number" value={duration}
                onChange={e => setDuration(Math.min(72, Math.max(1, Number(e.target.value))))}
                min={1} max={72}
                className="input-base w-24 text-center font-mono"
              />
              <div className="flex gap-1.5">
                {QUICK_DURATIONS.map(h => (
                  <button key={h} onClick={() => setDuration(h)}
                    className={cn('px-3 py-2 rounded-lg text-xs font-bold transition-all',
                      duration === h
                        ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                        : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]')}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Agenda */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider flex items-center gap-2">
              Agenda
              <span className="text-[var(--text-muted)] font-normal normal-case tracking-normal text-xs">optional</span>
            </label>
            <textarea
              value={agenda}
              onChange={e => setAgenda(e.target.value)}
              placeholder="Paste any schedule or blocked times. e.g. '9am: Opening (1h), 1pm: Lunch (45min), 9pm: Submit'"
              className="input-base h-24 resize-none"
            />
          </div>

          {/* Submit */}
          <button onClick={handleSubmit} disabled={!isValid || loading}
            className="btn-primary w-full justify-center py-3.5 text-sm">
            {loading
              ? <><Loader2 size={16} className="animate-spin" />Creating...</>
              : <>Create Session <ArrowRight size={16} /></>}
          </button>

          <p className="text-xs text-[var(--text-disabled)] text-center">⌘ + Enter to submit quickly</p>
        </div>
      </div>
    </div>
  );
}
