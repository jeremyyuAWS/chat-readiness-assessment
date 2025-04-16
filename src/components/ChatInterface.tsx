import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2, BarChart3, Play, Pause } from 'lucide-react';
import ChatMessage from './ChatMessage';
import MultiChoiceInput from './MultiChoiceInput';
import { agentMessages, agentRespond, Recommendation, DEMO_MODE_RESPONSES } from '../utils/agentSimulator';
import RecommendationsPanel from './RecommendationsPanel';
import { useTracking, InteractionType } from '../context/TrackingContext';
import TypewriterText from './TypewriterText';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  choices?: string[];
  responseType?: 'text' | 'multiChoice';
}

interface ChatInterfaceProps {
  onClose: () => void;
}

interface ChatMessageProps {
  message: Message;
  onChoiceSelect: (choice: string) => void;
  onReaction: (reaction: 'helpful' | 'not-helpful') => void;
  children?: React.ReactNode;
}

// Add helper function for calculating typing time
const calculateTypingDelay = (text: string, isAgent: boolean) => {
  // Different typing speeds for agent vs user (characters per minute)
  const typingSpeed = isAgent ? 800 : 300;
  // Different minimum delays for agent vs user
  const minDelay = isAgent ? 500 : 1000;
  // Calculate delay based on message length (convert speed to ms)
  const delay = Math.max(minDelay, (text.length / typingSpeed) * 60 * 1000);
  // Add some randomness (±20% for users, ±10% for agent)
  const variance = delay * (isAgent ? 0.1 : 0.2);
  return delay + (Math.random() * variance * 2 - variance);
};

// Add new interface for demo mode
interface DemoModeState {
  isAuto: boolean;
  isActive: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ onClose }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [conversationStep, setConversationStep] = useState(0);
  const [userProfile, setUserProfile] = useState<Record<string, string>>({});
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [lastInteractionTime, setLastInteractionTime] = useState<Date | null>(null);
  const [dwellTimeTracking] = useState(true);
  const [totalDwellTime, setTotalDwellTime] = useState(0);
  const [useTypewriter] = useState(true);
  const [currentTypewriterMessage, setCurrentTypewriterMessage] = useState<Message | null>(null);
  const [demoMode, setDemoMode] = useState<DemoModeState>({ isAuto: true, isActive: true });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addInteraction, startSession, endSession } = useTracking();

  // Start the conversation and tracking session
  useEffect(() => {
    const newSessionId = startSession(document.referrer);
    setSessionId(newSessionId);
    setLastInteractionTime(new Date());
    
    // Initiate conversation with first agent message
    setIsTyping(true);
    
    const timer = setTimeout(() => {
      const response = agentRespond('', 0, {}, demoMode.isActive);
      const newMessage: Message = {
        id: Date.now(),
        content: response.content,
        sender: 'agent',
        timestamp: new Date(),
        choices: response.choices,
        responseType: response.responseType || 'text'
      };
      
      setMessages([newMessage]);
      if (useTypewriter) {
        setCurrentTypewriterMessage(newMessage);
      }
      setIsTyping(false);
      setConversationStep(1);

      // In demo mode, automatically send the first user response after a delay
      if (demoMode.isActive) {
        const demoResponse = DEMO_MODE_RESPONSES[1];
        setTimeout(() => {
          handleDemoResponse(demoResponse.answer, 1);
        }, demoResponse.delay);
      }
    }, 2000); // Increased initial delay
    
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
        setTotalDwellTime((prev: number) => prev + 1);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [dwellTimeTracking, lastInteractionTime]);

  // End the session when component unmounts if not completed
  useEffect(() => {
    return () => {
      if (sessionId && !showRecommendations) {
        endSession('complete');
      }
    };
  }, [sessionId, showRecommendations, endSession]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const updateUserInteraction = () => {
    setLastInteractionTime(new Date());
  };

  // Add toggle handler
  const toggleDemoMode = () => {
    setDemoMode(prev => ({ ...prev, isAuto: !prev.isAuto }));
  };

  // Update handleDemoResponse to respect manual mode
  const handleDemoResponse = (answer: string, step: number) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      content: answer,
      sender: 'user',
      timestamp: new Date(),
      responseType: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Add a small delay before showing typing indicator
    setTimeout(() => {
      setIsTyping(true);
    }, 300);

    // Track user message
    addInteraction('question_answered' as InteractionType, {
      message: answer,
      step: step
    });

    // Get agent response
    const response = agentRespond(answer, step, userProfile, demoMode.isActive);
    
    const typingDelay = calculateTypingDelay(response.content, true);
    
    setTimeout(() => {
      const agentMessage: Message = {
        id: Date.now(),
        content: response.content,
        sender: 'agent',
        timestamp: new Date(),
        choices: response.choices,
        responseType: response.responseType
      };
      
      setMessages(prev => [...prev, agentMessage]);
      if (useTypewriter) {
        setCurrentTypewriterMessage(agentMessage);
      }
      setIsTyping(false);
      
      if (response.final) {
        setShowRecommendations(true);
      } else {
        setConversationStep(prev => prev + 1);
        
        // Only auto-proceed if in auto demo mode
        if (demoMode.isAuto && demoMode.isActive && DEMO_MODE_RESPONSES[step + 1]) {
          const nextResponse = DEMO_MODE_RESPONSES[step + 1];
          setTimeout(() => {
            handleDemoResponse(nextResponse.answer, step + 1);
          }, nextResponse.delay + 500);
        }
      }
      
      if (response.tag && response.value) {
        const tag = response.tag as string;
        setUserProfile(prev => ({
          ...prev,
          [tag]: response.value as string
        }));
      }
      
      if (response.recommendations) {
        setRecommendations(response.recommendations);
      }
    }, typingDelay);
  };

  // Add manual demo response handler
  const handleManualDemoStep = () => {
    if (!demoMode.isActive || isTyping) return;
    const nextStep = conversationStep;
    if (DEMO_MODE_RESPONSES[nextStep]) {
      handleDemoResponse(DEMO_MODE_RESPONSES[nextStep].answer, nextStep);
    }
  };

  const handleSendMessage = () => {
    if (!input.trim() || isTyping) return;

    if (demoMode.isActive) {
      // In demo mode, ignore manual input and use pre-written responses
      return;
    }

    // Regular message handling for non-demo mode
    const userMessage: Message = {
      id: Date.now(),
      content: input,
      sender: 'user',
      timestamp: new Date(),
      responseType: 'text'
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    
    // Add a small delay before showing typing indicator
    setTimeout(() => {
      setIsTyping(true);
    }, 300); // Reduced from 500ms

    // Get agent response
    const response = agentRespond(input, conversationStep, userProfile);
    
    // Calculate typing delay based on message length - faster for agent
    const typingDelay = calculateTypingDelay(response.content, true);
    
    // Show typing indicator for a realistic duration
    setTimeout(() => {
      const agentMessage: Message = {
        id: Date.now(),
        content: response.content,
        sender: 'agent',
        timestamp: new Date(),
        choices: response.choices,
        responseType: response.responseType || 'text'
      };
      
      setMessages(prev => [...prev, agentMessage]);
      if (useTypewriter) {
        setCurrentTypewriterMessage(agentMessage);
      }
      setIsTyping(false);
      
      // Update conversation state
      if (response.final) {
        setShowRecommendations(true);
      } else {
        setConversationStep(prev => prev + 1);
      }
      
      // Update user profile if response contains a tag
      if (response.tag && response.value) {
        const tag = response.tag as string;
        setUserProfile(prev => ({
          ...prev,
          [tag]: response.value as string
        }));
      }
      
      // Store recommendations if provided
      if (response.recommendations) {
        setRecommendations(response.recommendations);
      }
    }, typingDelay);
  };

  const handleChoiceSelect = (choice: string) => {
    if (isTyping) return;
    setInput(choice);
    handleSendMessage();
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
      endSession('complete');
    }
    onClose();
  };
  
  const handleMessageReaction = (reaction: 'helpful' | 'not-helpful') => {
    addInteraction('message_reaction' as InteractionType, { reaction });
  };
  
  const handleTypewriterComplete = () => {
    setCurrentTypewriterMessage(null);
  };

  const renderMessage = (message: Message) => {
    if (useTypewriter && currentTypewriterMessage && currentTypewriterMessage.id === message.id) {
      return (
        <ChatMessage
          key={message.id}
          message={message}
          onChoiceSelect={handleChoiceSelect}
          onReaction={handleMessageReaction}
        >
          <TypewriterText 
            text={message.content} 
            delay={20} 
            onComplete={handleTypewriterComplete}
            className={`whitespace-pre-wrap ${message.choices ? 'font-medium' : ''}`}
          />
        </ChatMessage>
      );
    }
    
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
          {demoMode.isActive && (
            <button
              onClick={toggleDemoMode}
              className="bg-indigo-500 hover:bg-indigo-400 rounded-md p-2 cursor-pointer transition-colors flex items-center"
              title={demoMode.isAuto ? "Switch to manual mode" : "Switch to auto mode"}
            >
              {demoMode.isAuto ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4" />
              )}
            </button>
          )}
          {conversationStep > 1 && !showRecommendations && (
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
          style={{ width: `${Math.min((conversationStep / 6) * 100, 100)}%` }}
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
          
          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder={demoMode.isActive && !demoMode.isAuto ? "Click 'Next' to proceed with demo" : "Type your message..."}
                className="flex-1 border border-gray-300 rounded-l-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none max-h-20"
                rows={1}
                disabled={isTyping || (messages[messages.length - 1]?.responseType === 'multiChoice') || demoMode.isActive}
              />
              {demoMode.isActive && !demoMode.isAuto ? (
                <button
                  onClick={handleManualDemoStep}
                  disabled={isTyping}
                  className={`bg-indigo-600 px-6 py-3 rounded-r-lg ${
                    isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
                  }`}
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSendMessage}
                  disabled={isTyping || input.trim() === '' || (messages[messages.length - 1]?.responseType === 'multiChoice')}
                  className={`bg-indigo-600 p-3 rounded-r-lg ${
                    isTyping || input.trim() === '' || (messages[messages.length - 1]?.responseType === 'multiChoice')
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-indigo-700'
                  }`}
                >
                  <Send className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {demoMode.isActive && !demoMode.isAuto ? (
                "Manual demo mode - Click 'Next' to proceed through the demo"
              ) : conversationStep === 1 ? (
                "This is a demo of Lyzr's AI agent capabilities. AI recommendations are for demonstration purposes."
              ) : conversationStep >= 4 ? (
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