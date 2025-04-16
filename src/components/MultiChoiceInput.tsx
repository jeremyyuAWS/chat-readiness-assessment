import React from 'react';
import { Check, ChevronRight } from 'lucide-react';

interface MultiChoiceInputProps {
  choices: string[];
  onSelect: (choice: string) => void;
  disabled: boolean;
  isEmbedded?: boolean;
}

const MultiChoiceInput: React.FC<MultiChoiceInputProps> = ({ choices, onSelect, disabled, isEmbedded = false }) => {
  return (
    <div className={`flex flex-col space-y-2 ${isEmbedded ? '' : 'mt-4'}`}>
      {choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => onSelect(choice)}
          disabled={disabled}
          className={`text-left px-4 py-2 rounded-lg transition-colors ${
            isEmbedded
              ? 'bg-gray-50 hover:bg-gray-100 text-gray-700'
              : 'bg-white hover:bg-gray-50 text-gray-800 border border-gray-200'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          {choice}
        </button>
      ))}
    </div>
  );
};

export default MultiChoiceInput;