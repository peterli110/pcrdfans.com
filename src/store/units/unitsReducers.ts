import { UnitsAction, UnitsActionTypes } from './unitsActions';

export interface UnitInfo {
  readonly server: number;
  readonly cn: number[];
  readonly tw: number[];
}

const initialUnitState = {
  server: 1,
  cn: [],
  tw: [],
};

export default (
  state: UnitInfo = initialUnitState,
  action: UnitsAction,
) => {
  switch (action.type) {
    case UnitsActionTypes.SETALL:
      return {
        ...state,
        server: 1,
      };
    case UnitsActionTypes.SETCN:
      return {
        ...state,
        server: 2,
      };
    case UnitsActionTypes.SETTW:
      return {
        ...state,
        server: 3,
      };
    case UnitsActionTypes.SETJP:
      return {
        ...state,
        server: 4,
      };
    case UnitsActionTypes.SETDATA:
      return {
        ...state,
        cn: action.data!.cn,
        tw: action.data!.tw,
      };
    default:
      return state;
  }
};