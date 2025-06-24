
import { useState } from 'react';

export interface CopyPasteDetection {
  isPasted: boolean;
  pasteTimestamp: Date | null;
  originalLength: number;
  pastedLength: number;
  isLikelyAI: boolean;
  aiConfidence: number;
}

export const useCopyPasteDetection = () => {
  const [detectionResult, setDetectionResult] = useState<CopyPasteDetection | null>(null);

  // AI-generated text patterns to detect
  const detectAIPatterns = (text: string): { isLikelyAI: boolean; confidence: number } => {
    const aiIndicators = [
      // Common AI phrases
      /\b(I would recommend|best practices include|it's important to note|furthermore|moreover|additionally)\b/gi,
      /\b(in conclusion|to summarize|overall|in summary)\b/gi,
      /\b(comprehensive|systematic|methodical|strategic|optimal)\b/gi,
      
      // Perfect structure patterns
      /^\d+\.\s.*\n\d+\.\s/gm, // Numbered lists
      /^-\s.*\n-\s/gm, // Bullet points
      /\*\*.*\*\*/g, // Bold markdown
      /^#{1,6}\s/gm, // Headers
      
      // Overly formal language
      /\b(utilize|facilitate|implement|establish|maintain|ensure|demonstrate)\b/gi,
      /\b(consequently|therefore|thus|hence|accordingly)\b/gi,
      
      // Generic technical phrases
      /\b(industry standards|best practices|cutting-edge|state-of-the-art|robust solution)\b/gi,
      /\b(scalable|efficient|effective|optimized|streamlined)\b/gi,
    ];

    let matchCount = 0;
    let totalMatches = 0;

    aiIndicators.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matchCount++;
        totalMatches += matches.length;
      }
    });

    // Additional checks for AI characteristics
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const avgSentenceLength = sentences.reduce((sum, s) => sum + s.length, 0) / sentences.length;
    
    // AI tends to write longer, more structured sentences
    const longSentenceBonus = avgSentenceLength > 80 ? 0.2 : 0;
    
    // Check for perfect grammar (no common typos or informal language)
    const hasTypos = /\b(ur|u|cant|dont|wont|shouldnt|couldnt)\b/gi.test(text);
    const perfectGrammarBonus = !hasTypos && text.length > 100 ? 0.1 : 0;
    
    // Check for overly comprehensive coverage
    const comprehensiveBonus = text.length > 500 && sentences.length > 5 ? 0.15 : 0;

    const baseConfidence = Math.min((matchCount / aiIndicators.length) * 0.6 + (totalMatches / 20) * 0.4, 1);
    const finalConfidence = Math.min(baseConfidence + longSentenceBonus + perfectGrammarBonus + comprehensiveBonus, 1);

    return {
      isLikelyAI: finalConfidence > 0.3,
      confidence: Math.round(finalConfidence * 100)
    };
  };

  const handlePasteEvent = (originalText: string, pastedText: string, fullText: string) => {
    const pasteTimestamp = new Date();
    const originalLength = originalText.length;
    const pastedLength = pastedText.length;
    
    // Only analyze if significant amount of text was pasted
    if (pastedLength > 50) {
      const aiAnalysis = detectAIPatterns(pastedText);
      
      const detection: CopyPasteDetection = {
        isPasted: true,
        pasteTimestamp,
        originalLength,
        pastedLength,
        isLikelyAI: aiAnalysis.isLikelyAI,
        aiConfidence: aiAnalysis.confidence
      };

      console.log('Copy-paste detection result:', detection);
      setDetectionResult(detection);
      
      return detection;
    }

    return null;
  };

  const resetDetection = () => {
    setDetectionResult(null);
  };

  return {
    detectionResult,
    handlePasteEvent,
    resetDetection,
    detectAIPatterns
  };
};
