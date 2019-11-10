import { RequestBody } from './index';

export interface AutoPartyReq extends RequestBody {
  mode: number;
  type: 1 | 2;
}
