import { RequestBody } from './index';

export interface UserListReq extends RequestBody {
  page: number;
  username: string;
}

export interface UpdatePermissionReq extends RequestBody {
  id: string;
  role: number;
}

export interface ChangePWData {
  kyaru: string; // old password
  kaori: string; // new password
}

export interface ChangePWRequest extends RequestBody {
  data: string;
}

export interface GetRedisKeyReq extends RequestBody {
  isset: boolean;
  key: string;
}

export interface UserListData {
  id: string;
  username: string;
  nickname: string;
  created: string;
  role: number;
}

export interface UserListPage {
  page: number;
  hasMore: boolean;
}

export interface UserList {
  result: UserListData[];
  page: UserListPage;
}
