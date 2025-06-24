
import React from 'react';
import { ClipboardList } from 'lucide-react';
import { InterviewState } from '../types/interview';

interface InterviewHeaderProps {
  isLoading: boolean;
  interviewState: InterviewState;
  questionsLength: number;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({ 
  isLoading, 
  interviewState, 
  questionsLength 
}) => {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4 min-w-0 flex-1 mr-4">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center md:hidden shadow-lg">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-800 truncate">MSP Technician Assessment</h2>
          <p className="text-sm text-slate-500 font-medium truncate">
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
                Question {interviewState.currentQuestionIndex + 1} of {questionsLength}
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
  );
};
