import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface MultiChoiceInputProps {
  choices: string[];
  onSelect: (choice: string) => void;
  disabled?: boolean;
  isEmbedded?: boolean;
}

const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({ 
  choices, 
  onSelect, 
  disabled = false,
  isEmbedded = false
}) => {
  return (
    <div className={`grid grid-cols-1 gap-2 ${isEmbedded ? 'mt-3' : 'mt-2'}`}>
      {choices.map((choice, index) => {
        const isFirst = index === 0;
        
        // Extract any key terms or focus from the choice text
        const parts = choice.split(' - ');
        const mainText = parts[0];
        const description = parts.length > 1 ? parts[1] : null;
        
        return (
          <button
            key={index}
            onClick={() => onSelect(choice)}
            disabled={disabled}
            className={`relative text-left transition-all duration-200 ease-in-out ${
              isEmbedded
                ? `p-3 rounded-lg border ${isFirst ? 'border-indigo-300 bg-indigo-50' : 'border-indigo-200'} 
                   hover:bg-indigo-100 hover:border-indigo-400 text-indigo-800 
                   ${isFirst ? 'ring-2 ring-indigo-200' : ''}`
                : `px-4 py-3 rounded-lg border border-indigo-300 
                   hover:bg-indigo-50 text-indigo-700 
                   ${isFirst ? 'bg-indigo-50' : 'bg-white'}`
            } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">{mainText}</span>
                {description && (
                  <p className={`text-sm mt-0.5 ${isEmbedded ? 'text-indigo-600/80' : 'text-gray-500'}`}>
                    {description}
                  </p>
                )}
              </div>
              <ChevronRight className={`h-4 w-4 ${isEmbedded ? 'text-indigo-500' : 'text-indigo-400'}`} />
            </div>
            
            {isFirst && (
              <div className="absolute -top-2 -right-2 bg-indigo-600 rounded-full p-0.5 shadow-sm">
                <div className="bg-white rounded-full w-4 h-4 flex items-center justify-center">
                  <Check className="h-3 w-3 text-indigo-600" />
                </div>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
};

export default MultiChoiceInput;