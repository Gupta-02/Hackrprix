// Application types for HackPilot

export interface Session {
  id: string;
  joinCode: string;
  problemStatement: string;
  durationHours: number;
  agendaText?: string;
  createdAt: string;
  expiresAt: string;
  status: 'active' | 'expired';
}

export interface Member {
  id: string;
  sessionId: string;
  displayName: string;
  role: MemberRole;
  skills: string[];
  stackPreferences: string[];
  isLead: boolean;
  joinedAt: string;
  avatarColor: string;
}

export type MemberRole =
  | 'Frontend'
  | 'Backend'
  | 'Full-Stack'
  | 'ML/AI'
  | 'Design'
  | 'DevOps'
  | 'Product';

export interface PriorArtMatch {
  title: string;
  url: string;
  similarity: 'exact' | 'close';
  summary: string;
}

export interface PriorArt {
  checked: boolean;
  found: boolean;
  matches: PriorArtMatch[];
}

export interface RedirectSuggestion {
  show: boolean;
  message: string | null;
  url: string | null;
}

export interface TimeBudget {
  total_hours: number;
  working_hours: number;
  core_mvp_hours_cap: number;
  deadline_note: string | null;
}

export interface Task {
  id: string;
  planId: string;
  sessionId: string;
  title: string;
  description: string;
  tier: 'core_mvp' | 'nice_to_have' | 'stretch';
  assignedTo?: string;
  assignedToLabel: string;
  estimatedHours: number;
  dependsOn: string[];
  status: 'todo' | 'in-progress' | 'done' | 'blocked';
  updatedAt: string;
}

export interface Plan {
  id: string;
  sessionId: string;
  version: number;
  architectureDiagram: string;
  timeBudget: TimeBudget;
  priorArt: PriorArt;
  redirectSuggestion: RedirectSuggestion;
  notes: string | null;
  createdAt: string;
  tasks: Task[];
}

export interface PitchSection {
  title: string;
  content: string;
}

export interface Pitch {
  id: string;
  sessionId: string;
  sections: PitchSection[];
  createdAt: string;
}

export interface JudgeDimension {
  name: string;
  score: number;
  critique: string;
  recommendation: string;
}

export interface JudgeEvaluation {
  id: string;
  sessionId: string;
  demoability: JudgeDimension;
  technicalAmbition: JudgeDimension;
  impactClarity: JudgeDimension;
  overallScore: number;
  createdAt: string;
}

export interface AppState {
  session: Session | null;
  currentMember: Member | null;
  members: Member[];
  currentPlan: Plan | null;
  plans: Plan[];
  pitch: Pitch | null;
  judgeEvaluation: JudgeEvaluation | null;
  isGenerating: boolean;
  activeTab: 'architecture' | 'tasks' | 'health' | 'pitch' | 'judge';
}
