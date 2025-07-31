import React from 'react';

interface MarkdownMessageProps {
  content: string;
}

export const MarkdownMessage: React.FC<MarkdownMessageProps> = ({ content }) => {
  // Parse the markdown content and render it with proper styling
  const parseMarkdown = (text: string) => {
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let key = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip empty lines but add spacing
      if (line.trim() === '') {
        elements.push(<div key={key++} className="h-3" />);
        continue;
      }

      // Headers (##, ###, etc.)
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={key++} className="text-sm font-bold text-slate-800 mt-3 mb-2">
            {line.substring(4)}
          </h3>
        );
      } else if (line.startsWith('## ')) {
        elements.push(
          <h2 key={key++} className="text-base font-bold text-slate-800 mt-4 mb-2">
            {line.substring(3)}
          </h2>
        );
      } else if (line.startsWith('# ')) {
        elements.push(
          <h1 key={key++} className="text-lg font-bold text-slate-800 mt-4 mb-3">
            {line.substring(2)}
          </h1>
        );
      }
      // Bold text with ** and bullet points
      else if (line.includes('**') || line.startsWith('• ') || line.startsWith('⏰')) {
        elements.push(
          <div key={key++} className="text-sm text-slate-700 leading-relaxed mb-1">
            {formatInlineMarkdown(line)}
          </div>
        );
      }
      // Question format
      else if (line.startsWith('**Question ')) {
        elements.push(
          <div key={key++} className="mt-4 mb-3 p-3 bg-slate-50 border-l-4 border-blue-500 rounded-r-lg">
            <div className="font-semibold text-slate-800 text-sm">
              {formatInlineMarkdown(line)}
            </div>
          </div>
        );
      }
      // Regular paragraphs
      else {
        elements.push(
          <p key={key++} className="text-sm text-slate-700 leading-relaxed mb-2">
            {formatInlineMarkdown(line)}
          </p>
        );
      }
    }

    return elements;
  };

  const formatInlineMarkdown = (text: string) => {
    const parts = [];
    let currentIndex = 0;
    let key = 0;

    // Handle bold text **text**
    const boldRegex = /\*\*(.*?)\*\*/g;
    let match;

    while ((match = boldRegex.exec(text)) !== null) {
      // Add text before the bold
      if (match.index > currentIndex) {
        parts.push(
          <span key={key++}>
            {text.substring(currentIndex, match.index)}
          </span>
        );
      }
      
      // Add the bold text
      parts.push(
        <strong key={key++} className="font-bold text-slate-800">
          {match[1]}
        </strong>
      );
      
      currentIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (currentIndex < text.length) {
      parts.push(
        <span key={key++}>
          {text.substring(currentIndex)}
        </span>
      );
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div className="prose prose-slate max-w-none">
      <div className="space-y-1">
        {parseMarkdown(content)}
      </div>
    </div>
  );
};