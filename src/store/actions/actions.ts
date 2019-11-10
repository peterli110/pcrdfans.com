import * as requests from '@store/requests/requests';
import { Result } from '@utils/request';
import { Dispatch } from 'redux';

export interface Actions {
  IsLogin: () => Promise<Result>,
  HandleOAuth: (s: string) => Promise<Result>,
  LogOut: () => Promise<Result>,
}

export const IsLogin = () => {
  return async(dispatch: Dispatch) => {
    return requests.isLogin(dispatch);
  };
};

export const HandleOAuth = (data: string) => {
  return async(dispatch: Dispatch) => {
    return requests.handleOAuth(dispatch, data);
  };
};

export const LogOut = () => {
  return async(dispatch: Dispatch) => {
    return requests.logOut(dispatch);
  };
};