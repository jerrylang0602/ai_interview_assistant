
import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  disabled, 
  placeholder = "Type your message..." 
}) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
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

  return (
    <form onSubmit={handleSubmit} className="p-6">
      <div className="flex items-end gap-4 max-w-5xl mx-auto">
        <div className="flex-1 relative">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyPress}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full px-6 py-4 pr-24 rounded-3xl border-2 border-slate-200 focus:border-blue-300 focus:ring-4 focus:ring-blue-100 resize-none outline-none transition-all duration-200 bg-white shadow-sm text-slate-800 placeholder-slate-400 min-h-[60px] max-h-[120px] disabled:opacity-50 disabled:cursor-not-allowed hover:border-slate-300"
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
            </span>
            <span className="text-xs text-slate-400">
              Press Shift+Enter to send, Enter for new line
            </span>
          </div>
        </div>
        
        <Button
          type="submit"
          disabled={!message.trim() || disabled}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-3xl px-8 py-4 h-[60px] transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg font-semibold min-w-[120px]"
        >
          {disabled ? (
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
