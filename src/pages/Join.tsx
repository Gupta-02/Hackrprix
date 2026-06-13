import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Loader2, Cpu } from 'lucide-react';
import { findSessionByCode } from '@/lib/storage';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export function Join() {
  const navigate = useNavigate();
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  const joinCode = code.join('').toUpperCase();
  const isComplete = code.every(c => c !== '');

  const handleChange = (idx: number, val: string) => {
    const char = val.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(-1);
    const next = [...code];
    next[idx] = char;
    setCode(next);
    setError('');
    if (char && idx < 5) refs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (idx: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[idx] && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === 'Enter' && isComplete) handleJoin();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData('text').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      setError('');
      refs.current[5]?.focus();
    }
    e.preventDefault();
  };

  const handleJoin = async () => {
    if (!isComplete || loading) return;
    setLoading(true);
    setError('');
    await new Promise(r => setTimeout(r, 400));
    const session = findSessionByCode(joinCode);
    if (!session) {
      setError('Session not found. Check the code and try again.');
      toast.error('Invalid join code');
      setLoading(false);
      return;
    }
    navigate(`/session/${joinCode}/onboard`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg)] flex items-center justify-center px-4 relative">
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb-slow absolute w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', bottom: '5%', left: '-5%', opacity: 0.05 }} />
      </div>

      <div className="relative z-10 w-full max-w-sm">
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] text-sm transition-colors group">
            <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" /> Back
          </button>
          <ThemeToggle />
        </div>

        <div className="panel panel-accent rounded-2xl p-8 space-y-8 text-center">
          <div>
            <div className="w-10 h-10 mx-auto rounded-xl bg-[var(--text-primary)] flex items-center justify-center mb-5">
              <Cpu size={16} className="text-[var(--bg)]" />
            </div>
            <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">Join Session</h1>
            <p className="text-[var(--text-muted)] text-sm mt-1">Enter the 6-character code from your lead</p>
          </div>

          <div className="flex items-center justify-center gap-2" onPaste={handlePaste}>
            {code.map((char, i) => (
              <input
                key={i}
                ref={el => { refs.current[i] = el; }}
                value={char}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={2}
                className={cn(
                  'w-11 h-[52px] text-center text-lg font-bold font-mono rounded-xl border transition-all',
                  'focus:outline-none bg-[var(--bg-input)] text-[var(--text-primary)]',
                  error ? 'border-[var(--danger)]/60' :
                  char ? 'border-[var(--border-accent)] bg-[var(--accent-soft)]' : 'border-[var(--border)]',
                  'focus:border-[var(--border-accent)]'
                )}
              />
            ))}
          </div>

          {error && <p className="text-[var(--danger)] text-sm -mt-4">{error}</p>}

          <button onClick={handleJoin} disabled={!isComplete || loading}
            className="btn-primary w-full justify-center py-3.5 text-sm">
            {loading
              ? <><Loader2 size={15} className="animate-spin" />Joining...</>
              : <>Join Session <ArrowRight size={15} /></>}
          </button>

          <p className="text-xs text-[var(--text-disabled)]">Paste the full code into any cell</p>
        </div>
      </div>
    </div>
  );
}
