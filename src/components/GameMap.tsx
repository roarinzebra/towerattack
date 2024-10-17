import React from 'react';
import { Lane, Unit, DefensiveUnit, Projectile } from '../types';

interface GameMapProps {
  lanes: Lane[];
  units: Unit[];
  defensiveUnits: DefensiveUnit[];
  projectiles: Projectile[];
  selectedLane: number | null;
  onLaneSelect: (laneId: number) => void;
}

const GameMap: React.FC<GameMapProps> = ({
  lanes,
  units,
  defensiveUnits,
  projectiles,
  selectedLane,
  onLaneSelect,
}) => {
  return (
    <div className="relative w-full h-full bg-green-300">
      <svg className="absolute top-0 left-0 w-full h-full">
        {lanes.map((lane) => (
          <React.Fragment key={lane.id}>
            <path
              d={`M ${lane.path.map((p) => `${p.x}% ${p.y}%`).join(' L ')}`}
              fill="none"
              stroke="#5D4037"
              strokeWidth="40"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d={`M ${lane.path.map((p) => `${p.x}% ${p.y}%`).join(' L ')}`}
              fill="none"
              stroke={selectedLane === lane.id ? '#FFA000' : '#8D6E63'}
              strokeWidth="30"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => onLaneSelect(lane.id)}
              className="cursor-pointer"
            />
          </React.Fragment>
        ))}
      </svg>
      {defensiveUnits.map((unit) => (
        <div
          key={unit.id}
          className="absolute w-8 h-8 bg-gray-700 rounded-full"
          style={{ left: `${unit.position.x}%`, top: `${unit.position.y}%`, transform: 'translate(-50%, -50%)' }}
        />
      ))}
      {units.map((unit) => {
        const position = lanes[unit.lane].path[Math.floor(unit.position)];
        return (
          <div
            key={unit.id}
            className={`absolute w-6 h-6 rounded-full ${
              unit.type === 'fast'
                ? 'bg-red-500'
                : unit.type === 'moderate'
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{
              left: `${position.x}%`,
              top: `${position.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {unit.shield > 0 && (
              <div
                className="absolute top-0 left-0 bg-white opacity-50 rounded-full"
                style={{
                  width: `${(unit.shield / (unit.type === 'slow' ? 5 : unit.type === 'moderate' ? 3 : 1)) * 100}%`,
                  height: `${(unit.shield / (unit.type === 'slow' ? 5 : unit.type === 'moderate' ? 3 : 1)) * 100}%`,
                }}
              />
            )}
          </div>
        );
      })}
      {projectiles.map((projectile) => (
        <div
          key={projectile.id}
          className="absolute w-2 h-2 bg-black rounded-full"
          style={{ left: `${projectile.position.x}%`, top: `${projectile.position.y}%`, transform: 'translate(-50%, -50%)' }}
        />
      ))}
    </div>
  );
};

export default GameMap;