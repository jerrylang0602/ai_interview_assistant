
import { QuestionAnswer } from '../types/interview';

export interface MetricAnalysis {
  technicalAccuracy: number;
  problemSolving: number;
  communication: number;
  documentation: number;
  overallScore: number;
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3';
  aiDetected: boolean;
  aiDetectedCount: number;
  totalQuestions: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export const analyzeInterviewMetrics = (
  answers: QuestionAnswer[],
  averageScore: number,
  overallLevel: 'Level 1' | 'Level 2' | 'Level 3'
): MetricAnalysis => {
  // Calculate average metrics
  const avgTechnicalAccuracy = answers.reduce((sum, a) => sum + a.technicalAccuracy, 0) / answers.length;
  const avgProblemSolving = answers.reduce((sum, a) => sum + a.problemSolving, 0) / answers.length;
  const avgCommunication = answers.reduce((sum, a) => sum + a.communication, 0) / answers.length;
  const avgDocumentation = answers.reduce((sum, a) => sum + a.documentation, 0) / answers.length;

  // AI Detection analysis
  const aiDetectedCount = answers.filter(a => a.aiDetected).length;
  const hasAiDetection = aiDetectedCount > 0;

  // Identify strengths (metrics above 20/25)
  const strengths: string[] = [];
  if (avgTechnicalAccuracy > 20) strengths.push('Technical Accuracy');
  if (avgProblemSolving > 20) strengths.push('Problem Solving');
  if (avgCommunication > 20) strengths.push('Communication');
  if (avgDocumentation > 20) strengths.push('Documentation');

  // Identify weaknesses (metrics below 15/25)
  const weaknesses: string[] = [];
  if (avgTechnicalAccuracy < 15) weaknesses.push('Technical Accuracy');
  if (avgProblemSolving < 15) weaknesses.push('Problem Solving');
  if (avgCommunication < 15) weaknesses.push('Communication');
  if (avgDocumentation < 15) weaknesses.push('Documentation');

  // Generate recommendations based on performance
  const recommendations: string[] = [];
  
  if (hasAiDetection) {
    recommendations.push('Assessment integrity training required');
    recommendations.push('Supervised retake recommended');
  } else {
    if (avgTechnicalAccuracy < 18) {
      recommendations.push('Focus on technical accuracy and precision in responses');
    }
    if (avgProblemSolving < 18) {
      recommendations.push('Develop structured problem-solving methodologies');
    }
    if (avgCommunication < 18) {
      recommendations.push('Improve technical communication and clarity');
    }
    if (avgDocumentation < 18) {
      recommendations.push('Enhance documentation and process-oriented approaches');
    }
    
    if (overallLevel === 'Level 3') {
      recommendations.push('Consider for senior technical roles and mentoring');
    } else if (overallLevel === 'Level 2') {
      recommendations.push('Suitable for standard MSP roles with ongoing development');
    } else {
      recommendations.push('Requires comprehensive skill development before role assignment');
    }
  }

  return {
    technicalAccuracy: Number(avgTechnicalAccuracy.toFixed(1)),
    problemSolving: Number(avgProblemSolving.toFixed(1)),
    communication: Number(avgCommunication.toFixed(1)),
    documentation: Number(avgDocumentation.toFixed(1)),
    overallScore: averageScore,
    overallLevel,
    aiDetected: hasAiDetection,
    aiDetectedCount,
    totalQuestions: answers.length,
    strengths,
    weaknesses,
    recommendations
  };
};

export const generateDynamicFeedback = (analysis: MetricAnalysis): string => {
  const { 
    overallScore, 
    overallLevel, 
    aiDetected, 
    aiDetectedCount, 
    totalQuestions,
    strengths, 
    weaknesses, 
    recommendations,
    technicalAccuracy,
    problemSolving,
    communication,
    documentation
  } = analysis;

  let feedback = `Assessment Summary & Next Steps: `;

  // AI Detection handling
  if (aiDetected) {
    feedback += `Assessment integrity was compromised with ${aiDetectedCount} out of ${totalQuestions} responses flagged as AI-generated. `;
    feedback += `This candidate is disqualified from this assessment round and requires a supervised retake with additional verification measures. `;
    return feedback;
  }

  // Performance overview
  feedback += `This candidate achieved an overall score of ${overallScore}/100 (${overallLevel}) across ${totalQuestions} technical questions. `;

  // Metric breakdown
  feedback += `Performance breakdown: Technical Accuracy (${technicalAccuracy}/25), Problem Solving (${problemSolving}/25), Communication (${communication}/25), Documentation (${documentation}/25). `;

  // Strengths analysis
  if (strengths.length > 0) {
    feedback += `Key strengths demonstrated: ${strengths.join(', ')}. `;
  }

  // Weaknesses analysis
  if (weaknesses.length > 0) {
    feedback += `Areas requiring improvement: ${weaknesses.join(', ')}. `;
  }

  // Role suitability assessment
  if (overallLevel === 'Level 3' && overallScore >= 80) {
    feedback += `This candidate demonstrates exceptional technical competencies and is highly suitable for senior MSP technician roles, team leadership, and mentoring positions. `;
    feedback += `Strong performance across all evaluation metrics indicates readiness for complex technical challenges and client-facing responsibilities. `;
  } else if (overallLevel === 'Level 2' && overallScore >= 40) {
    feedback += `This candidate shows solid technical foundation suitable for standard MSP technician roles with appropriate support and guidance. `;
    feedback += `With continued professional development, this candidate has potential to advance to senior technical positions. `;
  } else {
    feedback += `This candidate demonstrates limited technical readiness and is not currently suitable for MSP technician roles. `;
    feedback += `Significant skill gaps identified across multiple technical areas require comprehensive training and development. `;
  }

  // Specific recommendations
  if (recommendations.length > 0) {
    feedback += `Recommendations: ${recommendations.join('; ')}.`;
  }

  return feedback;
};
