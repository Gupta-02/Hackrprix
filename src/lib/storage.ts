import { Session, Member, Plan, Task, Pitch, JudgeEvaluation } from '@/types';

const STORAGE_KEYS = {
  SESSION: 'hackpilot_session',
  MEMBER: 'hackpilot_member',
  MEMBERS: 'hackpilot_members',
  PLANS: 'hackpilot_plans',
  PITCH: 'hackpilot_pitch',
  JUDGE: 'hackpilot_judge',
};

export function generateJoinCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
}

export function generateAvatarColor(): string {
  const colors = [
    '#7c3aed', '#6366f1', '#ec4899', '#f59e0b', '#10b981',
    '#3b82f6', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Session storage
export function saveSession(session: Session): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function getSession(): Session | null {
  const data = localStorage.getItem(STORAGE_KEYS.SESSION);
  return data ? JSON.parse(data) : null;
}

export function saveCurrentMember(member: Member): void {
  localStorage.setItem(STORAGE_KEYS.MEMBER, JSON.stringify(member));
}

export function getCurrentMember(): Member | null {
  const data = localStorage.getItem(STORAGE_KEYS.MEMBER);
  return data ? JSON.parse(data) : null;
}

export function saveMembers(members: Member[]): void {
  localStorage.setItem(STORAGE_KEYS.MEMBERS, JSON.stringify(members));
}

export function getMembers(): Member[] {
  const data = localStorage.getItem(STORAGE_KEYS.MEMBERS);
  return data ? JSON.parse(data) : [];
}

export function savePlan(plan: Plan): void {
  const plans = getPlans();
  const existing = plans.findIndex(p => p.id === plan.id);
  if (existing >= 0) {
    plans[existing] = plan;
  } else {
    plans.push(plan);
  }
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
}

export function getPlans(): Plan[] {
  const data = localStorage.getItem(STORAGE_KEYS.PLANS);
  return data ? JSON.parse(data) : [];
}

export function getLatestPlan(sessionId: string): Plan | null {
  const plans = getPlans().filter(p => p.sessionId === sessionId);
  if (!plans.length) return null;
  return plans.sort((a, b) => b.version - a.version)[0];
}

export function updateTaskInStorage(taskId: string, updates: Partial<Task>): Task | null {
  const plans = getPlans();
  let updatedTask: Task | null = null;
  
  for (const plan of plans) {
    const taskIndex = plan.tasks.findIndex(t => t.id === taskId);
    if (taskIndex >= 0) {
      plan.tasks[taskIndex] = { ...plan.tasks[taskIndex], ...updates, updatedAt: new Date().toISOString() };
      updatedTask = plan.tasks[taskIndex];
      break;
    }
  }
  
  localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(plans));
  return updatedTask;
}

export function savePitch(pitch: Pitch): void {
  localStorage.setItem(STORAGE_KEYS.PITCH, JSON.stringify(pitch));
}

export function getPitch(): Pitch | null {
  const data = localStorage.getItem(STORAGE_KEYS.PITCH);
  return data ? JSON.parse(data) : null;
}

export function saveJudgeEvaluation(evaluation: JudgeEvaluation): void {
  localStorage.setItem(STORAGE_KEYS.JUDGE, JSON.stringify(evaluation));
}

export function getJudgeEvaluation(): JudgeEvaluation | null {
  const data = localStorage.getItem(STORAGE_KEYS.JUDGE);
  return data ? JSON.parse(data) : null;
}

export function clearAllStorage(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
}

// Find session by join code
export function findSessionByCode(code: string): Session | null {
  const session = getSession();
  if (session && session.joinCode === code.toUpperCase()) return session;
  return null;
}
