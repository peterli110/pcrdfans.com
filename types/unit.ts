export interface UnitData {
  cid: number;
  id: number;
  name: string;
  equip: boolean;
  rarity: number;
  maxrarity: number;
  type: number;
  position: number;
  place: number;
  limited: boolean;
  comment: string;
}

export interface UnitObject {
  [key: string]: UnitData;
}

export interface UnitDetails {
  accuracy: number;
  atk: number;
  def: number;
  dodge: number;
  energy_recovery_rate: number;
  energy_reduce_rate: number;
  hp: number;
  hp_recovery_rate: number;
  life_steal: number;
  magic_critical: number;
  magic_def: number;
  magic_str: number;
  physical_critical: number;
}
