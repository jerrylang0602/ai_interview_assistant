
import React from 'react';
import { Message } from '../types/chat';
import { Bot, User, CheckCircle } from 'lucide-react';

interface MessageProps {
  message: Message;
}

export const MessageComponent: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex gap-4 ${isUser ? 'justify-end' : 'justify-start'} group`}>
      {!isUser && (
        <div className="relative flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
            <CheckCircle className="w-2 h-2 text-white" />
          </div>
        </div>
      )}
      
      <div className={`max-w-xs md:max-w-md lg:max-w-2xl xl:max-w-3xl ${isUser ? 'order-1' : ''}`}>
        <div
          className={`px-6 py-4 rounded-3xl shadow-sm border transition-all duration-200 ${
            isUser
              ? 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-br-lg border-blue-200 shadow-blue-100'
              : 'bg-white border-slate-200 text-slate-800 rounded-bl-lg shadow-slate-100 hover:shadow-md hover:border-slate-300'
          }`}
        >
          <p className={`text-sm leading-relaxed whitespace-pre-wrap ${
            isUser ? 'text-blue-50' : 'text-slate-700'
          }`}>
            {message.content}
          </p>
        </div>
        
        <div className={`flex items-center gap-2 mt-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <p className="text-xs text-slate-400 font-medium">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </p>
          {message.questionId && (
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
              Q{message.questionId}
            </span>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="relative flex-shrink-0 order-2">
          <div className="w-10 h-10 bg-gradient-to-br from-slate-600 to-slate-700 rounded-2xl flex items-center justify-center shadow-lg">
            <User className="w-5 h-5 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full border-2 border-white"></div>
        </div>
      )}
    </div>
  );
};
