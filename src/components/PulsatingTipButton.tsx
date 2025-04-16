import React, { useState, useEffect } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface TipData {
  id: string;
  text: string;
}

const tips: TipData[] = [
  {
    id: 'tip1',
    text: 'Being specific about your AI goals helps us provide more accurate recommendations.'
  },
  {
    id: 'tip2',
    text: 'The AI uses your industry context to find the most relevant use cases for your business.'
  },
  {
    id: 'tip3',
    text: 'The detailed information you share will help tailor ROI estimates and implementation timelines.'
  },
  {
    id: 'tip4',
    text: 'Completing all questions unlocks the most comprehensive recommendations and resources.'
  },
  {
    id: 'tip5',
    text: 'Share your results with colleagues to align your AI strategy across teams.'
  }
];

interface PulsatingTipButtonProps {
  currentStep: number;
}

const PulsatingTipButton: React.FC<PulsatingTipButtonProps> = ({ currentStep }) => {
  const [showTip, setShowTip] = useState(false);
  const [currentTip, setCurrentTip] = useState<TipData>(tips[0]);
  const [dismissed, setDismissed] = useState(false);
  
  // Change tip based on current step
  useEffect(() => {
    if (currentStep < tips.length) {
      setCurrentTip(tips[currentStep]);
    } else {
      // Cycle through tips
      setCurrentTip(tips[currentStep % tips.length]);
    }
  }, [currentStep]);
  
  // Pulsate and show tip automatically after 5 seconds if not at first step
  useEffect(() => {
    if (currentStep > 0 && !dismissed) {
      const timer = setTimeout(() => {
        setShowTip(true);
        
        // Auto-hide after 8 seconds
        const hideTimer = setTimeout(() => {
          setShowTip(false);
        }, 8000);
        
        return () => clearTimeout(hideTimer);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, dismissed]);
  
  const handleDismiss = () => {
    setShowTip(false);
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-24 right-6 z-40">
      {showTip && (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-indigo-100 mb-3 max-w-xs animate-fade-in relative">
          <button 
            onClick={handleDismiss} 
            className="absolute -top-2 -right-2 bg-gray-100 rounded-full p-1 text-gray-500 hover:text-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
          <div className="flex">
            <div className="bg-indigo-100 p-1.5 rounded-full mr-2 flex-shrink-0">
              <Lightbulb className="h-4 w-4 text-indigo-600" />
            </div>
            <p className="text-xs text-gray-700">{currentTip.text}</p>
          </div>
        </div>
      )}
      
      <button 
        onClick={() => setShowTip(!showTip)}
        className={`bg-white shadow-lg border border-indigo-100 rounded-full p-3 hover:bg-indigo-50 transition-all ${
          !showTip && !dismissed ? 'animate-pulse-soft' : ''
        }`}
      >
        <Lightbulb className="h-5 w-5 text-indigo-600" />
      </button>
    </div>
  );
};

export default PulsatingTipButton;