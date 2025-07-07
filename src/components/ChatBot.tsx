import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { InterviewResults } from './InterviewResults';
import { LoadingScreen } from './LoadingScreen';
import { ErrorScreen } from './ErrorScreen';
import { ExistingInterviewScreen } from './ExistingInterviewScreen';
import { InterviewSidebar } from './InterviewSidebar';
import { InterviewHeader } from './InterviewHeader';
import { Alert, AlertDescription } from './ui/alert';
import { evaluateAnswer, calculateOverallResults } from '../lib/interview';
import { getZohoIdFromUrl } from '../lib/urlUtils';
import { sendInterviewResults } from '../lib/webhookService';
import { saveInterviewResults, getInterviewResults, updateCandidateAssessmentStatus } from '../lib/supabaseService';
import { useFetchCandidate } from '../hooks/useFetchCandidate';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';
import { useInterviewSettings } from '../hooks/useInterviewSettings';
import { useInterviewTimer } from '../hooks/useInterviewTimer';
import { Message } from '../types/chat';
import { InterviewState, QuestionAnswer } from '../types/interview';

export const ChatBot = () => {
  const { questions: allQuestions, loading: questionsLoading, error: questionsError, selectQuestionsBySettings } = useInterviewQuestions();
  const { settings, loading: settingsLoading, error: settingsError } = useInterviewSettings();
  const { fetchCandidate, loading: candidateLoading, error: candidateError, candidate } = useFetchCandidate();

  const [questions, setQuestions] = useState<any[]>([]);
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
  const [interviewStarted, setInterviewStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Timer hook for assessment duration
  const { timeRemaining, isExpired, isStarted, startTimer, formattedTime } = useInterviewTimer(
    settings?.duration || 30,
    () => {
      console.log('Assessment has expired');
      setInterviewState(prev => ({ ...prev, isComplete: true }));
      
      const expiredMessage: Message = {
        id: Date.now().toString(),
        content: "⏰ **Assessment Expired**\n\nThe allocated assessment time has ended. Thank you for your participation. Your responses have been recorded and will be reviewed by our team.",
        role: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, expiredMessage]);
    }
  );

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

  // Check for existing assessment results - only once when zoho_id is available
  useEffect(() => {
    const checkExistingInterview = async () => {
      if (zohoId && !duplicateCheckCompleted) {
        setDuplicateCheckCompleted(true);
        try {
          console.log('Checking for existing assessment results for zoho_id:', zohoId);
          const existingResults = await getInterviewResults(zohoId);
          
          if (existingResults && existingResults.length > 0) {
            console.log('Existing assessment found:', existingResults[0]);
            setExistingInterview(existingResults[0]);
            
            const alertMessage: Message = {
              id: '1',
              content: `🚨 **Your Assessment Result Already Submitted**

We found that you have already completed this AI screening assessment. Each candidate can only take the assessment once to ensure fairness and integrity in our assessment process.

Your previous assessment was completed on: ${new Date(existingResults[0].completed_at).toLocaleDateString()}

If you believe this is an error or have questions about your assessment status, please contact our recruitment team.

Thank you for your understanding.`,
              role: 'assistant',
              timestamp: new Date()
            };
            setMessages([alertMessage]);
            
            setInterviewState(prev => ({
              ...prev,
              isComplete: true
            }));
          }
        } catch (error) {
          console.error('Error checking for existing assessment:', error);
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
      });
    }
  }, [zohoId, candidateFetched, candidateLoading, fetchCandidate, existingInterview, duplicateCheckCompleted]);

  // Select questions based on settings when both are loaded
  useEffect(() => {
    if (!questionsLoading && !settingsLoading && allQuestions.length > 0 && settings && questions.length === 0) {
      console.log('Selecting questions based on settings:', settings);
      const selectedQuestions = selectQuestionsBySettings(settings);
      setQuestions(selectedQuestions);
      console.log('Selected questions:', selectedQuestions);
    }
  }, [questionsLoading, settingsLoading, allQuestions, settings, questions.length, selectQuestionsBySettings]);

  // Initialize welcome message when questions are selected and no existing assessment
  useEffect(() => {
    if (questions.length > 0 && messages.length === 0 && !existingInterview && duplicateCheckCompleted && settings) {
      const candidateInfo = candidate ? ` for ${candidate.full_name || candidate.first_name || 'Candidate'}` : '';
      
      const welcomeMessage: Message = {
        id: '1',
        content: `Welcome to Scaled Inc's Structured Assessment${candidateInfo} for Level 1, Level 2, and Level 3 MSP Technicians!

This structured assessment will evaluate your technical proficiency, problem-solving skills, and professional experience. Please answer each question thoughtfully and clearly.

**Assessment Details:**
• Duration: ${settings.duration} minutes
• Total Questions: ${questions.length}
• Question Mix: ${settings.easy_questions_percentage}% Easy, ${settings.medium_questions_percentage}% Medium, ${settings.hard_questions_percentage}% Hard

⏰ **Timer starts when you answer the first question!**

Ready to begin?

**Question 1:** ${questions[0].question}`,
        role: 'assistant',
        timestamp: new Date(),
        questionId: 1
      };
      setMessages([welcomeMessage]);
    }
  }, [questions, messages.length, candidate, existingInterview, duplicateCheckCompleted, settings]);

  // Show loading state while fetching data
  if (questionsLoading || candidateLoading || settingsLoading || !duplicateCheckCompleted) {
    return <LoadingScreen candidateLoading={candidateLoading} duplicateCheckCompleted={duplicateCheckCompleted} />;
  }

  // Show error state if questions or settings failed to load
  if (questionsError || settingsError) {
    return <ErrorScreen questionsError={questionsError || settingsError} />;
  }

  // Show alert if assessment already exists
  if (existingInterview) {
    return <ExistingInterviewScreen existingInterview={existingInterview} candidate={candidate} messages={messages} />;
  }

  const handleSendMessage = async (content: string, detectionResult?: any) => {
    // Start timer on first answer and update status to in_progress
    if (!interviewStarted && !isStarted) {
      startTimer();
      setInterviewStarted(true);
      console.log('Assessment timer started');
      
      // Update candidate status to in_progress
      if (zohoId) {
        try {
          await updateCandidateAssessmentStatus(zohoId, 'in_progress');
          console.log('Candidate assessment status updated to in_progress');
        } catch (error) {
          console.error('Failed to update candidate status to in_progress:', error);
        }
      }
    }

    // Log copy-paste detection result
    if (detectionResult) {
      console.log('Copy-paste detection for this response:', detectionResult);
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // If assessment is complete or expired, don't process answers
      if (interviewState.isComplete || isExpired) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: isExpired 
            ? "⏰ **Assessment Time Expired** - No further responses can be accepted."
            : "Thank you! The assessment has been completed. We appreciate your time and interest in our position.",
          role: 'assistant',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, assistantMessage]);
        setIsLoading(false);
        return;
      }

      // Evaluate the current answer with the actual question and detection result
      const currentQuestion = questions[interviewState.currentQuestionIndex];
      console.log('Evaluating answer for question:', currentQuestion);
      
      // Pass detection result to evaluation
      const evaluation = await evaluateAnswer(
        currentQuestion.id, 
        content, 
        currentQuestion, 
        detectionResult
      );
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
        responseContent = `🎉 **Assessment Complete!** 

Thank you for completing our AI-powered pre-screening assessment. Your responses will be carefully evaluated, and we will follow up with you regarding the next steps in our hiring process. We appreciate your interest in joining our team!`;
        
        // Determine if candidate passed or failed based on average score
        const finalStatus = averageScore >= 60 ? 'passed' : 'failed';
        
        // Save results to both Zoho Flow webhook and Supabase if zoho_id is available
        if (zohoId) {
          try {
            await saveInterviewResults(zohoId, updatedAnswers, averageScore, overallLevel);
            console.log('Assessment results successfully saved to Supabase');
            
            await sendInterviewResults(zohoId, updatedAnswers, averageScore, overallLevel);
            console.log('Assessment results successfully sent to Zoho Flow');
            
            // Update candidate final status
            await updateCandidateAssessmentStatus(zohoId, finalStatus);
            console.log(`Candidate assessment status updated to ${finalStatus}`);
          } catch (error) {
            console.error('Failed to save/send results:', error);
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
      console.error('Error processing assessment answer:', error);
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

      {/* Main Assessment Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Timer */}
        <div className="border-b border-slate-200/50 bg-white/95 backdrop-blur-xl shadow-sm flex-shrink-0 p-4">
          <div className="flex items-center justify-between">
            <InterviewHeader 
              isLoading={isLoading}
              interviewState={interviewState}
              questionsLength={questions.length}
            />
            
            {/* Timer Display */}
            {isStarted && (
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg ${
                isExpired ? 'bg-red-100 text-red-700' : 
                timeRemaining < 300 ? 'bg-orange-100 text-orange-700' : 
                'bg-blue-100 text-blue-700'
              }`}>
                <span className="text-sm font-medium">
                  {isExpired ? 'EXPIRED' : `Time: ${formattedTime}`}
                </span>
              </div>
            )}
          </div>

          {/* Assessment Expired Alert */}
          {isExpired && (
            <Alert className="mt-4 border-red-200 bg-red-50">
              <AlertDescription className="text-red-800">
                ⏰ The assessment time has expired. No further responses will be accepted.
              </AlertDescription>
            </Alert>
          )}
        </div>

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
            disabled={isLoading || questions.length === 0 || isExpired || interviewState.isComplete}
            placeholder={
              isExpired ? "Assessment time expired" :
              interviewState.isComplete ? "Assessment completed - thank you for your time" : 
              "Share your detailed response..."
            }
          />
        </div>
      </div>
    </div>
  );
};
