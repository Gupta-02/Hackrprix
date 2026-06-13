import { useState, useMemo } from 'react';
import { Task, Member, Plan } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/lib/utils';
import { Filter, X, GitBranch } from 'lucide-react';

interface Props {
  plan: Plan;
  members: Member[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
}

type ViewMode = 'tier' | 'kanban' | 'graph';
type SortKey  = 'none' | 'hours_asc' | 'hours_desc' | 'deps';

const TIERS = [
  { id: 'core_mvp',     label: 'Core MVP',     color: '#a78bfa', desc: 'Must ship' },
  { id: 'nice_to_have', label: 'Nice to Have', color: '#60a5fa', desc: 'If time allows' },
  { id: 'stretch',      label: 'Stretch',      color: '#34d399', desc: 'Bonus goals' },
] as const;

const STATUS_COLS = [
  { id: 'todo',        label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'done',        label: 'Done' },
  { id: 'blocked',     label: 'Blocked' },
] as const;

export function TaskBoard({ plan, members, onUpdateTask }: Props) {
  const [view,           setView]           = useState<ViewMode>('tier');
  const [draggedId,      setDraggedId]      = useState<string | null>(null);
  const [dragOver,       setDragOver]       = useState<string | null>(null);
  const [sort,           setSort]           = useState<SortKey>('none');
  const [filterAssignee, setFilterAssignee] = useState('all');
  const [filterStatus,   setFilterStatus]   = useState('all');
  const [filterTier,     setFilterTier]     = useState('all');
  const [showFilters,    setShowFilters]     = useState(false);

  const tasks = plan.tasks;

  const filtered = useMemo(() => {
    let t = [...tasks];
    if (filterAssignee !== 'all') t = t.filter(x => x.assignedTo === filterAssignee || x.assignedToLabel === filterAssignee);
    if (filterStatus   !== 'all') t = t.filter(x => x.status === filterStatus);
    if (filterTier     !== 'all') t = t.filter(x => x.tier   === filterTier);
    if (sort === 'hours_asc')  t.sort((a, b) => a.estimatedHours - b.estimatedHours);
    if (sort === 'hours_desc') t.sort((a, b) => b.estimatedHours - a.estimatedHours);
    if (sort === 'deps')       t.sort((a, b) => a.dependsOn.length - b.dependsOn.length);
    return t;
  }, [tasks, filterAssignee, filterStatus, filterTier, sort]);

  const activeFilters = [filterAssignee, filterStatus, filterTier].filter(f => f !== 'all').length;

  const criticalPath = useMemo(() => {
    const mvp = tasks.filter(t => t.tier === 'core_mvp');
    const sorted: Task[] = [];
    const visited = new Set<string>();
    const visit = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const task = mvp.find(t => t.id === id);
      if (!task) return;
      task.dependsOn.forEach(visit);
      sorted.push(task);
    };
    mvp.forEach(t => visit(t.id));
    return sorted;
  }, [tasks]);

  const mvpDone  = tasks.filter(t => t.tier === 'core_mvp' && t.status === 'done').length;
  const mvpTotal = tasks.filter(t => t.tier === 'core_mvp').length;
  const mvpHours = tasks.filter(t => t.tier === 'core_mvp').reduce((a, t) => a + t.estimatedHours, 0);

  const handleDrop = (target: string) => {
    if (draggedId) onUpdateTask(draggedId, { status: target as Task['status'] });
    setDraggedId(null); setDragOver(null);
  };

  const clearFilters = () => {
    setFilterAssignee('all'); setFilterStatus('all'); setFilterTier('all'); setSort('none');
  };

  const selectClass = 'bg-[var(--bg-input)] border border-[var(--border)] rounded-lg px-2.5 py-2 text-xs text-[var(--text-secondary)] focus:outline-none focus:border-[var(--border-accent)] cursor-pointer';

  return (
    <div className="p-7 space-y-5 h-full">
      {/* Header */}
      <div className="flex items-start justify-between fade-up">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">Task Board</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">
            v{plan.version} · {tasks.length} tasks · {mvpDone}/{mvpTotal} MVP done · {mvpHours}h est.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-[var(--bg-elevated)] border border-[var(--border)] rounded-lg p-0.5 gap-0.5">
            {(['tier', 'kanban', 'graph'] as ViewMode[]).map(m => (
              <button key={m} onClick={() => setView(m)}
                className={cn('px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize',
                  view === m
                    ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]')}>
                {m === 'graph' ? <GitBranch size={12} /> : m}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap fade-up-1">
        <button onClick={() => setShowFilters(s => !s)}
          className={cn('flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-all',
            showFilters || activeFilters > 0
              ? 'bg-[var(--text-primary)] text-[var(--bg)] border-[var(--text-primary)]'
              : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]')}>
          <Filter size={12} />
          Filters
          {activeFilters > 0 && (
            <span className="bg-violet-600 text-white w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold">
              {activeFilters}
            </span>
          )}
        </button>

        {showFilters && (
          <>
            <select value={filterAssignee} onChange={e => setFilterAssignee(e.target.value)} className={selectClass}>
              <option value="all">All Assignees</option>
              {members.map(m => <option key={m.id} value={m.id}>{m.displayName}</option>)}
            </select>
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className={selectClass}>
              <option value="all">All Statuses</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="blocked">Blocked</option>
            </select>
            <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className={selectClass}>
              <option value="all">All Tiers</option>
              <option value="core_mvp">Core MVP</option>
              <option value="nice_to_have">Nice to Have</option>
              <option value="stretch">Stretch</option>
            </select>
            <select value={sort} onChange={e => setSort(e.target.value as SortKey)} className={selectClass}>
              <option value="none">Default order</option>
              <option value="hours_asc">Hours ↑</option>
              <option value="hours_desc">Hours ↓</option>
              <option value="deps">Fewest deps first</option>
            </select>
            {activeFilters > 0 && (
              <button onClick={clearFilters}
                className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-xs text-[var(--text-muted)]
                  hover:text-[var(--text-primary)] border border-[var(--border)] hover:border-[var(--border-accent)] transition-all">
                <X size={11} /> Clear
              </button>
            )}
          </>
        )}
        {filtered.length !== tasks.length && (
          <span className="text-xs text-[var(--text-muted)] ml-auto">
            {filtered.length}/{tasks.length} tasks
          </span>
        )}
      </div>

      {/* ── Tier view ── */}
      {view === 'tier' && (
        <div className="space-y-8">
          {TIERS.map(tier => {
            const tierTasks = filtered.filter(t => t.tier === tier.id);
            const done = tierTasks.filter(t => t.status === 'done').length;
            return (
              <div key={tier.id} className="fade-up">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-px flex-1 bg-[var(--border)]" />
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ background: tier.color }} />
                    <span className="text-sm font-bold" style={{ color: tier.color }}>{tier.label}</span>
                    <span className="text-xs text-[var(--text-muted)]">{tier.desc}</span>
                    <span className="text-[10px] text-[var(--text-disabled)] font-mono">{done}/{tierTasks.length}</span>
                  </div>
                  <div className="h-px flex-1 bg-[var(--border)]" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {tierTasks.map(task => (
                    <div key={task.id} draggable
                      onDragStart={() => setDraggedId(task.id)}
                      onDragEnd={() => { setDraggedId(null); setDragOver(null); }}>
                      <TaskCard task={task} members={members} onUpdate={onUpdateTask} isDragging={draggedId === task.id} />
                    </div>
                  ))}
                  {tierTasks.length === 0 && (
                    <div className="col-span-full py-8 text-center text-[var(--text-disabled)] text-sm
                      border border-dashed border-[var(--border)] rounded-xl">
                      No tasks in this tier
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Kanban view ── */}
      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-3 min-h-[400px]">
          {STATUS_COLS.map(col => {
            const colTasks = filtered.filter(t => t.status === col.id);
            const isOver   = dragOver === col.id;
            return (
              <div key={col.id}
                onDragOver={e => { e.preventDefault(); setDragOver(col.id); }}
                onDragLeave={() => setDragOver(null)}
                onDrop={() => handleDrop(col.id)}
                className={cn('rounded-xl p-3 space-y-2.5 min-h-[200px] border transition-all',
                  isOver ? 'drag-over-col' : 'bg-[var(--bg-elevated)]/50 border-[var(--border)]')}>
                <div className="flex items-center justify-between px-1 py-1">
                  <span className="text-xs font-bold text-[var(--text-secondary)]">{col.label}</span>
                  <span className="text-[10px] bg-[var(--bg-elevated)] border border-[var(--border)]
                    text-[var(--text-muted)] px-1.5 py-0.5 rounded font-mono">{colTasks.length}</span>
                </div>
                {colTasks.map(task => (
                  <div key={task.id} draggable
                    onDragStart={() => setDraggedId(task.id)}
                    onDragEnd={() => { setDraggedId(null); setDragOver(null); }}>
                    <TaskCard task={task} members={members} onUpdate={onUpdateTask} isDragging={draggedId === task.id} />
                  </div>
                ))}
                {colTasks.length === 0 && (
                  <div className={cn('py-6 text-center text-xs rounded-xl border border-dashed transition-colors',
                    isOver
                      ? 'border-[var(--border-accent)] text-violet-400'
                      : 'border-[var(--border)] text-[var(--text-disabled)]')}>
                    {isOver ? 'Drop here' : 'Empty'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Graph / critical path view ── */}
      {view === 'graph' && (
        <div className="space-y-4 fade-up">
          <div className="panel rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={14} className="text-violet-400" />
              <h3 className="text-sm font-bold text-[var(--text-primary)]">Critical Path — Core MVP</h3>
              <span className="text-xs text-[var(--text-muted)]">(ordered by dependency)</span>
            </div>
            <div className="relative">
              <div className="absolute left-3.5 top-4 bottom-4 w-px bg-[var(--border)]" />
              <div className="space-y-0">
                {criticalPath.map((task) => {
                  const colors: Record<string, { dot: string; border: string; bg: string }> = {
                    'todo':        { dot: 'bg-[var(--text-muted)]',     border: 'border-[var(--border)]',             bg: 'bg-[var(--bg-elevated)]' },
                    'in-progress': { dot: 'bg-violet-500',               border: 'border-violet-500/30',               bg: 'bg-violet-500/5' },
                    'done':        { dot: 'bg-[var(--success)]',         border: 'border-[var(--success)]/30',         bg: 'bg-[var(--success)]/5' },
                    'blocked':     { dot: 'bg-[var(--danger)]',          border: 'border-[var(--danger)]/30',          bg: 'bg-[var(--danger)]/5' },
                  };
                  const c = colors[task.status];
                  return (
                    <div key={task.id} className="flex items-start gap-4 pb-4">
                      <div className="relative z-10 mt-3.5">
                        <div className={cn('w-2.5 h-2.5 rounded-full shrink-0', c.dot)} />
                      </div>
                      <div className={cn('flex-1 border rounded-xl px-4 py-3 transition-all', c.border, c.bg)}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{task.title}</p>
                            <p className="text-xs text-[var(--text-muted)] mt-0.5">{task.description}</p>
                            {task.dependsOn.length > 0 && (
                              <p className="text-[10px] text-[var(--text-disabled)] mt-1.5">
                                Depends on: {task.dependsOn.join(', ')}
                              </p>
                            )}
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-xs font-mono text-[var(--text-secondary)]">{task.estimatedHours}h</p>
                            <p className="text-[10px] text-[var(--text-muted)] mt-1">{task.assignedToLabel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {['nice_to_have', 'stretch'].map(tier => {
            const t = filtered.filter(x => x.tier === tier);
            if (!t.length) return null;
            const cfg = TIERS.find(x => x.id === tier)!;
            return (
              <div key={tier} className="panel rounded-xl p-4">
                <p className="text-xs font-bold mb-3" style={{ color: cfg.color }}>{cfg.label}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {t.map(task => (
                    <div key={task.id} className="flex items-center gap-3 px-3 py-2 bg-[var(--bg-elevated)]
                      rounded-lg border border-[var(--border)]">
                      <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />
                      <p className="text-xs text-[var(--text-secondary)] flex-1 truncate">{task.title}</p>
                      <span className="text-[10px] font-mono text-[var(--text-muted)]">{task.estimatedHours}h</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
