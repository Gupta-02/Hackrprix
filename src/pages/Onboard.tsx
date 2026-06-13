import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowRight, Loader2, Plus, X, Check, Crown, Users, Cpu, Copy, QrCode, Link } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getSession, findSessionByCode, getMembers, saveMembers,
  saveCurrentMember, generateId, generateAvatarColor
} from '@/lib/storage';
import { generateMockPlan, delay } from '@/lib/mockData';
import { savePlan } from '@/lib/storage';
import { Member, MemberRole, Session } from '@/types';
import { getInitials, cn } from '@/lib/utils';
import { ThemeToggle } from '@/components/ThemeToggle';
import { toast } from 'sonner';

const ROLES: MemberRole[] = ['Frontend', 'Backend', 'Full-Stack', 'ML/AI', 'Design', 'DevOps', 'Product'];
const SKILLS = ['React', 'TypeScript', 'Python', 'Node.js', 'PostgreSQL', 'TailwindCSS', 'LangChain',
  'Docker', 'Figma', 'FastAPI', 'Next.js', 'Supabase', 'OpenAI API', 'Redis', 'GraphQL'];
const STACKS = ['React + Vite', 'Next.js', 'FastAPI', 'Supabase', 'PostgreSQL', 'Vercel', 'AWS', 'Firebase', 'LangChain', 'OpenAI'];

export function Onboard() {
  const navigate = useNavigate();
  const { joinCode } = useParams<{ joinCode: string }>();
  const [searchParams] = useSearchParams();
  const isLead = searchParams.get('lead') === 'true';

  const [session, setSession] = useState<Session | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [name, setName] = useState('');
  const [role, setRole] = useState<MemberRole>('Frontend');
  const [skillInput, setSkillInput] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [stackInput, setStackInput] = useState('');
  const [stacks, setStacks] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [joined, setJoined] = useState(false);
  const [currentMemberId, setCurrentMemberId] = useState<string | null>(null);
  const [codeCopied, setCodeCopied] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const joinUrl = `${window.location.origin}/session/${joinCode}/onboard`;

  useEffect(() => {
    const s = findSessionByCode(joinCode ?? '');
    if (!s) { navigate('/join'); return; }
    setSession(s);
    setMembers(getMembers());
  }, [joinCode]);

  const addTag = (val: string, list: string[], setList: (v: string[]) => void, setInput: (v: string) => void) => {
    const t = val.trim();
    if (t && !list.includes(t)) setList([...list, t]);
    setInput('');
  };
  const removeTag = (val: string, list: string[], setList: (v: string[]) => void) =>
    setList(list.filter(t => t !== val));

  const copyCode = () => {
    navigator.clipboard.writeText(joinCode ?? '');
    setCodeCopied(true);
    toast.success('Code copied!');
    setTimeout(() => setCodeCopied(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(joinUrl);
    setLinkCopied(true);
    toast.success('Join link copied!');
    setTimeout(() => setLinkCopied(false), 2000);
  };

  const handleJoin = async () => {
    if (!name.trim() || !session) return;
    setSubmitting(true);
    const member: Member = {
      id: generateId(),
      sessionId: session.id,
      displayName: name.trim(),
      role,
      skills,
      stackPreferences: stacks,
      isLead,
      joinedAt: new Date().toISOString(),
      avatarColor: generateAvatarColor(),
    };
    const updated = [...getMembers(), member];
    saveMembers(updated);
    saveCurrentMember(member);
    setMembers(updated);
    setCurrentMemberId(member.id);
    setJoined(true);
    setSubmitting(false);
    toast.success(`Welcome, ${member.displayName}!`);
  };

  const handleGenerate = async () => {
    if (!session) return;
    setGenerating(true);
    await delay(2400);
    const plan = generateMockPlan(session, getMembers());
    savePlan(plan);
    toast.success('Plan generated!');
    navigate(`/session/${joinCode}/plan`);
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-[var(--bg)] relative px-4 py-12">
      <div className="fixed inset-0 grid-bg pointer-events-none opacity-60" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="aurora-orb absolute w-[500px] h-[400px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', top: '0%', right: '-5%', opacity: 0.06 }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] flex items-center justify-center">
              <Cpu size={13} className="text-[var(--bg)]" />
            </div>
            <span className="text-[var(--text-primary)] font-bold">HackPilot</span>
          </div>
          <ThemeToggle />
        </div>

        <div className="text-center mb-10">
          <h1 className="text-4xl font-black tracking-tighter text-[var(--text-primary)] mb-3">
            Team Onboarding
          </h1>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button onClick={copyCode}
              className="flex items-center gap-2 font-mono text-sm bg-[var(--bg-elevated)] border border-[var(--border-accent)]
                text-violet-400 px-3 py-1.5 rounded-lg hover:bg-[var(--accent-soft)] transition-all">
              {joinCode}
              {codeCopied ? <Check size={12} className="text-[var(--success)]" /> : <Copy size={12} />}
            </button>
            <span className="text-[var(--text-muted)] text-sm">{session.durationHours}h hackathon</span>
            <button onClick={() => setShowQR(s => !s)}
              className={cn('flex items-center gap-1.5 text-xs border px-2.5 py-1.5 rounded-lg transition-all',
                showQR
                  ? 'bg-[var(--accent-soft)] border-[var(--border-accent)] text-violet-400'
                  : 'text-[var(--text-muted)] border-[var(--border)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]')}>
              <QrCode size={11} />
              QR Code
            </button>
            <button onClick={copyLink}
              className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] border border-[var(--border)]
                hover:border-[var(--border-accent)] hover:text-[var(--text-primary)] px-2.5 py-1.5 rounded-lg transition-all">
              {linkCopied ? <Check size={11} className="text-[var(--success)]" /> : <Link size={11} />}
              {linkCopied ? 'Copied!' : 'Copy link'}
            </button>
          </div>
        </div>

        {/* QR Code panel */}
        {showQR && (
          <div className="mb-6 scale-in">
            <div className="panel panel-accent rounded-2xl p-6 max-w-sm mx-auto text-center space-y-4">
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">Scan to Join Session</p>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">Team members scan this to instantly join</p>
              </div>
              <div className="flex justify-center">
                <div className="qr-container">
                  <QRCodeSVG
                    value={joinUrl}
                    size={160}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                    includeMargin={false}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[var(--text-muted)] font-mono break-all bg-[var(--bg-elevated)]
                  border border-[var(--border)] rounded-lg px-3 py-2">
                  {joinUrl}
                </p>
                <button onClick={copyLink}
                  className={cn('w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all',
                    linkCopied
                      ? 'bg-[var(--success)]/10 border border-[var(--success)]/30 text-[var(--success)]'
                      : 'bg-[var(--text-primary)] text-[var(--bg)] hover:opacity-90')}>
                  {linkCopied
                    ? <><Check size={14} /> Link Copied!</>
                    : <><Link size={14} /> Copy Join Link</>}
                </button>
              </div>
              <p className="text-[10px] text-[var(--text-disabled)]">
                Code: <span className="font-mono text-violet-400">{joinCode}</span> · expires in 24h
              </p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Profile form */}
          <div className="lg:col-span-3">
            <div className="panel panel-accent rounded-2xl p-7 space-y-6">
              {isLead && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-500/5 border border-amber-500/15">
                  <Crown size={13} className="text-amber-400" />
                  <span className="text-xs text-amber-300 font-medium">You are the team lead</span>
                </div>
              )}

              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">
                  {joined ? 'Profile Submitted ✓' : 'Your Profile'}
                </h2>
                <p className="text-[var(--text-muted)] text-xs mt-0.5">Takes about 60 seconds</p>
              </div>

              {!joined ? (
                <div className="space-y-5">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                      Display Name
                    </label>
                    <input value={name} onChange={e => setName(e.target.value)}
                      placeholder="How teammates will see you"
                      className="input-base" />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                      Primary Role
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {ROLES.map(r => (
                        <button key={r} onClick={() => setRole(r)}
                          className={cn('px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                            role === r
                              ? 'bg-[var(--text-primary)] text-[var(--bg)]'
                              : 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]')}>
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skills */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                      Skills
                    </label>
                    {skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map(s => (
                          <span key={s} className="flex items-center gap-1 text-xs bg-[var(--bg-elevated)]
                            text-[var(--text-secondary)] px-2 py-1 rounded-full border border-[var(--border)]">
                            {s}
                            <button onClick={() => removeTag(s, skills, setSkills)} className="hover:text-[var(--danger)] transition-colors">
                              <X size={9} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input value={skillInput} onChange={e => setSkillInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag(skillInput, skills, setSkills, setSkillInput)}
                        placeholder="Type a skill + Enter"
                        className="input-base flex-1" />
                      <button onClick={() => addTag(skillInput, skills, setSkills, setSkillInput)}
                        className="px-3 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)]
                          rounded-xl text-[var(--text-muted)] transition-all">
                        <Plus size={15} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SKILLS.filter(s => !skills.includes(s)).slice(0, 8).map(s => (
                        <button key={s} onClick={() => setSkills(p => [...p, s])}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg
                            bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)] transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Stack */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wider block">
                      Stack Preferences
                    </label>
                    {stacks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {stacks.map(s => (
                          <span key={s} className="flex items-center gap-1 text-xs bg-[var(--bg-elevated)]
                            text-[var(--text-secondary)] px-2 py-1 rounded-full border border-[var(--border)]">
                            {s}
                            <button onClick={() => removeTag(s, stacks, setStacks)} className="hover:text-[var(--danger)] transition-colors">
                              <X size={9} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <input value={stackInput} onChange={e => setStackInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && addTag(stackInput, stacks, setStacks, setStackInput)}
                        placeholder="e.g. React + Supabase"
                        className="input-base flex-1" />
                      <button onClick={() => addTag(stackInput, stacks, setStacks, setStackInput)}
                        className="px-3 bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)]
                          rounded-xl text-[var(--text-muted)] transition-all">
                        <Plus size={15} />
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {STACKS.filter(s => !stacks.includes(s)).slice(0, 6).map(s => (
                        <button key={s} onClick={() => setStacks(p => [...p, s])}
                          className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] px-2 py-1 rounded-lg
                            bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-accent)] transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button onClick={handleJoin} disabled={!name.trim() || submitting}
                    className="btn-primary w-full justify-center py-3.5">
                    {submitting
                      ? <><Loader2 size={15} className="animate-spin" />Joining...</>
                      : <>Submit Profile <ArrowRight size={15} /></>}
                  </button>
                </div>
              ) : (
                <div className="text-center py-8 space-y-5">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[var(--success)]/10 border border-[var(--success)]/20
                    flex items-center justify-center">
                    <Check size={20} className="text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-[var(--text-primary)] font-bold text-lg">{name}</p>
                    <p className="text-[var(--text-muted)] text-sm">{role} · {skills.join(', ') || 'No skills listed'}</p>
                  </div>
                  {isLead && (
                    <div className="pt-4 space-y-3">
                      <p className="text-[var(--text-muted)] text-sm">
                        {members.length === 1 ? 'Ready to generate solo or wait for teammates.' : `${members.length} members ready.`}
                      </p>
                      <button onClick={handleGenerate} disabled={generating}
                        className={cn('flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm transition-all mx-auto',
                          generating
                            ? 'bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] cursor-not-allowed'
                            : 'btn-primary')}>
                        {generating
                          ? <><Loader2 size={16} className="animate-spin" />HackPilot is thinking...</>
                          : <>Generate Plan <ArrowRight size={16} /></>}
                      </button>
                      {generating && (
                        <div className="flex items-center gap-1.5 justify-center mt-2">
                          {[0, 1, 2].map(i => (
                            <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-bounce"
                              style={{ animationDelay: `${i * 0.15}s` }} />
                          ))}
                          <span className="text-xs text-[var(--text-muted)] ml-1 font-mono">Searching prior art…</span>
                        </div>
                      )}
                    </div>
                  )}
                  {!isLead && (
                    <p className="text-[var(--text-muted)] text-sm">Waiting for the team lead to generate the plan…</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Right column */}
          <div className="lg:col-span-2 space-y-4">
            {/* Team list */}
            <div className="panel rounded-2xl p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Users size={14} className="text-[var(--text-muted)]" />
                <span className="text-[var(--text-primary)] font-semibold text-sm">Team ({members.length})</span>
              </div>

              {members.length === 0 ? (
                <div className="py-6 text-center">
                  <div className="flex justify-center gap-1.5 mb-3">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--border)] animate-pulse"
                        style={{ animationDelay: `${i * 0.3}s` }} />
                    ))}
                  </div>
                  <p className="text-[var(--text-muted)] text-xs">Waiting for members…</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {members.map(m => (
                    <div key={m.id}
                      className={cn('flex items-start gap-3 p-3 rounded-xl transition-all',
                        m.id === currentMemberId
                          ? 'bg-[var(--accent-soft)] border border-[var(--border-accent)]'
                          : 'border border-transparent hover:bg-[var(--bg-elevated)]')}>
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                        style={{ background: m.avatarColor }}>
                        {getInitials(m.displayName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="text-sm font-medium text-[var(--text-primary)] truncate">{m.displayName}</p>
                          {m.isLead && <Crown size={11} className="text-amber-400 shrink-0" />}
                        </div>
                        <p className="text-xs text-[var(--text-muted)]">{m.role}</p>
                        {m.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {m.skills.slice(0, 3).map(s => (
                              <span key={s} className="tag">{s}</span>
                            ))}
                            {m.skills.length > 3 && (
                              <span className="text-xs text-[var(--text-muted)]">+{m.skills.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Problem preview */}
            <div className="panel rounded-xl p-4">
              <p className="text-xs text-[var(--text-muted)] uppercase tracking-wider mb-2">Problem Statement</p>
              <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-5">
                {session.problemStatement}
              </p>
            </div>

            {/* QR mini card */}
            <div className="panel rounded-xl p-4 text-center">
              <p className="text-xs text-[var(--text-muted)] mb-3">Quick Share</p>
              <div className="flex justify-center mb-3">
                <div className="qr-container">
                  <QRCodeSVG
                    value={joinUrl}
                    size={80}
                    bgColor="#ffffff"
                    fgColor="#000000"
                    level="M"
                  />
                </div>
              </div>
              <p className="text-[10px] text-[var(--text-muted)] font-mono">{joinCode}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
