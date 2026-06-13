import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Copy, Check, LayoutDashboard, Network, Clipboard, Star,
  Zap, AlertTriangle, LogOut, Users, Cpu, Sun, Moon
} from 'lucide-react';
import { Session, Member, Plan } from '@/types';
import { useCountdown } from '@/hooks/useCountup';
import { getInitials, cn } from '@/lib/utils';
import { clearAllStorage } from '@/lib/storage';
import { useTheme } from '@/components/ThemeProvider';
import { toast } from 'sonner';

interface SidebarProps {
  session: Session;
  members: Member[];
  currentMember: Member | null;
  plan: Plan | null;
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFlagBlocker: () => void;
}

const NAV = [
  { id: 'architecture', label: 'Architecture', icon: Network },
  { id: 'tasks',        label: 'Task Board',   icon: LayoutDashboard },
  { id: 'health',       label: 'Health',       icon: Zap },
  { id: 'pitch',        label: 'Pitch',        icon: Clipboard },
  { id: 'judge',        label: 'Judge Lens',   icon: Star },
];

export function Sidebar({ session, members, currentMember, plan, activeTab, onTabChange, onFlagBlocker }: SidebarProps) {
  const navigate = useNavigate();
  const { theme, toggle } = useTheme();
  const [copied, setCopied] = useState(false);
  const { h, m, s, isExpired, elapsedPct } = useCountdown(session.createdAt, session.durationHours);

  const copyCode = () => {
    navigator.clipboard.writeText(session.joinCode);
    setCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeave = () => {
    clearAllStorage();
    navigate('/');
  };

  const timerColor = isExpired ? 'text-[var(--danger)]' : elapsedPct > 80 ? 'text-[var(--warning)]' : 'text-[var(--text-primary)]';
  const barColor = elapsedPct > 80 ? 'var(--danger)' : elapsedPct > 60 ? 'var(--warning)' : 'var(--accent)';

  return (
    <aside className="fixed left-0 top-0 h-full w-[260px] flex flex-col z-40
      bg-[var(--bg-surface)] border-r border-[var(--border)]">

      {/* Logo */}
      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] flex items-center justify-center shrink-0">
            <Cpu size={13} className="text-[var(--bg)]" />
          </div>
          <div>
            <p className="text-[var(--text-primary)] font-bold text-sm tracking-tight">HackPilot</p>
            <p className="text-[var(--text-muted)] text-[10px]">AI Agent</p>
          </div>
        </div>
        <button onClick={toggle}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-[var(--text-muted)]
            hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)] transition-all">
          {theme === 'dark' ? <Sun size={13} /> : <Moon size={13} />}
        </button>
      </div>

      {/* Session code */}
      <div className="px-5 py-3.5 border-b border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-1.5">Session</p>
        <button onClick={copyCode} className="flex items-center gap-2 w-full group">
          <span className="font-mono text-lg font-bold tracking-widest text-[var(--text-primary)]">
            {session.joinCode}
          </span>
          <span className="ml-auto text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
            {copied ? <Check size={13} className="text-[var(--success)]" /> : <Copy size={13} />}
          </span>
        </button>
      </div>

      {/* Countdown */}
      <div className="px-5 py-3.5 border-b border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-1.5">Time Remaining</p>
        <div className={cn('font-mono text-2xl font-black tabular-nums tracking-tight', timerColor)}>
          {h}:{m}:{s}
        </div>
        <div className="mt-2 h-[2px] bg-[var(--bg-elevated)] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${elapsedPct}%`, background: barColor }} />
        </div>
        <p className="text-[var(--text-disabled)] text-[10px] mt-1 font-mono">{Math.round(elapsedPct)}% elapsed</p>
      </div>

      {/* Team */}
      <div className="px-5 py-3.5 border-b border-[var(--border)]">
        <p className="text-[var(--text-muted)] text-[10px] uppercase tracking-widest mb-2 flex items-center gap-1">
          <Users size={10} /> Team ({members.length})
        </p>
        <div className="flex flex-wrap gap-1.5">
          {members.map(m => (
            <div key={m.id} title={`${m.displayName} — ${m.role}`}
              className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                ring-2 ring-[var(--bg-surface)]"
              style={{ background: m.avatarColor }}>
              {getInitials(m.displayName)}
            </div>
          ))}
          {members.length === 0 && (
            <p className="text-[var(--text-disabled)] text-xs">No members yet</p>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {NAV.map(item => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button key={item.id} onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                active
                  ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
              )}>
              <Icon size={15} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.id === 'tasks' && plan && (
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded font-mono font-bold',
                  active
                    ? 'bg-[var(--bg)]/20 text-[var(--bg)]/60'
                    : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)]')}>
                  v{plan.version}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="px-4 py-4 border-t border-[var(--border)] space-y-2">
        <button onClick={onFlagBlocker}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
            bg-red-500/5 text-[var(--danger)] border border-[var(--danger)]/20
            hover:bg-red-500/10 hover:border-[var(--danger)]/40 transition-all">
          <AlertTriangle size={14} />
          Flag Blocker + Replan
        </button>
        <button onClick={handleLeave}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs
            text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors">
          <LogOut size={12} />
          Leave Session
        </button>
      </div>
    </aside>
  );
}
