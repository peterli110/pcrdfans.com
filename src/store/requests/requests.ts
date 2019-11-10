import { setLoginState, setUserInfo } from '@store/user/userActions';
import { ErrRequest, postServer } from '@utils/request';
import Router from 'next/router';
import { Dispatch } from 'redux';


export const isLogin = async(dispatch: Dispatch) => {
  try {
    const r = await postServer("/nav");
    console.log(r);
    if (r.code === 0) {
      dispatch(setLoginState(true));
      dispatch(setUserInfo(r.data));
      return r;
    } else {
      dispatch(setLoginState(false));
      return r;
    }
  } catch (e) {
    console.log(e);
    return ErrRequest;
  }
};

export const handleOAuth = async(dispatch: Dispatch, data: string) => {
  try {
    const r = await postServer("/oauth", data);
    if (r.code === 0) {
      dispatch(setLoginState(true));
      dispatch(setUserInfo(r.data));
      return r;
    } else {
      dispatch(setLoginState(false));
      return r;
    }
  } catch (e) {
    console.log(e);
    return ErrRequest;
  }
};

export const logOut = async(dispatch: Dispatch) => {
  try {
    const r = await postServer("/logout");
    dispatch(setLoginState(false));
    dispatch(setUserInfo(null));
    if (r.code === 0) {
      Router.push("/");
    }
    return r;
  } catch (e) {
    console.log(e);
    return ErrRequest;
  }
};