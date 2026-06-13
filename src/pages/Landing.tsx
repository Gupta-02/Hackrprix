import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypingEffect } from '@/hooks/useTypingEffect';
import { ArrowRight, Zap, Users, Shield, BarChart3, ArrowUpRight, Cpu, Star } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import heroBg from '@/assets/hero-bg.jpg';

const TYPING_SENTENCES = [
  'Architecture diagram in 10 seconds.',
  'AI-assigned tasks for every team member.',
  'Real-time co-pilot throughout the event.',
  'Pitch outline with one click.',
  "Judge scoring before you present.",
];

const FEATURES = [
  {
    icon: Zap,
    title: 'Instant AI Planning',
    desc: 'Paste your problem statement. HackPilot generates a full architecture diagram, prior-art check, and MVP-tiered task board in under 10 seconds.',
    stat: '< 10s',
  },
  {
    icon: Users,
    title: 'Team-Aware Assignment',
    desc: 'Every member fills a 60-second skill profile. Tasks are automatically assigned to the right person based on role and expertise.',
    stat: '60s onboard',
  },
  {
    icon: Shield,
    title: 'Prior Art Detection',
    desc: 'Built-in web search scans for similar hackathon projects and GitHub repos so your team builds something genuinely novel.',
    stat: '3 searches',
  },
  {
    icon: BarChart3,
    title: 'Live Health Monitor',
    desc: 'Real-time dashboard tracks completion vs time elapsed. Flag a blocker and get an instant AI replan.',
    stat: 'Real-time',
  },
];

const STEPS = [
  { n: '01', title: 'Create a session', desc: 'Paste your problem statement, set duration. Get a 6-char join code instantly.' },
  { n: '02', title: 'Team joins & profiles', desc: 'Each member joins via code or QR scan and fills a 60-second skill profile.' },
  { n: '03', title: 'Agent generates plan', desc: 'HackPilot searches for prior art, then builds architecture + task board.' },
  { n: '04', title: 'Work the board', desc: 'Drag tasks, update status, flag blockers for instant AI replanning.' },
  { n: '05', title: 'Pitch & judge', desc: 'Generate a 2-minute pitch outline and get a judge-perspective score.' },
];

// Floating code particles
const PARTICLES = [
  'const plan = await agent.generate()',
  '{ tasks: [...mvp] }',
  'architecture.mermaid',
  'POST /api/generate-plan',
  'prior_art.found = false',
  'assigned_to: "Alex"',
  'status: "in-progress"',
  '2.5h estimated',
  'graph TD A-->B',
  'score: 84',
];

function FloatingParticles() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {PARTICLES.map((text, i) => (
        <span
          key={i}
          className="particle"
          style={{
            left: `${5 + (i * 9.2) % 88}%`,
            bottom: `${5 + (i * 13) % 40}%`,
            '--dur': `${8 + (i * 1.3) % 6}s`,
            '--delay': `${(i * 0.8) % 5}s`,
            opacity: 0,
          } as React.CSSProperties}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

// Stats counter
function StatBadge({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-black text-[var(--text-primary)]">{value}</p>
      <p className="text-xs text-[var(--text-muted)] mt-0.5">{label}</p>
    </div>
  );
}

export function Landing() {
  const navigate = useNavigate();
  const typed = useTypingEffect(TYPING_SENTENCES);
  const heroRef = useRef<HTMLDivElement>(null);

  // Spotlight effect on feature cards
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--y', `${e.clientY - rect.top}px`);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] overflow-x-hidden">
      {/* ── Background layers ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {/* Hero image */}
        <div className="absolute inset-0"
          style={{ backgroundImage: `url(${heroBg})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: 0.07 }} />
        {/* Grid */}
        <div className="absolute inset-0 grid-bg" />
        {/* Aurora orbs */}
        <div className="aurora-orb absolute w-[800px] h-[600px] rounded-full"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 65%)', top: '-20%', left: '-15%', opacity: 0.06 }} />
        <div className="aurora-orb-slow absolute w-[600px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, #4f46e5 0%, transparent 65%)', bottom: '-15%', right: '-10%', opacity: 0.05 }} />
      </div>

      {/* ── Nav ── */}
      <nav className="relative z-20 flex items-center justify-between px-6 py-4 max-w-6xl mx-auto border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-[var(--text-primary)] flex items-center justify-center">
            <Cpu size={14} className="text-[var(--bg)]" />
          </div>
          <span className="font-bold tracking-tight text-[var(--text-primary)]">HackPilot</span>
          <span className="hidden sm:inline-flex items-center gap-1 text-xs text-[var(--text-muted)] bg-[var(--bg-elevated)]
            border border-[var(--border)] px-2 py-0.5 rounded-full ml-1">
            <span className="w-1 h-1 rounded-full bg-[var(--success)] animate-pulse" />
            v2.0 · AI Agent
          </span>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button onClick={() => navigate('/join')}
            className="btn-secondary px-4 py-2 text-sm">
            Join Session
          </button>
          <button onClick={() => navigate('/setup')}
            className="btn-primary px-4 py-2 text-sm">
            Start Session
          </button>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} className="relative z-10 max-w-5xl mx-auto px-6 pt-24 pb-28 text-center">
        <FloatingParticles />

        {/* Badge */}
        <div className="hero-reveal inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-10
          border border-[var(--border-accent)] text-[var(--text-muted)] bg-[var(--accent-soft)]">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          AI-Powered Hackathon Orchestration Platform
        </div>

        {/* Headline */}
        <h1 className="hero-reveal-1 text-6xl md:text-8xl font-black tracking-tighter leading-none mb-6">
          From problem<br />
          <span className="gradient-text">to plan in 60s</span>
        </h1>

        {/* Typing sub */}
        <div className="hero-reveal-2 h-8 mb-10">
          <p className="text-lg text-[var(--text-muted)] typing-cursor font-mono">{typed}</p>
        </div>

        {/* CTAs */}
        <div className="hero-reveal-3 flex items-center justify-center gap-3 flex-wrap mb-12">
          <button onClick={() => navigate('/setup')}
            className="flex items-center gap-2 px-7 py-3.5 bg-[var(--text-primary)] text-[var(--bg)]
              font-bold rounded-xl text-base hover:opacity-90 transition-all shadow-2xl
              hover:-translate-y-0.5">
            Start a Session
            <ArrowRight size={18} />
          </button>
          <button onClick={() => navigate('/join')}
            className="flex items-center gap-2 px-7 py-3.5 font-bold rounded-xl text-base
              border border-[var(--border)] text-[var(--text-secondary)]
              hover:border-[var(--border-accent)] hover:text-[var(--text-primary)]
              hover:bg-[var(--accent-soft)] transition-all">
            Join with Code
          </button>
        </div>

        {/* Stats row */}
        <div className="hero-reveal-4 flex items-center justify-center gap-10 py-6
          border-t border-b border-[var(--border-subtle)]">
          <StatBadge value="< 10s" label="Plan generation" />
          <div className="w-px h-8 bg-[var(--border)]" />
          <StatBadge value="100%" label="Free to use" />
          <div className="w-px h-8 bg-[var(--border)]" />
          <StatBadge value="Claude AI" label="Powered by" />
          <div className="w-px h-8 bg-[var(--border)]" />
          <StatBadge value="QR Join" label="Instant onboard" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12 fade-up">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Core Capabilities</p>
          <h2 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">
            Everything your team needs.
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i}
              onMouseMove={handleMouseMove}
              className={`spotlight panel panel-hover rounded-2xl p-7 group fade-up-${i + 1}`}>
              <div className="flex items-start justify-between mb-5">
                <div className="w-9 h-9 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]
                  flex items-center justify-center">
                  <f.icon size={16} className="text-[var(--text-secondary)]" />
                </div>
                <span className="font-mono text-xs font-bold text-[var(--text-muted)] bg-[var(--bg-elevated)]
                  border border-[var(--border)] px-2 py-1 rounded-lg">
                  {f.stat}
                </span>
              </div>
              <h3 className="text-[var(--text-primary)] font-bold text-lg mb-2 tracking-tight">{f.title}</h3>
              <p className="text-[var(--text-muted)] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 pb-24">
        <div className="text-center mb-10 fade-up">
          <p className="text-xs text-[var(--text-muted)] uppercase tracking-widest mb-3">Workflow</p>
          <h2 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">Five steps to ship.</h2>
        </div>
        <div className="rounded-2xl border border-[var(--border)] overflow-hidden">
          {STEPS.map(({ n, title, desc }, i) => (
            <div key={n} className={`flex items-start gap-5 px-6 py-5 border-b border-[var(--border-subtle)]
              last:border-0 hover:bg-[var(--bg-elevated)] transition-colors fade-up-${i + 1}`}>
              <span className="font-mono text-sm font-bold text-[var(--text-disabled)] w-8 shrink-0 mt-0.5">{n}</span>
              <div className="flex-1">
                <p className="text-[var(--text-primary)] font-semibold tracking-tight">{title}</p>
                <p className="text-[var(--text-muted)] text-sm mt-0.5 leading-relaxed">{desc}</p>
              </div>
              <ArrowUpRight size={14} className="text-[var(--text-disabled)] mt-1 shrink-0" />
            </div>
          ))}
        </div>
      </section>

      {/* ── Showcase section (Judge scores) ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Demo-ability',      score: 88, color: '#ffffff',  icon: '⚡' },
            { label: 'Technical Ambition', score: 79, color: '#a78bfa',  icon: '🔬' },
            { label: 'Impact Clarity',    score: 92, color: '#4ade80',  icon: '🎯' },
          ].map((item, i) => (
            <div key={i} className={`panel panel-accent rounded-2xl p-6 text-center fade-up-${i + 1}`}>
              <p className="text-3xl mb-3">{item.icon}</p>
              <p className="text-4xl font-black mb-1" style={{ color: item.color }}>{item.score}</p>
              <p className="text-sm font-semibold text-[var(--text-primary)]">{item.label}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">Judge score</p>
              <div className="mt-4 h-1 bg-[var(--bg-elevated)] rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width: `${item.score}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 max-w-2xl mx-auto px-6 pb-24 text-center">
        <div className="panel panel-accent rounded-3xl p-12 space-y-6 spotlight" onMouseMove={handleMouseMove}>
          <div className="w-12 h-12 mx-auto rounded-2xl bg-violet-600 flex items-center justify-center">
            <Cpu size={20} className="text-white" />
          </div>
          <h2 className="text-3xl font-black tracking-tighter text-[var(--text-primary)]">
            Ready to hack smarter?
          </h2>
          <p className="text-[var(--text-muted)] text-sm">
            Start your session in 30 seconds. No sign-up, no credit card.
          </p>
          <div className="flex items-center justify-center gap-3">
            <button onClick={() => navigate('/setup')}
              className="btn-primary px-8 py-3.5 text-base">
              Start a Session <ArrowRight size={18} />
            </button>
          </div>
          <div className="flex items-center justify-center gap-6 pt-2">
            {['Architecture Diagrams', 'Task Assignment', 'Pitch Generator', 'Judge Lens'].map(f => (
              <span key={f} className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <Star size={10} className="text-violet-400 fill-violet-400" /> {f}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--border-subtle)] py-8 text-center">
        <p className="text-[var(--text-disabled)] text-xs">
          HackPilot · AI-Powered Hackathon Orchestration · Powered by Claude AI
        </p>
      </footer>
    </div>
  );
}
