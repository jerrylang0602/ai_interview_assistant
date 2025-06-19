
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { InterviewQuestion } from '../types/interview';

export const useInterviewQuestions = () => {
  const [questions, setQuestions] = useState<InterviewQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('interview_questions')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          throw error;
        }

        // Transform Supabase data to match our InterviewQuestion interface
        const transformedQuestions: InterviewQuestion[] = data.map((q, index) => ({
          id: index + 1,
          section: q.section || 'General',
          question: q.question,
          followUp: undefined
        }));

        setQuestions(transformedQuestions);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch questions');
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  // Count questions by section
  const getQuestionCounts = () => {
    const technical = questions.filter(q => q.section === 'Technical Competencies').length;
    const scenarioBased = questions.filter(q => q.section === 'Scenario-based Problem Solving').length;
    const behavioral = questions.filter(q => q.section === 'Behavioral & Soft Skills').length;
    
    return {
      technical,
      scenarioBased,
      behavioral,
      total: questions.length
    };
  };

  return {
    questions,
    loading,
    error,
    getQuestionCounts
  };
};
