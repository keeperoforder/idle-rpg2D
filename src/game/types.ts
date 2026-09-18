export interface HeroStats {
  level: number;
  hp: number;
  maxHp: number;
  damage: number;
  armor: number;
  gold: number;
  experience: number;
}

export interface EnemyStats {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  damage: number;
  armor: number;
  experienceReward: number;
  goldReward: number;
}
