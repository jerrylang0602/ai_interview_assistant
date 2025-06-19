export interface InterviewQuestion {
  id: number;
  section: string;
  question: string;
  followUp?: string;
}

export interface QuestionAnswer {
  questionId: number;
  question: string;
  answer: string;
  score: number;
  level: 'Level 1' | 'Level 2' | 'Level 3';
  feedback: string;
  technicalAccuracy: number;
  problemSolving: number;
  communication: number;
  documentation: number;
  aiDetected: boolean;
}

export interface InterviewState {
  currentQuestionIndex: number;
  answers: QuestionAnswer[];
  isComplete: boolean;
  averageScore: number;
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3';
}

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 1,
    section: "Technical Competencies",
    question: "Describe your process for migrating an on-premises Exchange server to Exchange Online. What tools do you typically use for migration, and why?"
  },
  {
    id: 2,
    section: "Technical Competencies", 
    question: "Explain how you set up and manage Azure Active Directory (AAD). What key elements do you focus on during initial deployment?"
  },
  {
    id: 3,
    section: "Technical Competencies",
    question: "How do you deploy applications using Microsoft Intune? Provide a brief step-by-step scenario."
  },
  {
    id: 4,
    section: "Technical Competencies",
    question: "Detail the process for configuring Group Policy Objects (GPOs) to enforce security standards across multiple servers."
  },
  {
    id: 5,
    section: "Technical Competencies",
    question: "Explain your process for troubleshooting a performance issue in a virtualized Azure VM environment."
  },
  {
    id: 6,
    section: "Technical Competencies",
    question: "How do you typically secure an Office 365 environment against phishing attacks and unauthorized access?"
  },
  {
    id: 7,
    section: "Scenario-based Problem Solving",
    question: "A client reports intermittent connectivity issues with their Azure-based virtual machines. Outline your troubleshooting steps."
  },
  {
    id: 8,
    section: "Scenario-based Problem Solving", 
    question: "An Office 365 migration resulted in critical emails missing post-migration. Describe your immediate response and resolution approach."
  },
  {
    id: 9,
    section: "Behavioral & Soft Skills",
    question: "Describe a time when you collaborated on a challenging project. What was your role, and how did you ensure project success?"
  },
  {
    id: 10,
    section: "Behavioral & Soft Skills",
    question: "How do you approach creating and maintaining documentation for technical projects?"
  }
];
