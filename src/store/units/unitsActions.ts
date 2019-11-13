export enum UnitsActionTypes {
  SETALL        = "SETALL",
  SETJP         = "SETJP",
  SETCN         = "SETCN",
  SETTW         = "SETTW",
  SETDATA       = "SETDATA",
}

export const AllServer  = 1;
export const CNServer   = 2;
export const TWServer   = 3;
export const JPServer   = 4;

interface Action<T> {
  type: T,
  data?: UnitDiff,
}

interface UnitDiff {
  cn: number[],
  tw: number[],
}

export type UnitsAction = 
  Action<UnitsActionTypes.SETALL>   |
  Action<UnitsActionTypes.SETJP>    |
  Action<UnitsActionTypes.SETCN>    |
  Action<UnitsActionTypes.SETTW>    |
  Action<UnitsActionTypes.SETDATA>;


export const setServerInfo = (state: number): UnitsAction => {
  switch (state) {
    case 1:
      return { type: UnitsActionTypes.SETALL };
    case 2:
      return { type: UnitsActionTypes.SETCN };
    case 3:
      return { type: UnitsActionTypes.SETTW };
    case 4:
      return { type: UnitsActionTypes.SETJP };
    default:
      return { type: UnitsActionTypes.SETALL };
  }
};

export const setUnitData = (data: any): UnitsAction => {
  return {
    type: UnitsActionTypes.SETDATA,
    data,
  };
};
  