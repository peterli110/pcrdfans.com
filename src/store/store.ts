import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';

import server, { UnitInfo } from './units/unitsReducers';
import user, { UserState } from './user/userReducers';

export interface AppState {
  user: UserState,
  server: UnitInfo,
}

/**
 * initStore
 * Initialise and export redux store
 */
export const initStore = (initialState: {} = {}) => {
  return createStore(
    combineReducers({
      user,
      server,
    }),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
};
