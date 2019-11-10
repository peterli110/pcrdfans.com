import { UserAction, UserActionTypes } from './userActions';

// TODO
export interface UserState {
  readonly isLogin: boolean | null,
  readonly userInfo: UserInfo | null,
}

export interface UserInfo {
  readonly username: string,
  readonly avatar: number,
  readonly enable2x: boolean,
  readonly role: number,
  readonly area: string,
  readonly phone: string,
}

const initialUserState = {
  isLogin: null,
  userInfo: null,
};


export default (
  state: UserState = initialUserState,
  action: UserAction,
) => {
  switch (action.type) {
    case UserActionTypes.LOGIN:
      return {
        ...state,
        isLogin: true,
      };
    case UserActionTypes.LOGOUT:
      return {
        isLogin: false,
        userInfo: null,
      };
    case UserActionTypes.SETUSERINFO:
      return {
        ...state,
        userInfo: action.data as unknown as UserInfo,
      };
    default:
      return state;
  }
};