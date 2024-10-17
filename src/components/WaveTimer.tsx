import React from 'react';
import { Clock } from 'lucide-react';

interface WaveTimerProps {
  timeRemaining: number;
}

const WaveTimer: React.FC<WaveTimerProps> = ({ timeRemaining }) => {
  return (
    <div className="absolute bottom-4 right-4 bg-gray-800 text-white px-4 py-2 rounded-full flex items-center">
      <Clock size={20} className="mr-2" />
      <span className="font-bold">Next Wave: </span>
      <span>{Math.ceil(timeRemaining / 1000)}s</span>
    </div>
  );
};

export default WaveTimer;