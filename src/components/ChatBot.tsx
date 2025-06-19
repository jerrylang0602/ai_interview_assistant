
import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { InterviewResults } from './InterviewResults';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';
import { ExistingInterviewScreen } from './ExistingInterviewScreen';
import { InterviewSidebar } from './InterviewSidebar';
import { InterviewHeader } from './InterviewHeader';
import { evaluateAnswer, calculateOverallResults } from '../lib/interview';
import { getZohoIdFromUrl } from '../lib/urlUtils';
import { sendInterviewResults } from '../lib/webhookService';
import { saveInterviewResults, getInterviewResults } from '../lib/supabaseService';
import { useFetchCandidate } from '../hooks/useFetchCandidate';
import { Message } from '../types/chat';
import { InterviewState, QuestionAnswer } from '../types/interview';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';

export const ChatBot = () => {
  const { questions, loading: questionsLoading, error: questionsError, getQuestionCounts } = useInterviewQuestions();
  const { fetchCandidate, loading: candidateLoading, error: candidateError, candidate } = useFetchCandidate();
  const questionCounts = getQuestionCounts();

  const [messages, setMessages] = useState<Message[]>([]);
  const [interviewState, setInterviewState] = useState<InterviewState>({
    currentQuestionIndex: 0,
    answers: [],
    isComplete: false,
    averageScore: 0,
    overallLevel: 'Level 2'
  });

  const [isLoading, setIsLoading] = useState(false);
  const [zohoId, setZohoId] = useState<string | null>(null);
  const [candidateFetched, setCandidateFetched] = useState(false);
  const [existingInterview, setExistingInterview] = useState<any>(null);
  const [duplicateCheckCompleted, setDuplicateCheckCompleted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Extract zoho_id from URL - only once when component mounts
  useEffect(() => {
    const id = getZohoIdFromUrl();
    setZohoId(id);
    console.log('Zoho ID extracted from URL:', id);
  }, []);

  // Check for existing interview results - only once when zoho_id is available
  useEffect(() => {
    const checkExistingInterview = async () => {
      if (zohoId && !duplicateCheckCompleted) {
        setDuplicateCheckCompleted(true);
        try {
          console.log('Checking for existing interview results for zoho_id:', zohoId);
          const existingResults = await getInterviewResults(zohoId);
          
          if (existingResults && existingResults.length > 0) {
            console.log('Existing interview found:', existingResults[0]);
            setExistingInterview(existingResults[0]);
            
            // Set a message showing the interview is already completed
            const alertMessage: Message = {
              id: '1',
              content: `🚨 **Your Interview Result Already Submitted**

We found that you have already completed this AI screening interview. Each candidate can only take the interview once to ensure fairness and integrity in our assessment process.

Your previous interview was completed on: ${new Date(existingResults[0].completed_at).toLocaleDateString()}

If you believe this is an error or have questions about your interview status, please contact our recruitment team.

Thank you for your understanding.`,
              role: 'assistant',
              timestamp: new Date()
            };
            setMessages([alertMessage]);
            
            // Mark interview as complete to prevent further interaction
            setInterviewState(prev => ({
              ...prev,
              isComplete: true
            }));
          }
        } catch (error) {
          console.error('Error checking for existing interview:', error);
          // Continue with normal flow if check fails
        }
      }
    };

    checkExistingInterview();
  }, [zohoId, duplicateCheckCompleted]);

  // Fetch candidate data only once when zoho_id is available and not already fetched
  useEffect(() => {
    if (zohoId && !candidateFetched && !candidateLoading && !existingInterview && duplicateCheckCompleted) {
      console.log('Initiating candidate fetch for zoho_id:', zohoId);
      setCandidateFetched(true);
      fetchCandidate(zohoId).catch(error => {
        console.error('Failed to fetch candidate data:', error);
        // Continue with interview even if candidate fetch fails
      });
    }
  }, [zohoId, candidateFetched, candidateLoading, fetchCandidate, existingInterview, duplicateCheckCompleted]);

  // Initialize welcome message when questions are loaded and no existing interview
  useEffect(() => {
    if (!questionsLoading && questions.length > 0 && messages.length === 0 && !existingInterview && duplicateCheckCompleted) {
      const candidateInfo = candidate ? ` for ${candidate.full_name || candidate.first_name || 'Candidate'}` : '';
      
      const welcomeMessage: Message = {
        id: '1',
        content: `Welcome to Scaled Inc's Interactive AI Screening Interview${candidateInfo} for Level 1, Level 2, and Level 3 MSP Technicians!

This structured interview will evaluate your technical proficiency, problem-solving skills, and professional experience. Please answer each question thoughtfully and clearly.

I'll ask you ${questionCounts.total} questions covering:
• Technical Competencies (${questionCounts.technical} questions)
• Scenario-based Problem Solving (${questionCounts.scenarioBased} questions) 
• Behavioral & Soft Skills (${questionCounts.behavioral} questions)

Each answer will be evaluated and scored:
• Score 80-100: Level 3 (Advanced expertise)
• Score 40-79: Level 2 (Solid foundation) 
• Score 1-39: Level 1 (Basic understanding)

Ready to begin?

**Question 1:** ${questions[0].question}`,
        role: 'assistant',
        timestamp: new Date(),
        questionId: 1
      };
      setMessages([welcomeMessage]);
    }
  }, [questionsLoading, questions, messages.length, questionCounts, candidate, existingInterview, duplicateCheckCompleted]);

  // Show loading state while fetching questions, candidate, or checking for duplicates
  if (questionsLoading || candidateLoading || !duplicateCheckCompleted) {
    return <LoadingScreen candidateLoading={candidateLoading} duplicateCheckCompleted={duplicateCheckCompleted} />;
  }

  // Show error state if questions failed to load
  if (questionsError) {
    return <ErrorScreen questionsError={questionsError} />;
  }

  // Show alert if interview already exists
  if (existingInterview) {
    return <ExistingInterviewScreen existingInterview={existingInterview} candidate={candidate} messages={messages} />;
  }

  const handleSendMessage = async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // If interview is complete, don't process answers
      if (interviewState.isComplete) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: "Thank you! The interview has been completed. We appreciate your time and interest in our position.",
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Evaluate the current answer with the actual question
      const currentQuestion = questions[interviewState.currentQuestionIndex];
      console.log('Evaluating answer for question:', currentQuestion);
      
      const evaluation = await evaluateAnswer(currentQuestion.id, content, currentQuestion);
      console.log('Evaluation result:', evaluation);
      
      // Update interview state with the new answer
      const updatedAnswers = [...interviewState.answers, evaluation];
      const nextQuestionIndex = interviewState.currentQuestionIndex + 1;
      const isComplete = nextQuestionIndex >= questions.length;

      let responseContent = '';

      if (!isComplete) {
        const nextQuestion = questions[nextQuestionIndex];
        responseContent = `**Question ${nextQuestion.id}:** ${nextQuestion.question}`;
      } else {
        const { averageScore, overallLevel } = calculateOverallResults(updatedAnswers);
        responseContent = `🎉 **Interview Complete!** 

Thank you for completing our AI-powered pre-screening interview. Your responses will be carefully evaluated, and we will follow up with you regarding the next steps in our hiring process. We appreciate your interest in joining our team!`;
        
        // Save results to both Zoho Flow webhook and Supabase if zoho_id is available
        if (zohoId) {
          try {
            // Save to Supabase database
            await saveInterviewResults(zohoId, updatedAnswers, averageScore, overallLevel);
            console.log('Interview results successfully saved to Supabase');
            
            // Send to Zoho Flow webhook
            await sendInterviewResults(zohoId, updatedAnswers, averageScore, overallLevel);
            console.log('Interview results successfully sent to Zoho Flow');
          } catch (error) {
            console.error('Failed to save/send results:', error);
            // Continue with the interview completion even if saving fails
          }
        } else {
          console.warn('No zoho_id found in URL, skipping data persistence');
        }
        
        setInterviewState({
          currentQuestionIndex: nextQuestionIndex,
          answers: updatedAnswers,
          isComplete: true,
          averageScore,
          overallLevel: overallLevel as 'Level 2' | 'Level 3'
        });
      }

      // Update interview state
      if (!isComplete) {
        setInterviewState(prev => ({
          ...prev,
          currentQuestionIndex: nextQuestionIndex,
          answers: updatedAnswers
        }));
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        role: 'assistant',
        timestamp: new Date(),
        questionId: !isComplete ? questions[nextQuestionIndex].id : undefined
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error processing interview answer:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm sorry, I encountered an error processing your answer. Please try again.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Sidebar */}
      <InterviewSidebar 
        candidate={candidate}
        interviewState={interviewState}
        questionsLength={questions.length}
      />

      {/* Main Interview Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <InterviewHeader 
          isLoading={isLoading}
          interviewState={interviewState}
          questionsLength={questions.length}
        />

        {/* Messages Area - Fixed height and scrollable */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 min-h-0">
            <MessageList messages={messages} isLoading={isLoading} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Enhanced Input Area */}
        <div className="border-t border-slate-200/50 bg-white/95 backdrop-blur-xl shadow-lg flex-shrink-0">
          <MessageInput 
            onSendMessage={handleSendMessage} 
            disabled={isLoading || questions.length === 0}
            placeholder={interviewState.isComplete ? "Interview completed - thank you for your time" : "Share your detailed response..."}
          />
        </div>
      </div>
    </div>
  );
};
