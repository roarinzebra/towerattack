import React, { useState, useEffect, useCallback } from 'react';
import GameMap from './components/GameMap';
import ControlPanel from './components/ControlPanel';
import { GameState, Unit, Lane, DefensiveUnit, Projectile, LanePoint } from './types';

const WAVE_DURATION = 60000; // 60 seconds

const createLanePath = (points: LanePoint[]): LanePoint[] => {
  const path: LanePoint[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const start = points[i];
    const end = points[i + 1];
    const steps = 20; // Increase for smoother curves
    for (let j = 0; j <= steps; j++) {
      const t = j / steps;
      path.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      });
    }
  }
  return path;
};

const initialLanes: Lane[] = [
  { id: 0, path: createLanePath([
    { x: 0, y: 30 },
    { x: 50, y: 30 },
    { x: 100, y: 30 },
  ])},
  { id: 1, path: createLanePath([
    { x: 0, y: 70 },
    { x: 50, y: 70 },
    { x: 100, y: 70 },
  ])},
];

const initialDefensiveUnits: DefensiveUnit[] = [
  { id: 'd1', position: { x: 25, y: 25 }, lane: 0 },
  { id: 'd2', position: { x: 75, y: 35 }, lane: 0 },
  { id: 'd3', position: { x: 25, y: 65 }, lane: 1 },
  { id: 'd4', position: { x: 75, y: 75 }, lane: 1 },
];

const initialGameState: GameState = {
  units: [],
  defensiveUnits: initialDefensiveUnits,
  lanes: initialLanes,
  projectiles: [],
  energy: 1000,
  coins: 100,
  waveTimer: WAVE_DURATION,
};

function App() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [selectedLane, setSelectedLane] = useState<number | null>(0);

  const updateGameState = useCallback((updates: Partial<GameState>) => {
    setGameState((prevState) => ({ ...prevState, ...updates }));
  }, []);

  const deployUnit = useCallback((unitType: 'fast' | 'moderate' | 'slow') => {
    if (selectedLane === null) return;

    const unitCosts = { fast: 10, moderate: 20, slow: 30 };
    const cost = unitCosts[unitType];

    if (gameState.energy < cost) return;

    const newUnit: Unit = {
      id: `u${Date.now()}`,
      type: unitType,
      color: unitType === 'fast' ? 'red' : unitType === 'moderate' ? 'yellow' : 'blue',
      shield: unitType === 'fast' ? 0 : unitType === 'moderate' ? 3 : 5,
      speed: unitType === 'fast' ? 2 : unitType === 'moderate' ? 1 : 0.5,
      cost,
      position: 0,
      lane: selectedLane,
    };

    updateGameState({
      units: [...gameState.units, newUnit],
      energy: gameState.energy - cost,
    });
  }, [gameState.energy, gameState.units, selectedLane, updateGameState]);

  const buyEnergy = useCallback(() => {
    if (gameState.coins >= 50) {
      updateGameState({
        energy: Math.min(gameState.energy + 50, 1000),
        coins: gameState.coins - 50,
      });
    }
  }, [gameState.coins, gameState.energy, updateGameState]);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameState((prevState) => {
        // Move units
        const updatedUnits = prevState.units
          .map((unit) => ({
            ...unit,
            position: Math.min(unit.position + unit.speed, prevState.lanes[unit.lane].path.length - 1),
          }))
          .filter((unit) => unit.position < prevState.lanes[unit.lane].path.length - 1);

        // Generate coins for units that reached the end
        const newCoins =
          prevState.coins +
          (prevState.units.length - updatedUnits.length) * 10;

        // Move projectiles and check for collisions
        const updatedProjectiles = prevState.projectiles
          .map((projectile) => {
            const target = prevState.units.find((u) => u.id === projectile.target.id);
            if (!target) return null;

            const targetPosition = prevState.lanes[target.lane].path[Math.floor(target.position)];
            const dx = targetPosition.x - projectile.position.x;
            const dy = targetPosition.y - projectile.position.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 5) {
              // Projectile hit the target
              const updatedTarget = { ...target, shield: target.shield - 1 };
              updatedUnits[updatedUnits.findIndex((u) => u.id === target.id)] = updatedTarget;
              return null;
            }

            // Move projectile towards the target
            const speed = 2;
            const newX = projectile.position.x + (dx / distance) * speed;
            const newY = projectile.position.y + (dy / distance) * speed;

            return { ...projectile, position: { x: newX, y: newY } };
          })
          .filter((p): p is Projectile => p !== null);

        // Defensive units fire at nearby enemy units
        const newProjectiles = prevState.defensiveUnits.flatMap((defUnit) => {
          const nearbyEnemies = updatedUnits.filter(
            (unit) =>
              unit.lane === defUnit.lane &&
              Math.abs(prevState.lanes[unit.lane].path[Math.floor(unit.position)].x - defUnit.position.x) < 20
          );

          return nearbyEnemies.map((enemy) => ({
            id: `p${Date.now()}-${enemy.id}`,
            position: { ...defUnit.position },
            target: enemy,
          }));
        });

        // Update wave timer
        const newWaveTimer = Math.max(0, prevState.waveTimer - 16);

        return {
          ...prevState,
          units: updatedUnits,
          projectiles: [...updatedProjectiles, ...newProjectiles],
          coins: newCoins,
          waveTimer: newWaveTimer,
        };
      });
    }, 16); // 60 FPS

    return () => clearInterval(gameLoop);
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="flex-grow relative">
        <GameMap
          lanes={gameState.lanes}
          units={gameState.units}
          defensiveUnits={gameState.defensiveUnits}
          projectiles={gameState.projectiles}
          selectedLane={selectedLane}
          onLaneSelect={setSelectedLane}
        />
      </div>
      <ControlPanel
        energy={gameState.energy}
        coins={gameState.coins}
        onDeployUnit={deployUnit}
        onBuyEnergy={buyEnergy}
        waveTimer={gameState.waveTimer}
      />
    </div>
  );
}

export default App;