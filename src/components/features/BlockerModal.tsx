import { useState } from 'react';
import { X, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  onClose: () => void;
  onReplan: (description: string, hoursRemaining: number) => Promise<void>;
  hoursRemaining: number;
}

export function BlockerModal({ onClose, onReplan, hoursRemaining }: Props) {
  const [description, setDescription] = useState('');
  const [hours, setHours] = useState(Math.round(hoursRemaining * 10) / 10);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!description.trim() || loading) return;
    setLoading(true);
    await onReplan(description, hours);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative z-10 w-full max-w-md scale-in">
        <div className="panel panel-accent rounded-2xl p-6 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[var(--danger)]/10 border border-[var(--danger)]/20
                flex items-center justify-center">
                <AlertTriangle size={16} className="text-[var(--danger)]" />
              </div>
              <div>
                <h3 className="text-[var(--text-primary)] font-bold text-lg tracking-tight">Flag Blocker</h3>
                <p className="text-[var(--text-muted)] text-xs">HackPilot will replan around this</p>
              </div>
            </div>
            <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Blocker description */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
              Describe the Blocker
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="e.g. The Supabase integration is taking longer than expected. The auth flow keeps throwing 401 errors and we can't unblock the backend developer."
              className="input-base h-28 resize-none leading-relaxed"
              autoFocus
            />
          </div>

          {/* Hours remaining */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
              Actual Hours Remaining
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                value={hours}
                onChange={e => setHours(Math.max(0.5, Number(e.target.value)))}
                step={0.5}
                min={0.5}
                className="input-base w-28 text-center font-mono"
              />
              <p className="text-xs text-[var(--text-muted)]">
                System estimate: ~{Math.round(hoursRemaining * 10) / 10}h
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1 justify-center py-3 text-sm">
              Cancel
            </button>
            <button onClick={handleSubmit} disabled={!description.trim() || loading}
              className={cn('flex-1 btn-primary justify-center py-3 text-sm',
                !description.trim() ? 'opacity-40 cursor-not-allowed' : '')}>
              {loading
                ? <><Loader2 size={15} className="animate-spin" />Replanning…</>
                : <>Replan with AI</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
