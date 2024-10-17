import React from 'react';
import { Zap } from 'lucide-react';

interface BoostButtonProps {
  onBoost: (boostType: 'elite' | 'speed') => void;
  timeRemaining: number;
}

const BoostButton: React.FC<BoostButtonProps> = ({ onBoost, timeRemaining }) => {
  return (
    <div className="absolute bottom-4 right-4 flex space-x-2">
      <button
        className="bg-purple-500 text-white px-4 py-2 rounded-full flex items-center"
        onClick={() => onBoost('elite')}
        disabled={timeRemaining === 0}
      >
        <Zap size={20} className="mr-2" />
        Deploy Elite Unit
      </button>
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center"
        onClick={() => onBoost('speed')}
        disabled={timeRemaining === 0}
      >
        <Zap size={20} className="mr-2" />
        Global Speed Boost
      </button>
      {timeRemaining > 0 && (
        <div className="absolute -top-8 left-0 right-0 text-center text-white bg-gray-800 rounded-full px-2 py-1">
          {Math.ceil(timeRemaining / 1000)}s
        </div>
      )}
    </div>
  );
};

export default BoostButton;