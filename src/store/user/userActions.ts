export enum UserActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  SETUSERINFO = 'SETUSERINFO',
}

interface Action<UserInfo> {
  type: UserActionTypes,
  data?: UserInfo,
}

export type UserAction =
  | Action<UserActionTypes.LOGIN>
  | Action<UserActionTypes.LOGOUT>
  | Action<UserActionTypes.SETUSERINFO>;

export const setLoginState = (state: boolean): UserAction => {
  if (state) {
    return {
      type: UserActionTypes.LOGIN,
    };
  } else {
    return {
      type: UserActionTypes.LOGOUT,
    };
  }
};

// TODO
export const setUserInfo = (userInfo: any): UserAction => {
  return {
    type: UserActionTypes.SETUSERINFO,
    data: userInfo,
  };
};