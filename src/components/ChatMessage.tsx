import React, { useState, useEffect } from 'react';
import { MessageType } from './ChatInterface';
import MultiChoiceInput from './MultiChoiceInput';
import { ThumbsUp, ThumbsDown, HelpCircle, Lightbulb, Clipboard, Copy, Check, Info } from 'lucide-react';

interface ChatMessageProps {
  message: MessageType;
  onChoiceSelect: (choice: string) => void;
  onReaction?: (reaction: 'helpful' | 'not-helpful') => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, onChoiceSelect, onReaction }) => {
  const isAgent = message.sender === 'agent';
  const [showTooltip, setShowTooltip] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showReactions, setShowReactions] = useState(false);
  const [reacted, setReacted] = useState<'helpful' | 'not-helpful' | null>(null);

  // Extract any potential stats from the message
  const containsStats = isAgent && (
    message.content.includes('%') || 
    message.content.includes('increase') || 
    message.content.includes('reduce') ||
    message.content.includes('improve')
  );

  // Look for key insights or tips
  const containsInsight = isAgent && (
    message.content.includes('tip:') || 
    message.content.includes('insight:') || 
    message.content.toLowerCase().includes('consider') ||
    message.content.toLowerCase().includes('recommend')
  );

  // Detect industry-specific content
  const industries = ['healthcare', 'finance', 'retail', 'manufacturing', 'technology', 'education'];
  const containsIndustry = isAgent && industries.some(industry => 
    message.content.toLowerCase().includes(industry)
  );

  // Show reactions for longer, more substantive agent messages
  useEffect(() => {
    if (isAgent && message.content.length > 80 && !message.responseType) {
      const timer = setTimeout(() => {
        setShowReactions(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isAgent, message.content, message.responseType]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReaction = (reaction: 'helpful' | 'not-helpful') => {
    setReacted(reaction);
    if (onReaction) {
      onReaction(reaction);
    }
  };

  return (
    <div className={`flex items-start mb-5 ${isAgent ? '' : 'justify-end'} group`}>
      {isAgent && (
        <div className="bg-indigo-600 rounded-full p-1.5 mr-3 flex-shrink-0">
          <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center">
            <span className="text-indigo-600 font-bold">L</span>
          </div>
        </div>
      )}
      
      <div className={`relative p-4 rounded-xl shadow-sm max-w-[85%] ${
        isAgent 
          ? 'bg-white rounded-tl-none border border-gray-100' 
          : 'bg-indigo-600 text-white rounded-tr-none'
      }`}>
        {/* Special formatting for different types of content */}
        {containsStats && isAgent && (
          <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 shadow-sm">
            <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
              <BarChart className="h-3 w-3 text-green-500" />
            </div>
          </div>
        )}
        
        {containsInsight && isAgent && (
          <div className="absolute -top-2 -left-2 bg-yellow-500 rounded-full p-1 shadow-sm z-10">
            <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
              <Lightbulb className="h-3 w-3 text-yellow-500" />
            </div>
          </div>
        )}
        
        {containsIndustry && isAgent && (
          <div className="absolute -bottom-2 -right-2 bg-indigo-500 rounded-full p-1 shadow-sm">
            <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
              <Info className="h-3 w-3 text-indigo-500" />
            </div>
          </div>
        )}
        
        <p className={`whitespace-pre-wrap ${isAgent && message.responseType === 'multiChoice' ? 'font-medium' : ''}`}>
          {message.content}
        </p>
        
        {isAgent && message.responseType === 'multiChoice' && message.choices && (
          <div className="mt-3">
            <MultiChoiceInput 
              choices={message.choices} 
              onSelect={onChoiceSelect} 
              isEmbedded={true}
            />
          </div>
        )}
        
        {/* Copy button (only for agent messages with useful content) */}
        {isAgent && message.content.length > 50 && !message.responseType && (
          <button 
            onClick={handleCopyContent}
            className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            title="Copy content"
          >
            {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
          </button>
        )}
        
        {/* Reaction buttons */}
        {showReactions && isAgent && !message.responseType && (
          <div className="flex items-center mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
            {!reacted ? (
              <>
                <span className="mr-2">Was this helpful?</span>
                <button 
                  onClick={() => handleReaction('helpful')}
                  className="p-1 rounded-md hover:bg-gray-100 mr-1"
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => handleReaction('not-helpful')}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <ThumbsDown className="h-3.5 w-3.5" />
                </button>
              </>
            ) : (
              <span className="text-green-600 flex items-center">
                <Check className="h-3.5 w-3.5 mr-1" />
                Thanks for your feedback!
              </span>
            )}
          </div>
        )}
      </div>
      
      {!isAgent && (
        <div className="bg-gray-200 rounded-full p-1.5 ml-3 flex-shrink-0">
          <div className="bg-gray-500 rounded-full w-7 h-7 flex items-center justify-center">
            <span className="text-white font-bold">U</span>
          </div>
        </div>
      )}
      
      {/* Help tooltip that shows on hover for the first couple of messages */}
      {isAgent && message.id === '1' && (
        <div 
          className="absolute -top-10 left-16 bg-indigo-50 text-indigo-800 p-2 rounded-lg text-xs shadow-md border border-indigo-100 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center">
            <HelpCircle className="h-3.5 w-3.5 mr-1.5 text-indigo-500" />
            <span>Answer the questions to get your personalized AI readiness assessment</span>
          </div>
        </div>
      )}
    </div>
  );
};

// Add a small BarChart component
const BarChart: React.FC<{className: string}> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="20" x2="18" y2="10"></line>
    <line x1="12" y1="20" x2="12" y2="4"></line>
    <line x1="6" y1="20" x2="6" y2="14"></line>
  </svg>
);

export default ChatMessage;