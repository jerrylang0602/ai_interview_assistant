
import React from 'react';
import { ClipboardList } from 'lucide-react';

interface ErrorScreenProps {
  questionsError: string;
}

export const ErrorScreen: React.FC<ErrorScreenProps> = ({ questionsError }) => {
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
};
