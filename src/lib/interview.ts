
import { sendMessage } from './openai';
import { Message } from '../types/chat';
import { QuestionAnswer, InterviewQuestion } from '../types/interview';

export const evaluateAnswer = async (
  questionId: number, 
  answer: string, 
  question?: InterviewQuestion
): Promise<QuestionAnswer> => {
  // Use the actual question text if provided, otherwise fall back to placeholder
  const questionText = question?.question || `Question ${questionId}`;

  const evaluationPrompt = `
You are an expert technical interviewer evaluating MSP technician candidates for Level 1, Level 2, and Level 3 positions.

FIRST, analyze if this response appears to be AI-generated. Look for these indicators:
- Overly structured or perfect formatting
- Generic phrases like "I would recommend" or "best practices include"
- Unnaturally comprehensive coverage of topics
- Lack of personal experience or specific examples
- Perfect technical accuracy without real-world nuances

Question: ${questionText}
Candidate Answer: ${answer}

Evaluate this answer based on these specific metrics using a 1-100 point scale:

1. Technical Accuracy (1-25 points): Clarity, completeness, and technical correctness of the response
2. Problem-Solving Methodology (1-25 points): Structured and logical approaches to troubleshooting and solutions
3. Professional Communication (1-25 points): Clarity, effectiveness, and appropriateness of communication
4. Documentation & Process Orientation (1-25 points): Methodical approaches and quality in maintaining technical documentation

IMPORTANT: If the response appears to be AI-generated, automatically assign a score of 0 and flag as "AI_DETECTED".

Provide your response in this exact JSON format:
{
  "score": [total score out of 100],
  "technicalAccuracy": [score out of 25],
  "problemSolving": [score out of 25], 
  "communication": [score out of 25],
  "documentation": [score out of 25],
  "aiDetected": [true/false],
  "feedback": "[brief constructive feedback explaining the score and any AI detection]"
}

Score Guidelines:
- 80-100: Advanced expertise, comprehensive understanding, proactive approaches
- 40-79: Solid foundational knowledge, standard procedures, some guidance needed
- 1-39: Basic understanding, significant gaps, requires substantial training
- 0: AI-generated response detected or completely inadequate response
`;

  try {
    const messages: Message[] = [
      {
        id: '1',
        content: evaluationPrompt,
        role: 'user',
        timestamp: new Date()
      }
    ];

    const response = await sendMessage(messages);
    
    // Parse the JSON response
    const cleanResponse = response.replace(/```json\n?|\n?```/g, '').trim();
    const evaluation = JSON.parse(cleanResponse);
    
    // If AI is detected, override scores
    if (evaluation.aiDetected) {
      evaluation.score = 0;
      evaluation.technicalAccuracy = 0;
      evaluation.problemSolving = 0;
      evaluation.communication = 0;
      evaluation.documentation = 0;
      evaluation.feedback = "AI-generated response detected. This violates assessment integrity guidelines.";
    }
    
    // Determine level based on score
    let level: 'Level 1' | 'Level 2' | 'Level 3';
    if (evaluation.score >= 80) {
      level = 'Level 3';
    } else if (evaluation.score >= 40) {
      level = 'Level 2';
    } else {
      level = 'Level 1';
    }
    
    return {
      questionId,
      question: questionText, // Now using the actual question text
      answer,
      score: evaluation.score,
      level,
      feedback: evaluation.feedback,
      technicalAccuracy: evaluation.technicalAccuracy,
      problemSolving: evaluation.problemSolving,
      communication: evaluation.communication,
      documentation: evaluation.documentation,
      aiDetected: evaluation.aiDetected
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    // Fallback evaluation with proper scoring range
    return {
      questionId,
      question: questionText,
      answer,
      score: 50,
      level: 'Level 2',
      feedback: 'Answer received but evaluation service encountered an error.',
      technicalAccuracy: 12,
      problemSolving: 12,
      communication: 13,
      documentation: 13,
      aiDetected: false
    };
  }
};

export const calculateOverallResults = (answers: QuestionAnswer[]) => {
  if (answers.length === 0) {
    return { averageScore: 0, overallLevel: 'Level 2' as const };
  }

  const averageScore = answers.reduce((sum, answer) => sum + answer.score, 0) / answers.length;
  
  // Determine overall level based on average score using same criteria
  let overallLevel: 'Level 1' | 'Level 2' | 'Level 3';
  if (averageScore >= 80) {
    overallLevel = 'Level 3';
  } else if (averageScore >= 40) {
    overallLevel = 'Level 2';
  } else {
    overallLevel = 'Level 1';
  }

  return { averageScore: Math.round(averageScore * 10) / 10, overallLevel };
};
