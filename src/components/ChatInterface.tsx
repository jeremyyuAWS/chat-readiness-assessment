import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, BarChart3 } from 'lucide-react';
import ChatMessage from './ChatMessage';
import MultiChoiceInput from './MultiChoiceInput';
import { agentMessages, agentRespond, Recommendation } from '../utils/agentSimulator';
import RecommendationsPanel from './RecommendationsPanel';
import { useTracking } from '../context/TrackingContext';
import PulsatingTipButton from './PulsatingTipButton';
import TypewriterText from './TypewriterText';

interface ChatInterfaceProps {
  onClose: () => void;
}

export type MessageType = {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  choices?: string[];
  responseType?: 'text' | 'multiChoice';
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<Date | null>(null);
  const [dwellTimeTracking, setDwellTimeTracking] = useState(true);
  const [totalDwellTime, setTotalDwellTime] = useState(0);
  const [useTypewriter, setUseTypewriter] = useState(true);
  const [currentTypewriterMessage, setCurrentTypewriterMessage] = useState<MessageType | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { startSession, endSession, addInteraction } = useTracking();

  // Start the conversation and tracking session
  useEffect(() => {
    const firstMessage = agentMessages[0];
    setIsTyping(true);
    
    // Start analytics tracking session
    const newSessionId = startSession(document.referrer);
    setSessionId(newSessionId);
    setLastInteractionTime(new Date());
    
    const timer = setTimeout(() => {
      const newMessage = {
        id: '1',
        content: firstMessage.content,
        sender: 'agent' as const,
        responseType: firstMessage.responseType,
        choices: firstMessage.choices
      };
      
      setMessages([newMessage]);
      if (useTypewriter) {
        setCurrentTypewriterMessage(newMessage);
      }
      setIsTyping(false);
      setCurrentStep(1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Track dwell time
  useEffect(() => {
    if (!dwellTimeTracking || !lastInteractionTime) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const dwellTimeSinceLastInteraction = now.getTime() - lastInteractionTime.getTime();
      
      // Cap dwell time tracking at 30 seconds of inactivity to avoid inflating numbers
      if (dwellTimeSinceLastInteraction < 30000) {
        setTotalDwellTime(prev => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dwellTimeTracking, lastInteractionTime]);

  // End the session when component unmounts if not completed
  useEffect(() => {
    return () => {
      if (sessionId && !showRecommendations) {
        endSession(sessionId, userProfile, false);
      }
    };
  }, [sessionId, showRecommendations, userProfile]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateUserInteraction = () => {
    setLastInteractionTime(new Date());
  };

  const handleSendMessage = () => {
    if (inputText.trim() === '') return;
    
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content: inputText,
      sender: 'user'
    };
    
    updateUserInteraction();
    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);
    
    // Track question answered
    addInteraction('question_answered', { 
      questionIndex: currentStep, 
      answer: inputText,
      dwellTimeBefore: totalDwellTime
    });
    
    // Simulate agent thinking
    setTimeout(() => {
      const response = agentRespond(inputText, currentStep, userProfile);
      if (response.final) {
        setRecommendations(response.recommendations || []);
        setShowRecommendations(true);
        
        // Track recommendation view and complete session
        addInteraction('recommendation_viewed', {
          totalQuestionsAnswered: currentStep,
          totalDwellTime
        });
        
        if (sessionId) {
          endSession(sessionId, userProfile, true);
        }
      } else {
        const newAgentMessage = {
          id: Date.now().toString(),
          content: response.content,
          sender: 'agent' as const,
          responseType: response.responseType,
          choices: response.choices
        };
        
        if (useTypewriter && !response.responseType) {
          setCurrentTypewriterMessage(newAgentMessage);
        }
        
        setMessages(prev => [...prev, newAgentMessage]);
        
        // Update user profile if response has tags
        if (response.tag && response.value) {
          setUserProfile(prev => ({
            ...prev,
            [response.tag]: response.value
          }));
        }
        
        setCurrentStep(currentStep + 1);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleChoiceSelect = (choice: string) => {
    const newMessage: MessageType = {
      id: Date.now().toString(),
      content: choice,
      sender: 'user'
    };
    
    updateUserInteraction();
    setMessages(prev => [...prev, newMessage]);
    setIsTyping(true);
    
    // Track question answered
    addInteraction('question_answered', { 
      questionIndex: currentStep, 
      answer: choice,
      dwellTimeBefore: totalDwellTime
    });
    
    // Simulate agent thinking
    setTimeout(() => {
      const response = agentRespond(choice, currentStep, userProfile);
      
      if (response.final) {
        setRecommendations(response.recommendations || []);
        setShowRecommendations(true);
        
        // Track recommendation view and complete session
        addInteraction('recommendation_viewed', {
          totalQuestionsAnswered: currentStep,
          totalDwellTime
        });
        
        if (sessionId) {
          endSession(sessionId, userProfile, true);
        }
      } else {
        const newAgentMessage = {
          id: Date.now().toString(),
          content: response.content,
          sender: 'agent' as const,
          responseType: response.responseType,
          choices: response.choices
        };
        
        if (useTypewriter && !response.responseType) {
          setCurrentTypewriterMessage(newAgentMessage);
        }
        
        setMessages(prev => [...prev, newAgentMessage]);
        
        // Update user profile if response has tags
        if (response.tag && response.value) {
          setUserProfile(prev => ({
            ...prev,
            [response.tag]: response.value
          }));
        }
        
        setCurrentStep(currentStep + 1);
      }
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClose = () => {
    // Track session end before closing
    if (sessionId && !showRecommendations) {
      endSession(sessionId, userProfile, false);
    }
    onClose();
  };
  
  const handleMessageReaction = (reaction: 'helpful' | 'not-helpful') => {
    addInteraction('message_reaction', { reaction });
  };
  
  const handleTypewriterComplete = () => {
    setCurrentTypewriterMessage(null);
  };

  const renderMessage = (message: MessageType) => {
    // If this message is currently being typewritten, render the typewriter component
    if (useTypewriter && currentTypewriterMessage && currentTypewriterMessage.id === message.id) {
      return (
        <ChatMessage
          key={message.id}
          message={{
            ...message,
            content: '' // This will be empty since we're using the typewriter component
          }}
          onChoiceSelect={handleChoiceSelect}
          onReaction={handleMessageReaction}
        >
          <TypewriterText 
            text={message.content} 
            delay={20} 
            onComplete={handleTypewriterComplete}
            className={`whitespace-pre-wrap ${message.responseType === 'multiChoice' ? 'font-medium' : ''}`}
          />
        </ChatMessage>
      );
    }
    
    // Otherwise render the regular message
    return (
      <ChatMessage 
        key={message.id}
        message={message}
        onChoiceSelect={handleChoiceSelect}
        onReaction={handleMessageReaction}
      />
    );
  };

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full md:w-96 h-[600px] md:h-[650px] md:mb-6 md:mr-6 bg-white rounded-t-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
      {/* Chat Header */}
      <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
        <div className="flex items-center">
          <div className="bg-white rounded-full p-1.5 mr-3">
            <div className="bg-indigo-600 rounded-full w-7 h-7 flex items-center justify-center">
              <span className="text-white font-bold">L</span>
            </div>
          </div>
          <div>
            <h3 className="font-bold">Lyzr AI Navigator</h3>
            <p className="text-xs text-indigo-100">
              {isTyping ? 'Typing...' : 'Your AI readiness guide'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {currentStep > 1 && !showRecommendations && (
            <div className="bg-indigo-500 hover:bg-indigo-400 rounded-md p-2 cursor-pointer transition-colors">
              <BarChart3 className="h-4 w-4" />
            </div>
          )}
          <button 
            onClick={handleClose}
            className="text-white hover:text-indigo-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="h-1 bg-gray-100 w-full">
        <div 
          className="h-full bg-indigo-500 transition-all duration-300"
          style={{ width: `${Math.min((currentStep / 6) * 100, 100)}%` }}
        ></div>
      </div>
      
      {showRecommendations ? (
        <RecommendationsPanel recommendations={recommendations} />
      ) : (
        <>
          {/* Messages Container */}
          <div 
            className="flex-1 p-4 overflow-y-auto bg-gray-50"
            onMouseMove={updateUserInteraction}
            onClick={updateUserInteraction}
            onKeyDown={updateUserInteraction}
            onScroll={updateUserInteraction}
          >
            {messages.map(message => renderMessage(message))}
            
            {isTyping && (
              <div className="flex items-center mb-4">
                <div className="bg-indigo-600 rounded-full p-1.5 mr-3">
                  <div className="bg-white rounded-full w-7 h-7 flex items-center justify-center">
                    <span className="text-indigo-600 font-bold">L</span>
                  </div>
                </div>
                <div className="bg-white p-3 rounded-xl rounded-tl-none shadow-sm max-w-[80%]">
                  <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Pulsating Tip Button */}
          <PulsatingTipButton currentStep={currentStep} />
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-20"
                rows={1}
                disabled={isTyping || messages[messages.length - 1]?.responseType === 'multiChoice' || !!currentTypewriterMessage}
              />
              <button
                onClick={handleSendMessage}
                disabled={isTyping || inputText.trim() === '' || messages[messages.length - 1]?.responseType === 'multiChoice' || !!currentTypewriterMessage}
                className={`bg-indigo-600 p-3 rounded-r-lg ${
                  isTyping || inputText.trim() === '' || messages[messages.length - 1]?.responseType === 'multiChoice' || !!currentTypewriterMessage
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-indigo-700'
                }`}
              >
                <Send className="h-5 w-5 text-white" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {currentStep === 1 ? (
                "This is a demo of Lyzr's AI agent capabilities. AI recommendations are for demonstration purposes."
              ) : currentStep >= 4 ? (
                "Almost there! Your personalized AI recommendations will be ready soon."
              ) : (
                "This short assessment helps us understand your AI readiness."
              )}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatInterface;