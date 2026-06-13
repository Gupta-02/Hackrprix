import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getSession, findSessionByCode, getCurrentMember, getMembers,
  getLatestPlan, savePlan, updateTaskInStorage, getPitch, savePitch,
  getJudgeEvaluation, saveJudgeEvaluation, generateId
} from '@/lib/storage';
import { generateMockPlan, generateMockPitch, generateMockJudgeEval, delay } from '@/lib/mockData';
import { Session, Member, Plan, Task } from '@/types';
import { Sidebar } from '@/components/layout/Sidebar';
import { ArchitectureTab } from '@/components/features/ArchitectureTab';
import { TaskBoard } from '@/components/features/TaskBoard';
import { HealthDashboard } from '@/components/features/HealthDashboard';
import { PitchTab } from '@/components/features/PitchTab';
import { JudgeLens } from '@/components/features/JudgeLens';
import { BlockerModal } from '@/components/features/BlockerModal';
import { SkeletonPlan } from '@/components/ui/SkeletonLoader';
import { toast } from 'sonner';

export function PlanPage() {
  const { joinCode } = useParams<{ joinCode: string }>();
  const navigate = useNavigate();

  const [session, setSession] = useState<Session | null>(null);
  const [member, setMember] = useState<Member | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [plan, setPlan] = useState<Plan | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('architecture');
  const [showBlocker, setShowBlocker] = useState(false);
  const [regenerationsLeft, setRegenerationsLeft] = useState(3);
  const [pitch, setPitch] = useState(getPitch());
  const [judgeEval, setJudgeEval] = useState(getJudgeEvaluation());

  useEffect(() => {
    const s = findSessionByCode(joinCode ?? '');
    if (!s) { navigate('/'); return; }
    setSession(s);
    setMember(getCurrentMember());
    setMembers(getMembers());
    const p = getLatestPlan(s.id);
    if (p) {
      setPlan(p); setLoading(false);
    } else {
      const ms = getMembers();
      delay(1800).then(() => {
        const newPlan = generateMockPlan(s, ms);
        savePlan(newPlan);
        setPlan(newPlan);
        setLoading(false);
      });
    }
  }, [joinCode]);

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    updateTaskInStorage(taskId, updates);
    if (!plan) return;
    setPlan({
      ...plan,
      tasks: plan.tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t),
    });
  };

  const handleRegenerate = async (feedback: string) => {
    if (!session || !plan || regenerationsLeft <= 0) return;
    setRegenerationsLeft(r => r - 1);
    await delay(1800);
    const newDiagram = plan.architectureDiagram + (feedback ? `\n    %% Note: ${feedback.slice(0, 40)}` : '');
    const newPlan = { ...plan, architectureDiagram: newDiagram };
    savePlan(newPlan);
    setPlan(newPlan);
    toast.success('Architecture regenerated');
  };

  const handleReplan = async (description: string) => {
    if (!session || !plan) return;
    await delay(2200);
    const newPlan = generateMockPlan(session, getMembers());
    const replanPlan = {
      ...newPlan,
      version: plan.version + 1,
      notes: `Replan triggered: ${description.slice(0, 100)}. Based on v${plan.version}.`,
    };
    savePlan(replanPlan);
    setPlan(replanPlan);
    toast.success(`Replanned! Now on v${replanPlan.version}`);
  };

  const handleGeneratePitch = async () => {
    if (!session || !plan) return;
    await delay(2000);
    const newPitch = generateMockPitch(session, plan);
    savePitch(newPitch);
    setPitch(newPitch);
    toast.success('Pitch outline generated!');
  };

  const handleJudgeEval = async () => {
    if (!session || !plan) return;
    await delay(2500);
    const evaluation = generateMockJudgeEval(session, plan);
    saveJudgeEvaluation(evaluation);
    setJudgeEval(evaluation);
    toast.success('Judge evaluation complete');
  };

  const hoursRemaining = session
    ? Math.max(0, session.durationHours - (Date.now() - new Date(session.createdAt).getTime()) / 3600000)
    : 0;

  if (loading || !session || !plan) {
    return (
      <div className="min-h-screen bg-[var(--bg)] flex">
        <div className="w-[260px] shrink-0 bg-[var(--bg-surface)] border-r border-[var(--border)]" />
        <div className="flex-1"><SkeletonPlan /></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] flex">
      <Sidebar
        session={session}
        members={members}
        currentMember={member}
        plan={plan}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFlagBlocker={() => setShowBlocker(true)}
      />
      <main className="flex-1 ml-[260px] min-h-screen overflow-y-auto">
        {activeTab === 'architecture' && (
          <ArchitectureTab plan={plan} onRegenerate={handleRegenerate} regenerationsLeft={regenerationsLeft} />
        )}
        {activeTab === 'tasks' && (
          <TaskBoard plan={plan} members={members} onUpdateTask={handleUpdateTask} />
        )}
        {activeTab === 'health' && (
          <HealthDashboard plan={plan} members={members} session={session} />
        )}
        {activeTab === 'pitch' && (
          <PitchTab pitch={pitch} plan={plan} members={members} isLead={member?.isLead ?? false} onGenerate={handleGeneratePitch} />
        )}
        {activeTab === 'judge' && (
          <JudgeLens evaluation={judgeEval} plan={plan} session={session} onEvaluate={handleJudgeEval} />
        )}
      </main>
      {showBlocker && (
        <BlockerModal onClose={() => setShowBlocker(false)} onReplan={handleReplan} hoursRemaining={hoursRemaining} />
      )}
    </div>
  );
}
