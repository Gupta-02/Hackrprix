import { useState } from 'react';
import { Clipboard, Loader2, ChevronDown, ChevronUp, Download, Copy, Check, RefreshCw } from 'lucide-react';
import { Pitch, Plan, Member } from '@/types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface Props {
  pitch: Pitch | null;
  plan: Plan;
  members: Member[];
  isLead: boolean;
  onGenerate: (emphasis?: string) => Promise<void>;
}

export function PitchTab({ pitch, plan, members, isLead, onGenerate }: Props) {
  const [loading, setLoading] = useState(false);
  const [emphasis, setEmphasis] = useState('');
  const [openSections, setOpenSections] = useState<Set<number>>(new Set([0]));
  const [editedSections, setEditedSections] = useState<Record<number, string>>({});
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    await onGenerate(emphasis);
    setEditedSections({});
    setOpenSections(new Set([0]));
    setLoading(false);
  };

  const toggleSection = (i: number) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  const getSectionContent = (i: number) =>
    editedSections[i] ?? (pitch?.sections[i]?.content ?? '');

  const handleEdit = (i: number, val: string) =>
    setEditedSections(prev => ({ ...prev, [i]: val }));

  const copyAll = () => {
    if (!pitch) return;
    const text = pitch.sections.map((s, i) =>
      `## ${s.title}\n\n${getSectionContent(i)}`
    ).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Pitch copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  const exportTxt = () => {
    if (!pitch) return;
    const text = pitch.sections.map((s, i) =>
      `${s.title.toUpperCase()}\n${'─'.repeat(40)}\n\n${getSectionContent(i)}`
    ).join('\n\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href = url; a.download = 'pitch-outline.txt'; a.click();
    URL.revokeObjectURL(url);
    toast.success('Pitch exported');
  };

  return (
    <div className="p-7 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-start justify-between fade-up">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-[var(--text-primary)]">Pitch Outline</h2>
          <p className="text-[var(--text-muted)] text-sm mt-0.5">2-minute presentation guide</p>
        </div>
        {pitch && (
          <div className="flex items-center gap-2">
            <button onClick={copyAll}
              className="btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
              {copied ? <Check size={13} className="text-[var(--success)]" /> : <Copy size={13} />}
              Copy All
            </button>
            <button onClick={exportTxt}
              className="btn-secondary px-3 py-2 text-sm flex items-center gap-1.5">
              <Download size={13} /> Export .txt
            </button>
          </div>
        )}
      </div>

      {/* Generate controls */}
      <div className="panel panel-accent rounded-xl p-5 space-y-4 fade-up-1">
        <div className="space-y-2">
          <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
            Custom Emphasis <span className="text-[var(--text-muted)] font-normal normal-case tracking-normal">optional</span>
          </label>
          <input
            value={emphasis}
            onChange={e => setEmphasis(e.target.value)}
            placeholder="e.g. Emphasize the AI innovation, highlight social impact…"
            className="input-base"
          />
        </div>
        <button onClick={handleGenerate} disabled={loading || (!isLead && !pitch)}
          className={cn('btn-primary w-full justify-center py-3',
            (!isLead && !pitch) ? 'opacity-40 cursor-not-allowed' : '')}>
          {loading
            ? <><Loader2 size={16} className="animate-spin" />Generating…</>
            : pitch
              ? <><RefreshCw size={15} />{isLead ? 'Regenerate with Emphasis' : 'Pitch Generated'}</>
              : <><Clipboard size={15} />Generate Pitch Outline</>}
        </button>
        {!isLead && !pitch && (
          <p className="text-xs text-[var(--text-muted)] text-center">Team lead generates the pitch</p>
        )}
      </div>

      {/* Sections */}
      {pitch && (
        <div className="space-y-3 fade-up-2">
          {pitch.sections.map((section, i) => {
            const isOpen = openSections.has(i);
            return (
              <div key={i} className={cn('panel rounded-xl overflow-hidden transition-all', isOpen && 'panel-accent')}>
                <button
                  onClick={() => toggleSection(i)}
                  className="w-full flex items-center justify-between px-5 py-4 hover:bg-[var(--bg-elevated)] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[var(--text-muted)] w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="font-bold text-[var(--text-primary)]">{section.title}</span>
                    {editedSections[i] !== undefined && (
                      <span className="text-[10px] text-violet-400 bg-[var(--accent-soft)] border border-[var(--border-accent)]
                        px-1.5 py-0.5 rounded font-medium">edited</span>
                    )}
                  </div>
                  {isOpen ? <ChevronUp size={16} className="text-[var(--text-muted)]" /> : <ChevronDown size={16} className="text-[var(--text-muted)]" />}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5">
                    <textarea
                      value={getSectionContent(i)}
                      onChange={e => handleEdit(i, e.target.value)}
                      rows={6}
                      className="input-base resize-none text-[var(--text-secondary)] text-sm leading-relaxed font-mono"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!pitch && !loading && (
        <div className="panel rounded-2xl p-16 text-center space-y-4 fade-up-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border)]
            flex items-center justify-center">
            <Clipboard size={24} className="text-[var(--text-muted)]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">No pitch yet</h3>
            <p className="text-[var(--text-muted)] text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {isLead
                ? 'Generate a 6-section 2-minute pitch outline powered by your plan data.'
                : 'Ask your team lead to generate the pitch outline.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
