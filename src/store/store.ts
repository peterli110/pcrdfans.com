import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import user, { UserState } from './user/userReducers';

export interface AppState {
  user: UserState,
}

/**
 * initStore
 * Initialise and export redux store
 */
export const initStore = (initialState: {} = {}) => {
  return createStore(
    combineReducers({
      user,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};
