
import React from 'react';
import { ClipboardList, TrendingUp, Users, Target, Trophy } from 'lucide-react';
import { InterviewState } from '../types/interview';

interface InterviewSidebarProps {
  candidate: any;
  interviewState: InterviewState;
  questionsLength: number;
}

export const InterviewSidebar: React.FC<InterviewSidebarProps> = ({ 
  candidate, 
  interviewState, 
  questionsLength 
}) => {
  return (
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
                AI Assessment
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
                  {Math.min(interviewState.currentQuestionIndex + 1, questionsLength)}/{questionsLength}
                </span>
              </div>
              
              <div className="relative">
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-700 ease-out shadow-sm" 
                    style={{ width: `${(Math.min(interviewState.currentQuestionIndex + 1, questionsLength) / questionsLength) * 100}%` }}
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
                Assessment finished successfully.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
