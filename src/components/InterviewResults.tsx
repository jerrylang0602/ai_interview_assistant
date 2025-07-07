
import React from 'react';
import { QuestionAnswer } from '../types/interview';
import { CheckCircle, Award, FileText, AlertTriangle, Shield, Brain, MessageSquare, ClipboardCheck } from 'lucide-react';
import { analyzeInterviewMetrics, generateDynamicFeedback } from '../lib/feedbackGenerator';

interface InterviewResultsProps {
  answers: QuestionAnswer[];
  averageScore: number;
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3';
}

export const InterviewResults: React.FC<InterviewResultsProps> = ({
  answers,
  averageScore,
  overallLevel
}) => {
  // Generate dynamic analysis and feedback
  const analysis = analyzeInterviewMetrics(answers, averageScore, overallLevel);
  const dynamicFeedback = generateDynamicFeedback(analysis);

  // Count questions by level
  const levelCounts = {
    'Level 1': answers.filter(a => a.level === 'Level 1').length,
    'Level 2': answers.filter(a => a.level === 'Level 2').length,
    'Level 3': answers.filter(a => a.level === 'Level 3').length
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">Assessment Complete</h3>
          <p className="text-sm text-gray-500">Technical Screening Results</p>
        </div>
      </div>

      {/* AI Detection Alert */}
      {analysis.aiDetected && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-5 h-5 text-red-600" />
            <h4 className="font-semibold text-red-800">Integrity Violation Detected</h4>
          </div>
          <p className="text-sm text-red-700">
            AI-generated responses detected in {analysis.aiDetectedCount} question(s). This violates assessment integrity guidelines.
          </p>
        </div>
      )}

      {/* Overall Results */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-blue-600" />
            <h4 className="font-semibold text-gray-800">Overall Score</h4>
          </div>
          <p className="text-2xl font-bold text-blue-600">{averageScore}/100</p>
        </div>

        <div className={`rounded-xl p-4 border ${
          overallLevel === 'Level 3' 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-100' 
            : overallLevel === 'Level 2'
            ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-100'
            : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-100'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <FileText className={`w-5 h-5 ${
              overallLevel === 'Level 3' ? 'text-green-600' 
              : overallLevel === 'Level 2' ? 'text-yellow-600' 
              : 'text-red-600'
            }`} />
            <h4 className="font-semibold text-gray-800">Overall Level</h4>
          </div>
          <p className={`text-2xl font-bold ${
            overallLevel === 'Level 3' ? 'text-green-600' 
            : overallLevel === 'Level 2' ? 'text-yellow-600' 
            : 'text-red-600'
          }`}>
            {overallLevel}
          </p>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-purple-600" />
            <h4 className="font-semibold text-gray-800">Level Distribution</h4>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-red-600">Level 1:</span>
              <span className="font-bold">{levelCounts['Level 1']}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-yellow-600">Level 2:</span>
              <span className="font-bold">{levelCounts['Level 2']}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Level 3:</span>
              <span className="font-bold">{levelCounts['Level 3']}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Metrics - Updated to show /100 scale */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl p-4 border border-cyan-100">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-cyan-600" />
            <h4 className="font-semibold text-gray-800 text-sm">Technical Accuracy</h4>
          </div>
          <p className="text-xl font-bold text-cyan-600">{analysis.technicalAccuracy}/100</p>
        </div>

        <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-emerald-600" />
            <h4 className="font-semibold text-gray-800 text-sm">Problem Solving</h4>
          </div>
          <p className="text-xl font-bold text-emerald-600">{analysis.problemSolving}/100</p>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-orange-600" />
            <h4 className="font-semibold text-gray-800 text-sm">Communication</h4>
          </div>
          <p className="text-xl font-bold text-orange-600">{analysis.communication}/100</p>
        </div>

        <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 border border-violet-100">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardCheck className="w-5 h-5 text-violet-600" />
            <h4 className="font-semibold text-gray-800 text-sm">Documentation</h4>
          </div>
          <p className="text-xl font-bold text-violet-600">{analysis.documentation}/100</p>
        </div>
      </div>

      {/* Strengths and Weaknesses */}
      {(analysis.strengths.length > 0 || analysis.weaknesses.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {analysis.strengths.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <h4 className="font-semibold text-green-800 mb-2">Key Strengths</h4>
              <ul className="text-sm text-green-700 space-y-1">
                {analysis.strengths.map((strength, index) => (
                  <li key={index}>• {strength}</li>
                ))}
              </ul>
            </div>
          )}
          
          {analysis.weaknesses.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <h4 className="font-semibold text-amber-800 mb-2">Areas for Improvement</h4>
              <ul className="text-sm text-amber-700 space-y-1">
                {analysis.weaknesses.map((weakness, index) => (
                  <li key={index}>• {weakness}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Question Breakdown - Updated to show /100 scale */}
      <div className="space-y-3 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3">Question Breakdown:</h4>
        {answers.map((answer, index) => (
          <div key={answer.questionId} className={`border rounded-lg p-4 ${
            answer.aiDetected ? 'border-red-200 bg-red-50' : 'border-gray-200'
          }`}>
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-gray-600">Question {answer.questionId}</span>
              <div className="flex items-center gap-2">
                {answer.aiDetected && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                    AI Detected
                  </span>
                )}
                <span className="text-sm font-bold text-blue-600">{answer.score}/100</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  answer.level === 'Level 3' 
                    ? 'bg-green-100 text-green-700' 
                    : answer.level === 'Level 2'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {answer.level}
                </span>
              </div>
            </div>
            
            {!answer.aiDetected && (
              <div className="grid grid-cols-4 gap-2 mb-2 text-xs">
                <div className="text-center">
                  <span className="text-cyan-600 font-medium">Tech: {answer.technicalAccuracy}/100</span>
                </div>
                <div className="text-center">
                  <span className="text-emerald-600 font-medium">Prob: {answer.problemSolving}/100</span>
                </div>
                <div className="text-center">
                  <span className="text-orange-600 font-medium">Comm: {answer.communication}/100</span>
                </div>
                <div className="text-center">
                  <span className="text-violet-600 font-medium">Doc: {answer.documentation}/100</span>
                </div>
              </div>
            )}
            
            <p className="text-sm text-gray-600 mb-2">{answer.feedback}</p>
          </div>
        ))}
      </div>

      {/* Dynamic Assessment Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100">
        <h4 className="font-semibold text-gray-800 mb-2">Dynamic Assessment Summary:</h4>
        <p className="text-sm text-gray-600 leading-relaxed">{dynamicFeedback}</p>
        
        {analysis.recommendations.length > 0 && (
          <div className="mt-4">
            <h5 className="font-medium text-gray-700 mb-2">Key Recommendations:</h5>
            <ul className="text-sm text-gray-600 space-y-1">
              {analysis.recommendations.map((recommendation, index) => (
                <li key={index}>• {recommendation}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
