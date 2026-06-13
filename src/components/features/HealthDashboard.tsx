import { useMemo } from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, Zap } from 'lucide-react';
import { Plan, Member, Session } from '@/types';
import { useCountUp } from '@/hooks/useCountup';
import { useCountdown } from '@/hooks/useCountup';
import { getHealthStatus, cn } from '@/lib/utils';

interface Props { plan: Plan; members: Member[]; session: Session; }

function Num({ value, suffix = '' }: { value: number; suffix?: string }) {
  const n = useCountUp(value, 1200);
  return <span>{n}{suffix}</span>;
}

export function HealthDashboard({ plan, members, session }: Props) {
  const { elapsedPct } = useCountdown(session.createdAt, session.durationHours);

  const stats = useMemo(() => {
    const t = plan.tasks;
    const total = t.length;
    const done  = t.filter(x => x.status === 'done').length;
    const prog  = t.filter(x => x.status === 'in-progress').length;
    const blk   = t.filter(x => x.status === 'blocked').length;
    const pct   = total ? Math.round((done / total) * 100) : 0;
    const mvp   = t.filter(x => x.tier === 'core_mvp');
    const mvpD  = mvp.filter(x => x.status === 'done').length;
    const mvpPct= mvp.length ? Math.round((mvpD / mvp.length) * 100) : 0;
    const hrs   = t.reduce((a, x) => a + x.estimatedHours, 0);
    const hrsD  = t.filter(x => x.status === 'done').reduce((a, x) => a + x.estimatedHours, 0);
    const next  = t.find(x => x.status === 'todo' || x.status === 'in-progress');
    const perMember = members.map(m => {
      const mt = t.filter(x => x.assignedTo === m.id || x.assignedToLabel === m.displayName);
      const md = mt.filter(x => x.status === 'done').length;
      return { member: m, total: mt.length, done: md, pct: mt.length ? Math.round((md / mt.length) * 100) : 0 };
    }).filter(s => s.total > 0);
    return { total, done, prog, blk, pct, mvpPct, hrs, hrsD, perMember, next };
  }, [plan.tasks, members]);

  const health = getHealthStatus(stats.pct, elapsedPct);
  const hCfg = {
    green: { color: 'var(--success)', bg: 'bg-green-500/5',   border: 'border-green-500/20',  label: 'On Track',        Icon: CheckCircle },
    amber: { color: 'var(--warning)', bg: 'bg-amber-500/5',   border: 'border-amber-500/20',  label: 'Slightly Behind', Icon: AlertTriangle },
    red:   { color: 'var(--danger)',  bg: 'bg-red-500/5',     border: 'border-red-500/20',    label: 'At Risk',         Icon: AlertTriangle },
  }[health];

  return (
    <div className="p-7 space-y-5 max-w-5xl mx-auto">
      <div className="fade-up">
        <h2 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">Health</h2>
        <p className="text-[var(--text-muted)] text-sm mt-0.5">Real-time project metrics</p>
      </div>

      {/* Status banner */}
      <div className={cn('flex items-center gap-4 p-4 rounded-xl border fade-up-1', hCfg.bg, hCfg.border)}>
        <hCfg.Icon size={18} style={{ color: hCfg.color }} />
        <div className="flex-1">
          <p className="font-bold text-sm" style={{ color: hCfg.color }}>{hCfg.label}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">
            {stats.pct}% tasks done · {Math.round(elapsedPct)}% time elapsed
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Expected</p>
          <p className="font-bold text-[var(--text-primary)] text-sm">{Math.round(elapsedPct)}%</p>
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 fade-up-2">
        <div className="panel rounded-2xl p-5 col-span-2 flex flex-col items-center">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2">Overall Completion</p>
          <div className="relative h-44 w-44">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="65%" outerRadius="90%"
                startAngle={90} endAngle={-270}
                data={[{ value: stats.pct, fill: 'var(--text-primary)' }]}>
                <RadialBar dataKey="value" cornerRadius={8}
                  background={{ fill: 'var(--bg-elevated)' }} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-4xl font-black text-[var(--text-primary)] tabular-nums">
                <Num value={stats.pct} suffix="%" />
              </p>
              <p className="text-[11px] text-[var(--text-muted)] mt-1">{stats.done}/{stats.total} tasks</p>
            </div>
          </div>
        </div>

        {[
          { label: 'In Progress', value: stats.prog,                          color: '#a78bfa', icon: TrendingUp },
          { label: 'Blocked',     value: stats.blk,                           color: 'var(--danger)', icon: AlertTriangle },
          { label: 'Hours Done',  value: Math.round(stats.hrsD * 10) / 10,   color: 'var(--success)', icon: Clock, suffix: 'h' },
          { label: 'MVP Done',    value: stats.mvpPct,                        color: 'var(--warning)', icon: Zap, suffix: '%' },
        ].map(item => (
          <div key={item.label} className="panel rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">{item.label}</p>
              <item.icon size={14} style={{ color: item.color }} />
            </div>
            <p className="text-3xl font-black mt-3 tabular-nums" style={{ color: item.color }}>
              <Num value={item.value} suffix={(item as any).suffix} />
            </p>
          </div>
        ))}
      </div>

      {/* Time bars */}
      <div className="panel rounded-2xl p-5 space-y-4 fade-up-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-[var(--text-primary)]">Time vs Progress</p>
          <p className="text-xs text-[var(--text-muted)]">{plan.timeBudget.total_hours}h total</p>
        </div>
        {[
          { label: 'Time elapsed',     pct: Math.min(100, elapsedPct),   color: 'var(--accent)' },
          { label: 'Task completion',  pct: stats.pct,
            color: health === 'green' ? 'var(--success)' : health === 'amber' ? 'var(--warning)' : 'var(--danger)' },
        ].map(item => (
          <div key={item.label}>
            <div className="flex justify-between text-[11px] text-[var(--text-muted)] mb-1.5">
              <span>{item.label}</span>
              <span className="font-mono">{Math.round(item.pct)}%</span>
            </div>
            <div className="h-1.5 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${item.pct}%`, background: item.color }} />
            </div>
          </div>
        ))}
      </div>

      {stats.next && (
        <div className="panel panel-accent rounded-2xl p-5 fade-up-3">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest mb-2">Next Action</p>
          <p className="text-[var(--text-primary)] font-bold">{stats.next.title}</p>
          <p className="text-[var(--text-secondary)] text-sm mt-1 leading-relaxed">{stats.next.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="tag">{stats.next.estimatedHours}h</span>
            <span className="text-xs text-[var(--text-muted)]">→ {stats.next.assignedToLabel}</span>
          </div>
        </div>
      )}

      {stats.perMember.length > 0 && (
        <div className="panel rounded-2xl p-5 fade-up-4">
          <p className="text-sm font-bold text-[var(--text-primary)] mb-4">Team Progress</p>
          <div className="space-y-4">
            {stats.perMember.map(({ member, total, done, pct }) => (
              <div key={member.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: member.avatarColor }}>
                      {member.displayName[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-[var(--text-secondary)] font-medium">{member.displayName}</span>
                    <span className="text-[11px] text-[var(--text-muted)]">{member.role}</span>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] font-mono">{done}/{total}</span>
                </div>
                <div className="h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${pct}%`, background: member.avatarColor }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="panel rounded-2xl p-5 fade-up-4">
        <p className="text-sm font-bold text-[var(--text-primary)] mb-4">Time Budget</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total',   val: `${plan.timeBudget.total_hours}h` },
            { label: 'Working', val: `${plan.timeBudget.working_hours}h` },
            { label: 'MVP Cap', val: `${plan.timeBudget.core_mvp_hours_cap}h` },
            { label: 'Used',    val: `~${Math.round((elapsedPct / 100) * plan.timeBudget.working_hours * 10) / 10}h` },
          ].map(item => (
            <div key={item.label} className="text-center">
              <p className="text-xl font-black text-[var(--text-primary)]">{item.val}</p>
              <p className="text-[11px] text-[var(--text-muted)] mt-0.5 uppercase tracking-wider">{item.label}</p>
            </div>
          ))}
        </div>
        {plan.timeBudget.deadline_note && (
          <p className="text-xs text-[var(--text-muted)] mt-4 pt-3 border-t border-[var(--border)]">
            ⏱ {plan.timeBudget.deadline_note}
          </p>
        )}
      </div>
    </div>
  );
}
