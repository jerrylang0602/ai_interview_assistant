
import React from 'react';
import { AlertCircle, Users } from 'lucide-react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { Message } from '../types/chat';

interface ExistingInterviewScreenProps {
  existingInterview: any;
  candidate: any;
  messages: Message[];
}

export const ExistingInterviewScreen: React.FC<ExistingInterviewScreenProps> = ({ 
  existingInterview, 
  candidate, 
  messages 
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

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
};
