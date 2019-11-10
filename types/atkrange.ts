import { RequestBody } from './index';

export interface AtkRangeRequest extends RequestBody {
  atk: number[];
  def: number[];
  side: number;
  skill: number;
  unit: number;
}
