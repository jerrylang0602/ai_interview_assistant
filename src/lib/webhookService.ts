
import { QuestionAnswer } from '../types/interview';
import { analyzeInterviewMetrics, generateDynamicFeedback } from './feedbackGenerator';

const ZOHO_FLOW_WEBHOOK_URL = 'https://flow.zoho.com/8073440/flow/webhook/incoming?zapikey=1001.ac66b4b71b9f86b4b23fa1a9f7976bb8.af6b88e9e7c1ed31ec13a74e88ad8eae&isdebug=false';

export const sendInterviewResults = async (
  zohoId: string,
  answers: QuestionAnswer[],
  averageScore: number,
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3'
): Promise<void> => {
  // Analyze interview metrics and generate dynamic feedback
  const analysis = analyzeInterviewMetrics(answers, averageScore, overallLevel);
  const dynamicFeedback = generateDynamicFeedback(analysis);

  // Create payload in the exact format specified by the user
  const payload = {
    "candidate_id": zohoId, // Using zoho_id as candidate_id as specified
    "Overall Score": averageScore.toString(),
    "Overall Level": overallLevel,
    "Technical Accuracy": analysis.technicalAccuracy.toFixed(1),
    "Problem Solving": analysis.problemSolving.toFixed(1),
    "Communication": analysis.communication.toFixed(1),
    "Documentation": analysis.documentation.toFixed(1),
    "Feedback": dynamicFeedback
  };

  try {
    console.log('Sending interview results to Zoho Flow with candidate_id:', zohoId);
    console.log('Generated dynamic feedback:', dynamicFeedback);
    console.log('Payload:', JSON.stringify(payload, null, 2));
    
    const response = await fetch(ZOHO_FLOW_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook request failed with status: ${response.status}`);
    }

    console.log('Interview results sent successfully to Zoho Flow');
  } catch (error) {
    console.error('Error sending interview results to Zoho Flow:', error);
    throw new Error('Failed to send interview results to webhook');
  }
};
