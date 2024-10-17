import React from 'react';
import { Shield, Zap, Rocket } from 'lucide-react';

interface UnitDeploymentPanelProps {
  energy: number;
  coins: number;
  onDeployUnit: (unitType: 'fast' | 'moderate' | 'slow') => void;
  onBuyEnergy: () => void;
}

const UnitDeploymentPanel: React.FC<UnitDeploymentPanelProps> = ({
  energy,
  coins,
  onDeployUnit,
  onBuyEnergy,
}) => {
  const unitTypes = [
    { type: 'fast', icon: Rocket, color: 'bg-red-500', cost: 10 },
    { type: 'moderate', icon: Zap, color: 'bg-yellow-500', cost: 20 },
    { type: 'slow', icon: Shield, color: 'bg-blue-500', cost: 30 },
  ];

  return (
    <div className="flex flex-col items-center bg-gray-800 p-4 rounded-lg">
      <div className="mb-4 w-full">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white">Energy:</span>
          <div className="w-32 h-4 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: `${(energy / 100) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-white">Coins: {coins}</span>
          <button
            className="bg-yellow-500 text-white px-2 py-1 rounded"
            onClick={onBuyEnergy}
            disabled={coins < 50}
          >
            Buy Energy (50 coins)
          </button>
        </div>
      </div>
      {unitTypes.map(({ type, icon: Icon, color, cost }) => (
        <button
          key={type}
          className={`${color} text-white w-full mb-2 p-2 rounded flex justify-between items-center`}
          onClick={() => onDeployUnit(type as 'fast' | 'moderate' | 'slow')}
          disabled={energy < cost}
        >
          <Icon size={24} />
          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          <span>{cost}</span>
        </button>
      ))}
    </div>
  );
};

export default UnitDeploymentPanel;