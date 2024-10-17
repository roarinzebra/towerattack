export interface Unit {
  id: string;
  type: 'fast' | 'moderate' | 'slow';
  color: string;
  shield: number;
  speed: number;
  cost: number;
  position: number;
  lane: number;
}

export interface DefensiveUnit {
  id: string;
  position: { x: number; y: number };
  lane: number;
}

export interface LanePoint {
  x: number;
  y: number;
}

export interface Lane {
  id: number;
  path: LanePoint[];
}

export interface Projectile {
  id: string;
  position: { x: number; y: number };
  target: Unit;
}

export interface GameState {
  units: Unit[];
  defensiveUnits: DefensiveUnit[];
  lanes: Lane[];
  projectiles: Projectile[];
  energy: number;
  coins: number;
  waveTimer: number;
}