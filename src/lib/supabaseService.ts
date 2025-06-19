import { supabaseAdmin, supabase } from './supabase';
import { QuestionAnswer } from '../types/interview';
import { analyzeInterviewMetrics, generateDynamicFeedback } from './feedbackGenerator';

export interface InterviewResult {
  id?: string;
  zoho_id: string;
  candidate_id?: string; // Made optional
  overall_score: number;
  overall_level: string;
  technical_accuracy: number;
  problem_solving: number;
  communication: number;
  documentation: number;
  feedback: string;
  ai_detected: boolean;
  completed_at: string;
  answers: QuestionAnswer[];
  questions?: QuestionAnswer[]; // For compatibility with the questions field
  detailed_result?: any; // For the new detailed_results structure
  status?: string;
}

export const saveInterviewResults = async (
  zohoId: string,
  answers: QuestionAnswer[],
  averageScore: number,
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3'
): Promise<void> => {
  // Analyze interview metrics and generate dynamic feedback
  const analysis = analyzeInterviewMetrics(answers, averageScore, overallLevel);
  const dynamicFeedback = generateDynamicFeedback(analysis);

  // Calculate average scores for each category
  const avgTechnicalAccuracy = answers.reduce((sum, ans) => sum + (ans.technicalAccuracy || 0), 0) / answers.length;
  const avgProblemSolving = answers.reduce((sum, ans) => sum + (ans.problemSolving || 0), 0) / answers.length;
  const avgCommunication = answers.reduce((sum, ans) => sum + (ans.communication || 0), 0) / answers.length;
  const avgDocumentation = answers.reduce((sum, ans) => sum + (ans.documentation || 0), 0) / answers.length;

  // Check if any AI was detected
  const hasAiDetection = answers.some(answer => answer.aiDetected);

  // Create detailed_results array with the exact structure you specified
  const detailedResults = answers.map(answer => ({
    question: answer.question || "",
    answer: answer.answer || "",
    feedback: answer.feedback || "",
    level: answer.level || "",
    score: answer.score || 0,
    technicalAccuracy: answer.technicalAccuracy || 0,
    problemSolving: answer.problemSolving || 0,
    documentation: answer.documentation || 0,
    communication: answer.communication || 0,
    aiDetected: answer.aiDetected || false
  }));

  // Create the interview result object with your specified structure
  const interviewResult = {
    zoho_id: zohoId,
    overall_score: averageScore,
    overall_level: overallLevel,
    technical_accuracy: Number(avgTechnicalAccuracy.toFixed(1)),
    problem_solving: Number(avgProblemSolving.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    documentation: Number(avgDocumentation.toFixed(1)),
    feedback: dynamicFeedback,
    ai_detected: hasAiDetection,
    completed_at: new Date().toISOString(),
    detailed_result: detailedResults, // Store as detailed_result to match the database column
    status: 'completed'
  };

  try {
    console.log('Saving detailed interview results to Supabase with zoho_id:', zohoId);
    console.log('Detailed results structure:', detailedResults);
    console.log('Generated dynamic feedback:', dynamicFeedback);
    
    // Use supabaseAdmin client to bypass RLS
    const { error } = await supabaseAdmin
      .from('interview_results')
      .insert([interviewResult]);

    if (error) {
      throw error;
    }

    console.log('Detailed interview results saved successfully to Supabase');
  } catch (error) {
    console.error('Error saving detailed interview results to Supabase:', error);
    throw new Error('Failed to save detailed interview results to database');
  }
};

export const getInterviewResults = async (zohoId?: string) => {
  try {
    let query = supabase
      .from('interview_results')
      .select('*')
      .order('completed_at', { ascending: false });

    if (zohoId) {
      query = query.eq('zoho_id', zohoId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching interview results from Supabase:', error);
    throw new Error('Failed to fetch interview results from database');
  }
};

// Function to get interview results with candidate information (like populate/inner join)
export const getInterviewResultsWithCandidateInfo = async (zohoId?: string) => {
  try {
    let query = supabase
      .from('interview_results')
      .select(`
        *,
        candidates!inner(
          zoho_id,
          first_name,
          last_name,
          full_name,
          email,
          mobile,
          current_job_title,
          experience_in_years,
          candidate_status,
          candidate_stage
        )
      `)
      .order('completed_at', { ascending: false });

    if (zohoId) {
      query = query.eq('zoho_id', zohoId);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching interview results with candidate info:', error);
    throw new Error('Failed to fetch interview results with candidate information');
  }
};
