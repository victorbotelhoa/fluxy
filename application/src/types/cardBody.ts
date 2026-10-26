export type PowerType = 'damage' | 'heal';
export type Rarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'unique' | 'exotic'

export interface Skill {
  name: string;
  type: PowerType;
  value: number;
  description: string;
  cooldown: number;
  var: boolean;
}

export interface Weapon {
  name: string;
  description: string;
  damage: number;
  var: boolean;
}

export interface Card {
  id: string;
  name: string;
  description: string;
  rarity: Rarity;
  img_path: string;
  weapon: Weapon;
  skills?: Skill[]; 
}