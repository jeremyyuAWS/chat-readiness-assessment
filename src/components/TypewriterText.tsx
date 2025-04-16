import React, { useState, useEffect } from 'react';

interface TypewriterTextProps {
  text: string;
  delay?: number;
  onComplete?: () => void;
  className?: string;
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  delay = 30, 
  onComplete, 
  className = ''
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, delay);
      
      return () => clearTimeout(timeout);
    } else if (!isComplete) {
      setIsComplete(true);
      if (onComplete) onComplete();
    }
  }, [currentIndex, delay, isComplete, onComplete, text]);

  // Reset when text changes
  useEffect(() => {
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  // Highlight key metrics, numbers, and important terms
  const highlightedText = displayText.replace(
    /(\d+%|\d+x|increase|decrease|reduce|improve|ROI|save|faster|better|efficient)/gi,
    match => `<span class="text-indigo-600 font-semibold">${match}</span>`
  );

  return (
    <p 
      className={className} 
      dangerouslySetInnerHTML={{ __html: highlightedText }}
    ></p>
  );
};

export default TypewriterText;