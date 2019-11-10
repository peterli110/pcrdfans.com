import { RequestBody } from './index';

export interface RankByTimeReq extends RequestBody {
  range: 1 | 2 | 3;
  type: 'atk' | 'def';
}

export interface DailyRankReq extends RequestBody {
  id: number;
  range: 7 | 15 | 30;
  type: 'atk' | 'def';
}

export interface RankByTime {
  id: number;
  count: number;
}

export interface DailyRank {
  day: number;
  count: number;
}

export interface TopCombineReq extends RequestBody {
  more: boolean;
  num: 2 | 3;
  range: 2 | 3;
  type: 'atk' | 'def';
}

export interface TopCombineData {
  units: number[];
  count: number;
}
