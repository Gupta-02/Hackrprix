import { useState } from 'react';
import { Task, Member } from '@/types';
import { cn } from '@/lib/utils';
import { Clock, ChevronDown, GitBranch } from 'lucide-react';

interface Props {
  task: Task;
  members: Member[];
  onUpdate: (taskId: string, updates: Partial<Task>) => void;
  isDragging?: boolean;
}

const STATUS_OPTIONS: { value: Task['status']; label: string; color: string }[] = [
  { value: 'todo',        label: 'To Do',       color: 'text-[var(--text-muted)]' },
  { value: 'in-progress', label: 'In Progress',  color: 'text-[#a78bfa]' },
  { value: 'done',        label: 'Done',         color: 'text-[var(--success)]' },
  { value: 'blocked',     label: 'Blocked',      color: 'text-[var(--danger)]' },
];

const TIER_COLORS: Record<string, string> = {
  core_mvp:     'rgba(167,139,250,0.15)',
  nice_to_have: 'rgba(96,165,250,0.15)',
  stretch:      'rgba(52,211,153,0.15)',
};

export function TaskCard({ task, members, onUpdate, isDragging }: Props) {
  const [showAssignee, setShowAssignee] = useState(false);

  const statusCfg = STATUS_OPTIONS.find(s => s.value === task.status)!;
  const isBlocked = task.status === 'blocked';

  return (
    <div
      className={cn(
        'panel rounded-xl p-4 space-y-3 transition-all cursor-grab active:cursor-grabbing',
        isDragging && 'opacity-40 scale-95 rotate-1',
        'hover:border-[var(--border-accent)]'
      )}
      style={{ '--spotlight-color': TIER_COLORS[task.tier] } as React.CSSProperties}
    >
      {/* Title */}
      <div>
        <p className={cn('text-sm font-semibold leading-snug',
          task.status === 'done' ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]',
          isBlocked && 'glitch-text text-[var(--danger)]')}>
          {task.title}
        </p>
        <p className="text-xs text-[var(--text-muted)] mt-1 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      </div>

      {/* Meta row */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="tag flex items-center gap-1">
          <Clock size={9} />
          {task.estimatedHours}h
        </span>
        {task.dependsOn.length > 0 && (
          <span className="tag flex items-center gap-1">
            <GitBranch size={9} />
            {task.dependsOn.length} dep{task.dependsOn.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Status selector */}
      <div className="flex items-center gap-2">
        <select
          value={task.status}
          onChange={e => onUpdate(task.id, { status: e.target.value as Task['status'] })}
          className={cn(
            'flex-1 bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2.5 py-1.5',
            'text-xs focus:outline-none focus:border-[var(--border-accent)] transition-colors cursor-pointer',
            statusCfg.color
          )}
        >
          {STATUS_OPTIONS.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Assignee */}
        <div className="relative">
          <button
            onClick={() => setShowAssignee(s => !s)}
            className="flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]
              border border-[var(--border)] rounded-lg px-2.5 py-1.5 hover:border-[var(--border-accent)]
              hover:text-[var(--text-primary)] transition-all max-w-[100px] truncate">
            <span className="truncate">{task.assignedToLabel || 'Assign'}</span>
            <ChevronDown size={10} className="shrink-0" />
          </button>
          {showAssignee && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-[var(--bg-panel)] border border-[var(--border)]
              rounded-xl shadow-xl min-w-[140px] overflow-hidden">
              {members.map(m => (
                <button key={m.id}
                  onClick={() => { onUpdate(task.id, { assignedTo: m.id, assignedToLabel: m.displayName }); setShowAssignee(false); }}
                  className="w-full text-left px-3 py-2.5 text-xs text-[var(--text-secondary)]
                    hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)] transition-colors flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full shrink-0" style={{ background: m.avatarColor }} />
                  {m.displayName}
                </button>
              ))}
              {members.length === 0 && (
                <p className="px-3 py-2 text-xs text-[var(--text-muted)]">No members</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
