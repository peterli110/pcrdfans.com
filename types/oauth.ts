import { RequestBody } from './index';

export interface OAuthData {
  kyoka: string; // username
  kokoro: string; // password
  m: 'login' | 'signup'; // method
  n?: string; // nickname
  fp: string; // 32 bits fingerprint
}

export interface OAuthRequest extends RequestBody {
  data: string;
}

export interface UpdateUserReq extends RequestBody {
  avatar?: number;
  area?: string;
  enable2x?: boolean;
  jjc?: number;
  nickname?: string;
  phone?: string;
  pjjc?: number;
}

export interface UpdateBoxReq extends RequestBody {
  box: number[];
}
