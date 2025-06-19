
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Calendar, Trophy, AlertTriangle, CheckCircle, XCircle, Eye, ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  answer: string;
  score: number;
  aiDetected: boolean;
}

interface CandidateResult {
  id: string;
  name: string;
  email: string;
  position: string;
  date: string;
  score: number;
  status: string;
  ai_detection: boolean;
  technical_score: number;
  problem_solving_score: number;
  communication_score: number;
  documentation_score: number;
  notes: string;
  questions: Question[];
  created_at: string;
}

export const CandidateResults = () => {
  const [results, setResults] = useState<CandidateResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    fetchCandidateResults();
  }, []);

  const fetchCandidateResults = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('interview_details_result')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      setResults(data || []);
    } catch (err) {
      console.error('Error fetching candidate results:', err);
      setError('Failed to load candidate results');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'passed':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'failed':
        return 'text-red-700 bg-red-100 border-red-200';
      default:
        return 'text-yellow-700 bg-yellow-100 border-yellow-200';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const toggleRowExpansion = (resultId: string) => {
    setExpandedRow(expandedRow === resultId ? null : resultId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-slate-600">Loading candidate results...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2">
          <XCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-700 font-medium">Error</span>
        </div>
        <p className="text-red-600 mt-1">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Candidate Interview Results</h1>
            <p className="text-slate-600">View and manage detailed candidate assessment outcomes</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Total Candidates</p>
              <p className="text-2xl font-bold text-slate-800">{results.length}</p>
            </div>
            <Users className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Passed</p>
              <p className="text-2xl font-bold text-green-600">
                {results.filter(r => r.status.toLowerCase() === 'passed').length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">Average Score</p>
              <p className="text-2xl font-bold text-slate-800">
                {results.length > 0 ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length) : 0}
              </p>
            </div>
            <Trophy className="w-8 h-8 text-yellow-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600">AI Detected</p>
              <p className="text-2xl font-bold text-red-600">
                {results.filter(r => r.ai_detection).length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Detailed Interview Results</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Candidate</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Position</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Date</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Overall Score</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Status</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">AI Detection</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-slate-700">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((result) => (
                <React.Fragment key={result.id}>
                  <tr className="hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-slate-800">{result.name}</div>
                        <div className="text-sm text-slate-600">{result.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-700">{result.position}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(result.date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${getScoreColor(result.score)}`}>
                        {result.score}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(result.status)}`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {result.ai_detection ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertTriangle className="w-4 h-4" />
                          <span className="text-sm font-medium">Detected</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Clean</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleRowExpansion(result.id)}
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                        {expandedRow === result.id ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                  
                  {/* Expanded Details Row */}
                  {expandedRow === result.id && (
                    <tr>
                      <td colSpan={7} className="px-4 py-6 bg-slate-50">
                        <div className="space-y-6">
                          {/* Skill Breakdown */}
                          <div>
                            <h4 className="text-sm font-semibold text-slate-800 mb-3">Skill Breakdown</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Technical</div>
                                <div className={`text-lg font-bold ${getScoreColor(result.technical_score || 0)}`}>
                                  {result.technical_score || 'N/A'}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Problem Solving</div>
                                <div className={`text-lg font-bold ${getScoreColor(result.problem_solving_score || 0)}`}>
                                  {result.problem_solving_score || 'N/A'}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Communication</div>
                                <div className={`text-lg font-bold ${getScoreColor(result.communication_score || 0)}`}>
                                  {result.communication_score || 'N/A'}
                                </div>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-slate-200">
                                <div className="text-xs text-slate-600 mb-1">Documentation</div>
                                <div className={`text-lg font-bold ${getScoreColor(result.documentation_score || 0)}`}>
                                  {result.documentation_score || 'N/A'}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Notes */}
                          {result.notes && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-800 mb-2">Notes</h4>
                              <div className="bg-white rounded-lg p-3 border border-slate-200">
                                <p className="text-sm text-slate-700">{result.notes}</p>
                              </div>
                            </div>
                          )}

                          {/* Question Details */}
                          {result.questions && result.questions.length > 0 && (
                            <div>
                              <h4 className="text-sm font-semibold text-slate-800 mb-3">Question Breakdown</h4>
                              <div className="space-y-3">
                                {result.questions.map((question, index) => (
                                  <div 
                                    key={question.id || index} 
                                    className={`bg-white rounded-lg p-4 border ${
                                      question.aiDetected ? 'border-red-200 bg-red-50' : 'border-slate-200'
                                    }`}
                                  >
                                    <div className="flex justify-between items-start mb-2">
                                      <h5 className="text-sm font-medium text-slate-800">Question {index + 1}</h5>
                                      <div className="flex items-center gap-2">
                                        {question.aiDetected && (
                                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                                            AI Detected
                                          </span>
                                        )}
                                        <span className={`text-sm font-bold ${getScoreColor(question.score)}`}>
                                          {question.score}/100
                                        </span>
                                      </div>
                                    </div>
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-xs font-medium text-slate-600">Question:</span>
                                        <p className="text-sm text-slate-700">{question.question}</p>
                                      </div>
                                      <div>
                                        <span className="text-xs font-medium text-slate-600">Answer:</span>
                                        <p className="text-sm text-slate-700">{question.answer}</p>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {results.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No candidate results found</p>
          </div>
        )}
      </div>
    </div>
  );
};
