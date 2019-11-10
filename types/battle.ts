import { RequestBody } from './index';

export interface BattleData {
  id: string;
  atk: BattleDetail[];
  def: BattleDetail[];
  up: number;
  down: number;
  liked: boolean;
  disliked: boolean;
  comment: BattleComment[];
  updated: string;
  private: boolean;
  iseditor: boolean;
}

export interface BattleComment {
  id: string;
  date: string;
  msg: string;
  avatar?: number;
  nickname?: string;
}

export interface BattlePage {
  page: number;
  hasMore: boolean;
}

export interface BattleResult {
  result: BattleData[];
  page: BattlePage;
}

export interface BattleRequest extends RequestBody {
  def: number[];
  page: number;
  sort: number;
  region: number;
}

export interface PrivateBattleRequest extends RequestBody {
  page: number;
}

export interface DeletePrivateBattleRequest extends RequestBody {
  id: string;
}

export interface ManualPartyRequest extends RequestBody {
  def: number[];
}

export interface ManualPartyResult {
  id: number[];
  count: number;
  up: number;
  down: number;
}

export interface BattleDetail {
  equip: boolean;
  id: number;
  star: number;
}

export interface BattleUploadRequest extends RequestBody {
  atk: BattleDetail[];
  comment: string;
  def: BattleDetail[];
  private: number;
  region: number;
}

export interface LikeRequest extends RequestBody {
  action: 'like' | 'dislike';
  cancel: boolean;
  id: string;
}

export interface UpdateCommentRequest extends RequestBody {
  comment: string;
  id: string;
}
