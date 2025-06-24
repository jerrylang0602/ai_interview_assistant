
export interface InterviewQuestion {
  id: number;
  section: string;
  question: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
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
  copyPasteDetected?: boolean;
}

export interface InterviewState {
  currentQuestionIndex: number;
  answers: QuestionAnswer[];
  isComplete: boolean;
  averageScore: number;
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3';
}
