
import { sendMessage } from './openai';
import { Message } from '../types/chat';
import { QuestionAnswer, InterviewQuestion } from '../types/interview';

export const evaluateAnswer = async (
  questionId: number, 
  answer: string, 
  question?: InterviewQuestion,
  detectionResult?: any
): Promise<QuestionAnswer> => {
  // Use the actual question text if provided, otherwise fall back to placeholder
  const questionText = question?.question || `Question ${questionId}`;

  // Enhanced evaluation prompt that includes copy-paste detection context
  const evaluationPrompt = `
You are an expert technical interviewer evaluating MSP technician candidates for Level 1, Level 2, and Level 3 positions.

CRITICAL: Copy-Paste and AI Detection Analysis Required

${detectionResult ? `
COPY-PASTE DETECTION RESULTS:
- Paste detected: ${detectionResult.isPasted ? 'YES' : 'NO'}
- AI-generated likelihood: ${detectionResult.isLikelyAI ? 'HIGH' : 'LOW'}
- AI confidence score: ${detectionResult.aiConfidence}%
- Pasted content length: ${detectionResult.pastedLength} characters
- Paste timestamp: ${detectionResult.pasteTimestamp}

IMPORTANT: If copy-paste was detected AND AI likelihood is HIGH (confidence > 30%), automatically assign ALL scores to 0 and flag as "AI_DETECTED".
` : ''}

Question: ${questionText}
Candidate Answer: ${answer}

Evaluate this answer based on these specific metrics using a 1-100 point scale for EACH category:

1. Technical Accuracy (1-100 points): Clarity, completeness, and technical correctness of the response
2. Problem-Solving Methodology (1-100 points): Structured and logical approaches to troubleshooting and solutions
3. Professional Communication (1-100 points): Clarity, effectiveness, and appropriateness of communication
4. Documentation & Process Orientation (1-100 points): Methodical approaches and quality in maintaining technical documentation

IMPORTANT SCORING REQUIREMENTS:
- Each category score must be between 1-100 (never 0 unless AI/copy-paste is detected)
- Overall score will be calculated as the average of the four category scores
- If copy-paste detection shows HIGH AI likelihood OR response appears AI-generated, automatically assign ALL scores to 0 and flag as "AI_DETECTED"
- Ensure realistic scoring - don't assign perfect scores unless truly exceptional
- Be consistent with the numerical ranges provided (1-100 for each category)

Additional AI Detection Criteria:
- Overly structured or perfect formatting
- Generic phrases like "I would recommend" or "best practices include"  
- Unnaturally comprehensive coverage of topics
- Lack of personal experience or specific examples
- Perfect technical accuracy without real-world nuances
- Use of markdown formatting or numbered lists
- Overly formal language inconsistent with casual interview responses

Provide your response in this exact JSON format:
{
  "technicalAccuracy": [score out of 100, range 1-100],
  "problemSolving": [score out of 100, range 1-100], 
  "communication": [score out of 100, range 1-100],
  "documentation": [score out of 100, range 1-100],
  "aiDetected": [true/false],
  "copyPasteDetected": [true/false],
  "feedback": "[brief constructive feedback explaining the score and any AI/copy-paste detection]"
}

Score Guidelines:
- 80-100: Advanced expertise, comprehensive understanding, proactive approaches
- 40-79: Solid foundational knowledge, standard procedures, some guidance needed
- 1-39: Basic understanding, significant gaps, requires substantial training
- 0: AI-generated response detected, copy-paste violation, or completely inadequate response
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
    
    // If AI is detected or copy-paste with high AI confidence, override scores to 0
    const aiDetectedBySystem = evaluation.aiDetected;
    const copyPasteAIDetected = detectionResult?.isLikelyAI && detectionResult?.aiConfidence > 30;
    
    if (aiDetectedBySystem || copyPasteAIDetected) {
      evaluation.technicalAccuracy = 0;
      evaluation.problemSolving = 0;
      evaluation.communication = 0;
      evaluation.documentation = 0;
      evaluation.aiDetected = true;
      evaluation.copyPasteDetected = detectionResult?.isPasted || false;
      
      if (copyPasteAIDetected) {
        evaluation.feedback = `AI-generated content detected through copy-paste analysis (${detectionResult.aiConfidence}% confidence). This violates assessment integrity guidelines.`;
      } else {
        evaluation.feedback = "AI-generated response detected. This violates assessment integrity guidelines.";
      }
    } else {
      // Ensure scores are within proper ranges (1-100 for each category)
      evaluation.technicalAccuracy = Math.max(1, Math.min(100, evaluation.technicalAccuracy));
      evaluation.problemSolving = Math.max(1, Math.min(100, evaluation.problemSolving));
      evaluation.communication = Math.max(1, Math.min(100, evaluation.communication));
      evaluation.documentation = Math.max(1, Math.min(100, evaluation.documentation));
      
      evaluation.copyPasteDetected = detectionResult?.isPasted || false;
    }
    
    // Calculate overall score as the average of the four category scores
    const overallScore = Math.round(
      (evaluation.technicalAccuracy + evaluation.problemSolving + evaluation.communication + evaluation.documentation) / 4
    );
    
    // Determine level based on overall score
    let level: 'Level 1' | 'Level 2' | 'Level 3';
    if (overallScore >= 80) {
      level = 'Level 3';
    } else if (overallScore >= 40) {
      level = 'Level 2';
    } else {
      level = 'Level 1';
    }
    
    return {
      questionId,
      question: questionText,
      answer,
      score: overallScore,
      level,
      feedback: evaluation.feedback,
      technicalAccuracy: evaluation.technicalAccuracy,
      problemSolving: evaluation.problemSolving,
      communication: evaluation.communication,
      documentation: evaluation.documentation,
      aiDetected: evaluation.aiDetected,
      copyPasteDetected: evaluation.copyPasteDetected
    };
  } catch (error) {
    console.error('Error evaluating answer:', error);
    // Fallback evaluation with proper scoring range (never 0 unless error)
    return {
      questionId,
      question: questionText,
      answer,
      score: 50,
      level: 'Level 2',
      feedback: 'Answer received but evaluation service encountered an error.',
      technicalAccuracy: 50,
      problemSolving: 50,
      communication: 50,
      documentation: 50,
      aiDetected: false,
      copyPasteDetected: detectionResult?.isPasted || false
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
