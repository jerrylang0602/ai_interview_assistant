
import React, { useState, useRef, useEffect } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { InterviewResults } from './InterviewResults';
import { evaluateAnswer, calculateOverallResults } from '../lib/interview';
import { getZohoIdFromUrl } from '../lib/urlUtils';
import { sendInterviewResults } from '../lib/webhookService';
import { saveInterviewResults, getInterviewResults } from '../lib/supabaseService';
import { useFetchCandidate } from '../hooks/useFetchCandidate';
import { Message } from '../types/chat';
import { InterviewState, QuestionAnswer } from '../types/interview';
import { useInterviewQuestions } from '../hooks/useInterviewQuestions';
import { Bot, ClipboardList, Trophy, Target, Users, TrendingUp, AlertCircle } from 'lucide-react';

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
  const [checkingDuplicate, setCheckingDuplicate] = useState(false);
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

  // Check for existing interview results when zoho_id is available
  useEffect(() => {
    const checkExistingInterview = async () => {
      if (zohoId && !checkingDuplicate) {
        setCheckingDuplicate(true);
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
        } finally {
          setCheckingDuplicate(false);
        }
      }
    };

    checkExistingInterview();
  }, [zohoId, checkingDuplicate]);

  // Fetch candidate data only once when zoho_id is available and not already fetched
  useEffect(() => {
    if (zohoId && !candidateFetched && !candidateLoading && !existingInterview) {
      console.log('Initiating candidate fetch for zoho_id:', zohoId);
      setCandidateFetched(true);
      fetchCandidate(zohoId).catch(error => {
        console.error('Failed to fetch candidate data:', error);
        // Continue with interview even if candidate fetch fails
      });
    }
  }, [zohoId, candidateFetched, candidateLoading, fetchCandidate, existingInterview]);

  // Initialize welcome message when questions are loaded and no existing interview
  useEffect(() => {
    if (!questionsLoading && questions.length > 0 && messages.length === 0 && !existingInterview && !checkingDuplicate) {
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
  }, [questionsLoading, questions, messages.length, questionCounts, candidate, existingInterview, checkingDuplicate]);

  // Show loading state while fetching questions, candidate, or checking for duplicates
  if (questionsLoading || candidateLoading || checkingDuplicate) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-6 h-6 text-white animate-pulse" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              {candidateLoading ? 'Loading Candidate Information...' : 
               checkingDuplicate ? 'Checking Interview Status...' : 
               'Loading Interview Questions...'}
            </h2>
            <p className="text-slate-600">
              {candidateLoading ? 'Fetching candidate details from Zoho Recruit.' : 
               checkingDuplicate ? 'Verifying if interview has been completed previously.' :
               'Please wait while we prepare your assessment.'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state if questions failed to load
  if (questionsError) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">Error Loading Questions</h2>
            <p className="text-slate-600">{questionsError}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Show alert if interview already exists
  if (existingInterview) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Enhanced Sidebar for existing interview alert */}
        <div className="w-96 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-xl hidden md:flex md:flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
              {/* Logo & Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 via-orange-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                    Interview Status
                  </h1>
                  <p className="text-xs text-slate-500 font-medium">Already Completed</p>
                  {candidate && (
                    <p className="text-xs text-slate-400 truncate">
                      {candidate.full_name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Candidate'}
                    </p>
                  )}
                </div>
              </div>

              {/* Alert Card */}
              <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200/50 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Interview Already Submitted</h3>
                </div>
                
                <div className="space-y-2 text-xs text-slate-600">
                  <p>You have already completed this assessment.</p>
                  <div className="pt-2 border-t border-red-200">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-slate-600">Completed:</span>
                      <span className="text-slate-800">
                        {new Date(existingInterview.completed_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium text-slate-600">Score:</span>
                      <span className="text-slate-800 font-bold">
                        {existingInterview.overall_score}/100
                      </span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-medium text-slate-600">Level:</span>
                      <span className="text-slate-800 font-bold">
                        {existingInterview.overall_level}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Candidate Info Card if available */}
              {candidate && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100/50 shadow-sm">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Users className="w-3.5 h-3.5 text-white" />
                    </div>
                    <h3 className="font-bold text-slate-800 text-sm">Candidate Info</h3>
                  </div>
                  
                  <div className="space-y-1.5 text-xs">
                    {candidate.full_name && (
                      <div className="flex">
                        <span className="font-medium text-slate-600 w-16 flex-shrink-0">Name:</span>
                        <span className="text-slate-800 truncate">{candidate.full_name}</span>
                      </div>
                    )}
                    {candidate.email && (
                      <div className="flex">
                        <span className="font-medium text-slate-600 w-16 flex-shrink-0">Email:</span>
                        <span className="text-slate-800 truncate">{candidate.email}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Interview Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Enhanced Header */}
          <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm flex-shrink-0">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="w-10 h-10 bg-gradient-to-br from-red-600 to-orange-600 rounded-xl flex items-center justify-center md:hidden shadow-lg">
                    <AlertCircle className="w-5 h-5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-xl font-bold text-slate-800">Interview Already Completed</h2>
                    <p className="text-sm text-slate-500 font-medium">
                      <span className="flex items-center gap-2 text-red-600">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        Assessment previously submitted
                      </span>
                    </p>
                  </div>
                </div>
                
                {/* Status Badge */}
                <div className="px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 bg-red-100 text-red-700 border border-red-200">
                  Already Submitted
                </div>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">
            <div className="flex-1 min-h-0">
              <MessageList messages={messages} isLoading={false} />
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Disabled Input Area */}
          <div className="border-t border-slate-200/50 bg-white/95 backdrop-blur-xl shadow-lg flex-shrink-0">
            <MessageInput 
              onSendMessage={() => {}} 
              disabled={true}
              placeholder="Interview already completed - no further input required"
            />
          </div>
        </div>
      </div>
    );
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
      {/* Enhanced Sidebar - Fixed width and proper scrolling */}
      <div className="w-96 bg-white/95 backdrop-blur-xl border-r border-slate-200/50 shadow-xl hidden md:flex md:flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Logo & Header - Compact */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent truncate">
                  AI Interview
                </h1>
                <p className="text-xs text-slate-500 font-medium">MSP Technician Assessment</p>
                {candidate && (
                  <p className="text-xs text-slate-400 truncate">
                    {candidate.full_name || `${candidate.first_name || ''} ${candidate.last_name || ''}`.trim() || 'Candidate'}
                  </p>
                )}
              </div>
            </div>
            
            {/* Progress Card - Moved to top */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100/50 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">Progress Overview</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium text-slate-600">Questions</span>
                  <span className="text-xs font-bold text-slate-800">
                    {Math.min(interviewState.currentQuestionIndex + 1, questions.length)}/{questions.length}
                  </span>
                </div>
                
                <div className="relative">
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out shadow-sm" 
                      style={{ width: `${(Math.min(interviewState.currentQuestionIndex + 1, questions.length) / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {interviewState.answers.length > 0 && interviewState.isComplete && (
                  <div className="pt-2 border-t border-blue-200">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-medium text-slate-600">Average Score</span>
                      <span className="text-sm font-bold text-blue-600">
                        {(interviewState.answers.reduce((sum, ans) => sum + ans.score, 0) / interviewState.answers.length).toFixed(1)}/100
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Candidate Info Card - Compact and conditional */}
            {candidate && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100/50 shadow-sm mb-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Users className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Candidate Info</h3>
                </div>
                
                <div className="space-y-1.5 text-xs">
                  {candidate.full_name && (
                    <div className="flex">
                      <span className="font-medium text-slate-600 w-16 flex-shrink-0">Name:</span>
                      <span className="text-slate-800 truncate">{candidate.full_name}</span>
                    </div>
                  )}
                  {candidate.email && (
                    <div className="flex">
                      <span className="font-medium text-slate-600 w-16 flex-shrink-0">Email:</span>
                      <span className="text-slate-800 truncate">{candidate.email}</span>
                    </div>
                  )}
                  {candidate.mobile && (
                    <div className="flex">
                      <span className="font-medium text-slate-600 w-16 flex-shrink-0">Mobile:</span>
                      <span className="text-slate-800">{candidate.mobile}</span>
                    </div>
                  )}
                  {candidate.current_job_title && (
                    <div className="flex">
                      <span className="font-medium text-slate-600 w-16 flex-shrink-0">Role:</span>
                      <span className="text-slate-800 truncate">{candidate.current_job_title}</span>
                    </div>
                  )}
                  {candidate.city && candidate.state && (
                    <div className="flex">
                      <span className="font-medium text-slate-600 w-16 flex-shrink-0">Location:</span>
                      <span className="text-slate-800 truncate">{candidate.city}, {candidate.state}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Chat Instructions - Compact */}
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100/50 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <Target className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm">How to Use</h3>
              </div>
              
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">Shift+Enter</kbd> to submit</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-white rounded border text-xs font-mono">Enter</kbd> for new lines</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Use the <strong>Send</strong> button as alternative</span>
                </div>
                
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>Answer thoughtfully with detailed explanations</span>
                </div>
              </div>
            </div>

            {/* Achievement Badge */}
            {interviewState.isComplete && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200/50 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center">
                    <Trophy className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm">Completed!</h3>
                </div>
                <p className="text-xs text-slate-600">
                  Interview assessment finished successfully.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Interview Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Enhanced Header */}
        <div className="bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-sm flex-shrink-0">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center md:hidden shadow-lg">
                  <ClipboardList className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-bold text-slate-800">MSP Technician Assessment</h2>
                  <p className="text-sm text-slate-500 font-medium">
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Evaluating your response...
                      </span>
                    ) : interviewState.isComplete ? (
                      <span className="flex items-center gap-2 text-emerald-600">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Assessment completed successfully
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        Question {interviewState.currentQuestionIndex + 1} of {questions.length}
                      </span>
                    )}
                  </p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`px-4 py-2 rounded-full text-xs font-bold flex-shrink-0 ${
                interviewState.isComplete 
                  ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                  : 'bg-blue-100 text-blue-700 border border-blue-200'
              }`}>
                {interviewState.isComplete ? 'Completed' : 'In Progress'}
              </div>
            </div>
          </div>
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
            disabled={isLoading || questions.length === 0}
            placeholder={interviewState.isComplete ? "Interview completed - thank you for your time" : "Share your detailed response..."}
          />
        </div>
      </div>
    </div>
  );
};
