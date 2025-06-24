
import { useState, useEffect } from 'react';
import { supabase } from '../integrations/supabase/client';
import { InterviewQuestion } from '../types/interview';
import { InterviewSettings } from '../lib/interviewSettingsService';

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

        // Helper function to validate and cast difficulty
        const validateDifficulty = (difficulty: string | null | undefined): 'Easy' | 'Medium' | 'Hard' => {
          if (difficulty === 'Easy' || difficulty === 'Medium' || difficulty === 'Hard') {
            return difficulty;
          }
          return 'Medium'; // Default fallback
        };

        // Transform Supabase data to match our InterviewQuestion interface
        const transformedQuestions: InterviewQuestion[] = data.map((q, index) => ({
          id: index + 1,
          section: q.section || 'General',
          question: q.question,
          difficulty: validateDifficulty(q.difficulty),
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

  // Utility function to shuffle an array randomly
  const shuffleArray = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Select questions based on settings
  const selectQuestionsBySettings = (settings: InterviewSettings): InterviewQuestion[] => {
    console.log('Selecting questions with settings:', settings);
    
    const easyQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'easy');
    const mediumQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'medium');
    const hardQuestions = questions.filter(q => q.difficulty?.toLowerCase() === 'hard');

    console.log(`Available questions - Easy: ${easyQuestions.length}, Medium: ${mediumQuestions.length}, Hard: ${hardQuestions.length}`);

    const selectedQuestions: InterviewQuestion[] = [];
    const totalQuestions = settings.question_count;

    // Calculate number of questions for each difficulty
    const easyCount = Math.round((settings.easy_questions_percentage / 100) * totalQuestions);
    const mediumCount = Math.round((settings.medium_questions_percentage / 100) * totalQuestions);
    const hardCount = Math.round((settings.hard_questions_percentage / 100) * totalQuestions);

    console.log(`Target counts - Easy: ${easyCount}, Medium: ${mediumCount}, Hard: ${hardCount}`);

    // Select random questions from each difficulty level
    const selectRandomQuestions = (questionPool: InterviewQuestion[], count: number) => {
      const shuffled = shuffleArray(questionPool);
      return shuffled.slice(0, Math.min(count, questionPool.length));
    };

    selectedQuestions.push(...selectRandomQuestions(easyQuestions, easyCount));
    selectedQuestions.push(...selectRandomQuestions(mediumQuestions, mediumCount));
    selectedQuestions.push(...selectRandomQuestions(hardQuestions, hardCount));

    // If we don't have enough questions, fill with any available questions
    const remainingCount = totalQuestions - selectedQuestions.length;
    if (remainingCount > 0) {
      const remainingQuestions = questions.filter(q => !selectedQuestions.includes(q));
      selectedQuestions.push(...selectRandomQuestions(remainingQuestions, remainingCount));
    }

    // Shuffle the final selection completely to randomize the order
    const completelyShuffledQuestions = shuffleArray(selectedQuestions);
    
    // Take only the required number of questions and reassign sequential IDs
    const finalQuestions = completelyShuffledQuestions.slice(0, totalQuestions).map((q, index) => ({
      ...q,
      id: index + 1
    }));

    console.log(`Selected and randomized ${finalQuestions.length} questions for interview`);
    return finalQuestions;
  };

  return {
    questions,
    loading,
    error,
    getQuestionCounts,
    selectQuestionsBySettings
  };
};
