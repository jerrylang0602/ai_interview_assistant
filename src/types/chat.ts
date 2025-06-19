
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  questionId?: number;
}

export interface ChatHistory {
  messages: Message[];
}
