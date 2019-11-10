import { RequestBody } from './index';

export interface UnitInfoReq extends RequestBody {
  equip: boolean;
  equipLevel: number;
  id: number;
  level: number;
  rank: number;
  star: number;
}

export interface TimeLineReq extends RequestBody {
  id: number;
  isclan: boolean;
}

export interface TimeLineData {
  skill1: string;
  skill2: string;
  timeline: TimeLineDetail[];
}

interface TimeLineDetail {
  skill: number;
  ts: number;
}
