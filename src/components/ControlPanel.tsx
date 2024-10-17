import React, { useState, useEffect, useCallback } from 'react';
import { Coins, Zap, Rocket, Star, Shield, Clock } from 'lucide-react';

interface ControlPanelProps {
  energy: number;
  coins: number;
  onDeployUnit: (unitType: 'fast' | 'moderate' | 'slow') => void;
  onBuyEnergy: () => void;
  waveTimer: number;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  energy,
  coins,
  onDeployUnit,
  onBuyEnergy,
  waveTimer,
}) => {
  const unitTypes = [
    { type: 'fast', icon: Rocket, color: 'bg-red-500', cost: 10 },
    { type: 'moderate', icon: Star, color: 'bg-yellow-500', cost: 20 },
    { type: 'slow', icon: Shield, color: 'bg-blue-500', cost: 30 },
  ];

  const [pressTimer, setPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [activeUnit, setActiveUnit] = useState<string | null>(null);

  const startDeployment = useCallback((unitType: 'fast' | 'moderate' | 'slow') => {
    setActiveUnit(unitType);
    onDeployUnit(unitType);
    setPressTimer(setInterval(() => onDeployUnit(unitType), 200));
  }, [onDeployUnit]);

  const stopDeployment = useCallback(() => {
    if (pressTimer) {
      clearInterval(pressTimer);
      setPressTimer(null);
    }
    setActiveUnit(null);
  }, [pressTimer]);

  useEffect(() => {
    return () => {
      if (pressTimer) {
        clearInterval(pressTimer);
      }
    };
  }, [pressTimer]);

  return (
    <div className="flex justify-between items-center bg-gray-800 p-4">
      <div className="flex flex-col items-start">
        <div className="flex items-center text-white mb-2">
          <Coins size={24} className="mr-2" />
          <span>{coins}</span>
        </div>
        <div className="flex flex-col items-start">
          <div className="flex items-center text-white mb-1">
            <Zap size={24} className="mr-2" />
            <span>{energy}</span>
          </div>
          <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(energy / 1000) * 100}%` }}
            ></div>
          </div>
        </div>
        <button
          className="mt-2 bg-green-500 text-white px-3 py-1 rounded-full flex items-center text-sm"
          onClick={onBuyEnergy}
          disabled={coins < 50}
        >
          <Coins size={16} className="mr-1" />
          <span>BUY (50)</span>
        </button>
      </div>
      <div className="flex space-x-6">
        {unitTypes.map(({ type, icon: Icon, color, cost }) => (
          <div key={type} className="flex flex-col items-center">
            <button
              className={`${color} text-white w-24 h-24 rounded-full flex flex-col justify-center items-center mb-2 ${activeUnit === type ? 'ring-4 ring-white' : ''}`}
              onMouseDown={() => startDeployment(type as 'fast' | 'moderate' | 'slow')}
              onMouseUp={stopDeployment}
              onMouseLeave={stopDeployment}
              onTouchStart={() => startDeployment(type as 'fast' | 'moderate' | 'slow')}
              onTouchEnd={stopDeployment}
              disabled={energy < cost}
            >
              <Icon size={36} />
              <div className="flex items-center mt-1">
                <Zap size={16} className="mr-1" />
                <span className="text-lg">{cost}</span>
              </div>
            </button>
            <button className="bg-gray-600 text-white px-3 py-1 rounded-full text-sm font-bold">
              UPGRADE
            </button>
          </div>
        ))}
      </div>
      <div className="flex flex-col items-end">
        <div className="bg-gray-700 text-white px-4 py-2 rounded-full mb-2">
          <span className="font-bold">Magical Gemstone: </span>
          <span>100%</span>
        </div>
        <div className="bg-gray-700 text-white px-4 py-2 rounded-full flex items-center">
          <Clock size={20} className="mr-2" />
          <span className="font-bold">Next Wave: </span>
          <span>{Math.ceil(waveTimer / 1000)}s</span>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;