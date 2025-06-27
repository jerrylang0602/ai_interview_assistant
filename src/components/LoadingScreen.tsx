
import React from 'react';
import { ClipboardList } from 'lucide-react';

interface LoadingScreenProps {
  candidateLoading: boolean;
  duplicateCheckCompleted: boolean;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  candidateLoading, 
  duplicateCheckCompleted 
}) => {
  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ClipboardList className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">
            {candidateLoading ? 'Loading Candidate Information...' : 
             !duplicateCheckCompleted ? 'Checking Assessment Status...' : 
             'Loading Assessment Questions...'}
          </h2>
          <p className="text-slate-600">
            {candidateLoading ? 'Fetching candidate details from Zoho Recruit.' : 
             !duplicateCheckCompleted ? 'Verifying if assessment has been completed previously.' :
             'Please wait while we prepare your assessment.'}
          </p>
        </div>
      </div>
    </div>
  );
};
