import { useState } from 'react';
import { Star, Loader2, TrendingUp, Monitor, Lightbulb } from 'lucide-react';
import { JudgeEvaluation, Plan, Session } from '@/types';
import { useCountUp } from '@/hooks/useCountup';
import { cn } from '@/lib/utils';

interface Props {
  evaluation: JudgeEvaluation | null;
  plan: Plan;
  session: Session;
  onEvaluate: () => Promise<void>;
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const n = useCountUp(score, 1400);
  const r = 32;
  const circ = 2 * Math.PI * r;
  const offset = circ - (n / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="absolute inset-0 -rotate-90" width="80" height="80">
        <circle cx="40" cy="40" r={r} strokeWidth="3" stroke="var(--bg-elevated)" fill="none" />
        <circle cx="40" cy="40" r={r} strokeWidth="3" stroke={color} fill="none"
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <span className="text-xl font-black" style={{ color }}>{n}</span>
    </div>
  );
}

const DIMS = [
  { key: 'demoability',       icon: Monitor,    label: 'Demo-ability',       color: 'var(--text-primary)' },
  { key: 'technicalAmbition', icon: TrendingUp, label: 'Technical Ambition', color: '#a78bfa' },
  { key: 'impactClarity',     icon: Lightbulb,  label: 'Impact Clarity',     color: 'var(--success)' },
] as const;

export function JudgeLens({ evaluation, plan, session, onEvaluate }: Props) {
  const [loading, setLoading] = useState(false);

  const handleEval = async () => {
    setLoading(true);
    await onEvaluate();
    setLoading(false);
  };

  const overall = useCountUp(evaluation?.overallScore ?? 0, 1800);

  return (
    <div className="p-7 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">Judge Lens</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">AI evaluation from a hackathon judge's perspective</p>
        </div>
        <button onClick={handleEval} disabled={loading}
          className={cn(loading ? 'btn-secondary cursor-not-allowed opacity-60' : 'btn-primary',
            'flex items-center gap-2 px-5 py-2.5 text-sm font-bold')}>
          {loading
            ? <><Loader2 size={14} className="animate-spin" />Evaluating…</>
            : <><Star size={14} />{evaluation ? 'Re-evaluate' : 'Evaluate Plan'}</>}
        </button>
      </div>

      {!evaluation ? (
        <div className="panel rounded-2xl p-16 text-center space-y-5 fade-up-1">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)]
            flex items-center justify-center">
            <Star size={24} className="text-[var(--text-muted)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Get a Judge's Perspective</h3>
            <p className="text-[var(--text-muted)] text-sm mt-2 max-w-md mx-auto leading-relaxed">
              HackPilot evaluates your plan on Demo-ability, Technical Ambition, and Impact Clarity with concrete recommendations.
            </p>
          </div>
          {loading
            ? <p className="text-violet-400 text-sm flex items-center gap-2 justify-center">
                <Loader2 size={13} className="animate-spin" /> Analyzing your plan…
              </p>
            : <p className="text-[var(--text-disabled)] text-xs">Click "Evaluate Plan" to begin</p>
          }
        </div>
      ) : (
        <div className="space-y-5">
          <div className="panel rounded-2xl p-7 flex items-center gap-8 fade-up-1">
            <div className="text-center shrink-0">
              <p className="text-6xl font-black text-[var(--text-primary)] tabular-nums">{overall}</p>
              <p className="text-[var(--text-muted)] text-xs mt-1 uppercase tracking-wider">Overall</p>
              <div className="flex gap-0.5 justify-center mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={12}
                    className={i < Math.round(evaluation.overallScore / 20)
                      ? 'text-[var(--text-primary)] fill-[var(--text-primary)]'
                      : 'text-[var(--bg-elevated)] fill-[var(--bg-elevated)]'} />
                ))}
              </div>
            </div>
            <div className="w-px h-16 bg-[var(--border)]" />
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              {evaluation.overallScore >= 80
                ? 'Strong plan with clear demo path and compelling impact narrative.'
                : evaluation.overallScore >= 65
                  ? 'Solid foundation — address the recommendations below for a stronger pitch.'
                  : 'Plan needs refinement before judging. Prioritize the recommendations.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {DIMS.map(({ key, icon: Icon, label, color }, idx) => {
              const dim = evaluation[key];
              return (
                <div key={key} className={`spotlight panel panel-accent rounded-2xl p-5 space-y-4 fade-up-${idx + 2}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)]
                        flex items-center justify-center">
                        <Icon size={14} style={{ color }} />
                      </div>
                      <p className="text-sm font-bold text-[var(--text-primary)]">{label}</p>
                    </div>
                    <ScoreRing score={dim.score} color={color} />
                  </div>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Critique</p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">{dim.critique}</p>
                    </div>
                    <div className="pt-3 border-t border-[var(--border)]">
                      <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Recommendation</p>
                      <p className="text-xs leading-relaxed" style={{ color }}>{dim.recommendation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-[var(--text-disabled)] text-center">
            Evaluated {new Date(evaluation.createdAt).toLocaleTimeString()} · Re-evaluate after changes
          </p>
        </div>
      )}
    </div>
  );
}
