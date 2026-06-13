import { Plan, Task, Member, Session, Pitch, JudgeEvaluation } from '@/types';
import { generateId } from './storage';

// Mock plan generation - creates a realistic-looking plan based on the problem statement
export function generateMockPlan(
  session: Session,
  members: Member[]
): Plan {
  const memberNames = members.length > 0 
    ? members.map(m => m.displayName)
    : ['Frontend', 'Backend', 'AI/Prompting', 'Design/Demo'];

  const getAssignee = (index: number) => memberNames[index % memberNames.length];

  const workingHours = session.durationHours * 0.85;
  const mvpCap = Math.round(workingHours * 0.6 * 10) / 10;

  const planId = generateId();

  const coreTasks: Task[] = [
    {
      id: 't1',
      planId,
      sessionId: session.id,
      title: 'Project scaffolding & repo setup',
      description: 'Initialize repo, set up CI/CD, configure dev environment and folder structure.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(0),
      estimatedHours: 0.5,
      dependsOn: [],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't2',
      planId,
      sessionId: session.id,
      title: 'Core data models & API schema',
      description: 'Define database schema, API contracts, and TypeScript interfaces for all entities.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(1),
      estimatedHours: 1,
      dependsOn: ['t1'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't3',
      planId,
      sessionId: session.id,
      title: 'Authentication flow',
      description: 'Implement user sign-up, sign-in, and session management with JWT tokens.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(1),
      estimatedHours: 1.5,
      dependsOn: ['t2'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't4',
      planId,
      sessionId: session.id,
      title: 'Primary UI layout & navigation',
      description: 'Build responsive shell, navigation sidebar, and page routing structure.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(0),
      estimatedHours: 1.5,
      dependsOn: ['t1'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't5',
      planId,
      sessionId: session.id,
      title: 'Core feature: main input form',
      description: 'Build primary data-entry form with validation, error handling, and submission flow.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(0),
      estimatedHours: 2,
      dependsOn: ['t4', 't2'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't6',
      planId,
      sessionId: session.id,
      title: 'Core API endpoints (CRUD)',
      description: 'Implement POST, GET, PATCH, DELETE endpoints with input validation and error responses.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(1),
      estimatedHours: 2,
      dependsOn: ['t3', 't2'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't7',
      planId,
      sessionId: session.id,
      title: 'Results / output display view',
      description: 'Build the primary results screen showing processed data with clear visual hierarchy.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(0),
      estimatedHours: 1.5,
      dependsOn: ['t5', 't6'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't8',
      planId,
      sessionId: session.id,
      title: 'End-to-end integration & smoke test',
      description: 'Connect all layers, run manual end-to-end test, fix blocking integration bugs.',
      tier: 'core_mvp',
      assignedToLabel: getAssignee(2),
      estimatedHours: 1,
      dependsOn: ['t7'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
  ];

  const niceTasks: Task[] = [
    {
      id: 't9',
      planId,
      sessionId: session.id,
      title: 'Real-time updates via WebSockets',
      description: 'Add live data sync so multiple users see changes instantly without refresh.',
      tier: 'nice_to_have',
      assignedToLabel: getAssignee(1),
      estimatedHours: 2,
      dependsOn: ['t6'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't10',
      planId,
      sessionId: session.id,
      title: 'Data visualizations / charts',
      description: 'Add interactive charts to dashboard showing key metrics and trends.',
      tier: 'nice_to_have',
      assignedToLabel: getAssignee(0),
      estimatedHours: 1.5,
      dependsOn: ['t7'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't11',
      planId,
      sessionId: session.id,
      title: 'Email / notification system',
      description: 'Send email alerts on key events using a transactional email service.',
      tier: 'nice_to_have',
      assignedToLabel: getAssignee(1),
      estimatedHours: 1.5,
      dependsOn: ['t3'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't12',
      planId,
      sessionId: session.id,
      title: 'Mobile-responsive polish',
      description: 'Ensure all views work cleanly on mobile viewports with touch-friendly interactions.',
      tier: 'nice_to_have',
      assignedToLabel: getAssignee(0),
      estimatedHours: 1,
      dependsOn: ['t7'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
  ];

  const stretchTasks: Task[] = [
    {
      id: 't13',
      planId,
      sessionId: session.id,
      title: 'AI-powered recommendations',
      description: 'Integrate LLM to suggest personalized recommendations based on user behavior.',
      tier: 'stretch',
      assignedToLabel: getAssignee(2),
      estimatedHours: 3,
      dependsOn: ['t6'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't14',
      planId,
      sessionId: session.id,
      title: 'Export & sharing features',
      description: 'Allow users to export data as PDF/CSV and share via unique link.',
      tier: 'stretch',
      assignedToLabel: getAssignee(0),
      estimatedHours: 2,
      dependsOn: ['t7'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
    {
      id: 't15',
      planId,
      sessionId: session.id,
      title: 'Admin dashboard',
      description: 'Build admin panel for monitoring usage, managing users, and reviewing analytics.',
      tier: 'stretch',
      assignedToLabel: getAssignee(1),
      estimatedHours: 3,
      dependsOn: ['t3'],
      status: 'todo',
      updatedAt: new Date().toISOString(),
    },
  ];

  const diagram = [
    'graph TD',
    'A[User Browser] --> B[React Frontend]',
    'B --> C[API Gateway]',
    'C --> D[Auth Service]',
    'C --> E[Core API]',
    'E --> F[(PostgreSQL DB)]',
    'E --> G[File Storage]',
    'C --> H[AI Service]',
    'H --> I[External AI API]',
  ].join('\n');

  return {
    id: planId,
    sessionId: session.id,
    version: 1,
    architectureDiagram: diagram,
    timeBudget: {
      total_hours: session.durationHours,
      working_hours: Math.round(workingHours * 10) / 10,
      core_mvp_hours_cap: mvpCap,
      deadline_note: `Submit by end of hour ${session.durationHours}. Core MVP must be demoed within first ${Math.round(session.durationHours * 0.7)}h.`,
    },
    priorArt: {
      checked: true,
      found: false,
      matches: [],
    },
    redirectSuggestion: {
      show: false,
      message: null,
      url: null,
    },
    notes: 'Focus on core MVP first. Do not start nice-to-have tasks until all core_mvp tasks are in-progress or done.',
    createdAt: new Date().toISOString(),
    tasks: [...coreTasks, ...niceTasks, ...stretchTasks],
  };
}

export function generateMockPitch(session: Session, plan: Plan): Pitch {
  return {
    id: generateId(),
    sessionId: session.id,
    sections: [
      {
        title: 'Problem',
        content: `${session.problemStatement.slice(0, 200)}${session.problemStatement.length > 200 ? '...' : ''}\n\nThis represents a significant gap in existing solutions, affecting millions of users who currently have no streamlined way to address this challenge.`,
      },
      {
        title: 'Solution',
        content: `We built a platform that directly tackles this problem through an intuitive interface and intelligent automation. Our solution eliminates friction and reduces time-to-value from hours to seconds.\n\nKey differentiators:\n- AI-powered automation\n- Real-time collaboration\n- Seamless integration with existing workflows`,
      },
      {
        title: 'Architecture',
        content: `Our technical stack is purpose-built for scale and reliability:\n\n- Frontend: React with TypeScript for type-safe, performant UI\n- Backend: RESTful API with PostgreSQL for structured data\n- AI Layer: LLM integration for intelligent recommendations\n- Deployment: Cloud-native with auto-scaling\n\nThe architecture separates concerns cleanly - UI, logic, and data layers are independently deployable.`,
      },
      {
        title: 'Demo Flow',
        content: `Live demo walkthrough (2 minutes):\n\n1. User lands on homepage - clear value proposition in 5 seconds\n2. Onboarding: complete setup in under 60 seconds\n3. Core feature: show the primary workflow end-to-end\n4. Results: demonstrate clear, actionable output\n5. Highlight: show the AI-powered recommendation in action`,
      },
      {
        title: 'Impact',
        content: `Target users: teams facing this exact problem daily.\n\nMeasurable impact:\n- Reduce manual effort by ~80%\n- Cut time-to-insight from hours to seconds\n- Enable teams to focus on high-value work\n\nScalability: architecture supports 10,000+ concurrent users without modification.`,
      },
      {
        title: 'The Ask',
        content: `We are looking for:\n\n- Mentorship from domain experts to refine the AI model\n- Connections to early adopters for beta testing\n- Feedback on our go-to-market approach\n\nPost-hackathon roadmap: 3-month beta, public launch, enterprise tier within 6 months.`,
      },
    ],
    createdAt: new Date().toISOString(),
  };
}

export function generateMockJudgeEval(session: Session, plan: Plan): JudgeEvaluation {
  const demoScore = 72 + Math.floor(Math.random() * 20);
  const techScore = 65 + Math.floor(Math.random() * 25);
  const impactScore = 68 + Math.floor(Math.random() * 22);
  const overall = Math.round((demoScore + techScore + impactScore) / 3);

  return {
    id: generateId(),
    sessionId: session.id,
    demoability: {
      name: 'Demo-ability',
      score: demoScore,
      critique: 'The core user flow is clearly achievable within the hackathon timeframe. The task breakdown shows a realistic path to a working demo. Main risk: integration tasks are back-loaded - ensure end-to-end connectivity is validated early.',
      recommendation: 'Build a vertical slice (single complete user journey) by the halfway mark. This ensures you always have something demo-able, even if features are incomplete.',
    },
    technicalAmbition: {
      name: 'Technical Ambition',
      score: techScore,
      critique: 'The architecture is solid and appropriate for the problem. The AI integration adds meaningful differentiation. However, the real-time sync feature in nice-to-have is technically complex - deprioritize it if time is tight.',
      recommendation: 'Invest in the AI/LLM integration as your key technical differentiator. Even a basic working integration is more impressive than a polished non-AI feature.',
    },
    impactClarity: {
      name: 'Impact Clarity',
      score: impactScore,
      critique: 'The problem statement is clear and the solution addresses it directly. The impact metrics need to be more concrete - judges want to see numbers and specific user scenarios, not general statements.',
      recommendation: 'Prepare 2-3 specific user stories with concrete before/after metrics. "Reduces X from 4 hours to 2 minutes" is far more compelling than "saves time".',
    },
    overallScore: overall,
    createdAt: new Date().toISOString(),
  };
}

// Simulate API delay
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
