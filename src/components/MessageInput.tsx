
import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useCopyPasteDetection } from '../hooks/useCopyPasteDetection';

interface MessageInputProps {
  onSendMessage: (message: string, detectionResult?: any) => void;
  disabled: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled, 
  placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState('');
  const [textBeforePaste, setTextBeforePaste] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { detectionResult, handlePasteEvent, resetDetection } = useCopyPasteDetection();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled && !isSubmitting) {
      setIsSubmitting(true);
      try {
        // Pass detection result along with the message
        await onSendMessage(message.trim(), detectionResult);
        setMessage('');
        setTextBeforePaste('');
        resetDetection();
        if (textareaRef.current) {
          textareaRef.current.style.height = 'auto';
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
    // Regular Enter key will now create a new line (default textarea behavior)
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px';
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const pastedText = e.clipboardData.getData('text');
    const currentText = textBeforePaste || message;
    
    // Store text before paste for comparison
    setTextBeforePaste(currentText);
    
    // Analyze the pasted content
    if (pastedText.length > 50) {
      setTimeout(() => {
        handlePasteEvent(currentText, pastedText, currentText + pastedText);
      }, 100);
    }
  };

  const handleFocus = () => {
    // Store current text when user focuses on textarea
    setTextBeforePaste(message);
  };

  // Determine if button should be disabled or show loading
  const isButtonDisabled = !message.trim() || disabled;
  const showLoadingState = isSubmitting && !disabled;

  return (
    <form onSubmit={handleSubmit} className="p-6">
      {/* Copy-Paste Detection Alert */}
      {detectionResult && detectionResult.isPasted && (
        <div className="max-w-5xl mx-auto mb-4">
          <Alert className={`border-2 ${
            detectionResult.isLikelyAI 
              ? 'border-red-200 bg-red-50' 
              : 'border-orange-200 bg-orange-50'
          }`}>
            <AlertTriangle className={`h-4 w-4 ${
              detectionResult.isLikelyAI ? 'text-red-600' : 'text-orange-600'
            }`} />
            <AlertDescription className={
              detectionResult.isLikelyAI ? 'text-red-800' : 'text-orange-800'
            }>
              <div className="font-medium mb-1">
                {detectionResult.isLikelyAI 
                  ? '🚨 Potential AI-Generated Response Detected' 
                  : '⚠️ Copy-Paste Activity Detected'
                }
              </div>
              <div className="text-sm">
                {detectionResult.isLikelyAI ? (
                  <>
                    This response appears to be AI-generated (Confidence: {detectionResult.aiConfidence}%). 
                    Using AI-generated content violates interview integrity guidelines. 
                    Please provide your own original response based on your experience.
                  </>
                ) : (
                  <>
                    We detected that you pasted {detectionResult.pastedLength} characters. 
                    Please ensure your response reflects your own knowledge and experience.
                  </>
                )}
              </div>
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="flex items-end gap-4 max-w-5xl mx-auto">
        <div className="flex-1 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste}
              onFocus={handleFocus}
              placeholder={placeholder}
              disabled={disabled}
              className={`w-full px-6 py-4 pr-24 rounded-3xl border-2 focus:ring-4 focus:ring-blue-100 resize-none outline-none transition-all duration-200 bg-white shadow-sm text-slate-800 placeholder-slate-400 min-h-[60px] max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300 ${
                detectionResult?.isLikelyAI 
                  ? 'border-red-300 focus:border-red-400' 
                  : detectionResult?.isPasted 
                    ? 'border-orange-300 focus:border-orange-400'
                    : 'border-slate-200 focus:border-blue-300'
              }`}
              rows={1}
            />
            
            <div className="absolute right-3 bottom-3 flex items-center gap-2">
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-100"
                disabled={disabled}
              >
                <Paperclip className="w-4 h-4" />
              </button>
              
              <button
                type="button"
                className="p-2 text-slate-400 hover:text-slate-600 transition-colors rounded-xl hover:bg-slate-100"
                disabled={disabled}
              >
                <Mic className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          {/* Updated instructions */}
          <div className="flex justify-between items-center mt-2 px-2">
            <span className="text-xs text-slate-400">
              {message.length > 0 && `${message.length} characters`}
              {detectionResult?.isPasted && (
                <span className={`ml-2 font-medium ${
                  detectionResult.isLikelyAI ? 'text-red-600' : 'text-orange-600'
                }`}>
                  {detectionResult.isLikelyAI ? 'AI Detected' : 'Paste Detected'}
                </span>
              )}
            </span>
            <span className="text-xs text-slate-400">
              Press Shift+Enter to send, Enter for new line
            </span>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={isButtonDisabled}
          className={`text-white rounded-3xl px-8 py-4 h-[60px] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg font-semibold min-w-[120px] ${
            detectionResult?.isLikelyAI
              ? 'bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'
              : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
          }`}
        >
          {showLoadingState ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Sending</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4" />
              <span>Send</span>
            </div>
          )}
        </Button>
      </div>
    </form>
  );
};
