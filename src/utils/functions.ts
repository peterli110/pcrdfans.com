import Units from '@config/constants/unito.json';
import { UnitData, UnitObject } from '@type/unit';
const UnitObj: UnitObject = Units as UnitObject;


export const randomInt = (min: number, max:number): number => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive 
};

export const generateNonce = () => {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
};

// same as the sorting type in game
// larger position will be put in front
// smaller position will be put in back
export const compare = (a: UnitData, b: UnitData) => {
  const r = reverseCompare(a, b);
  if (r === 1) {
    return -1;
  } else if (r === -1) {
    return 1;
  }
  return r;
};

// reversed
export const reverseCompare = (a: UnitData, b: UnitData) => {
  if (a.position < b.position) return -1;
  if (a.position > b.position) return 1;

  if (a.position === b.position) {
    // 华哥 跳跳虎
    if (a.position === 185) {
      return a.name === "クロエ" ? 1 : -1;
    }
    if (a.name.length > b.name.length) {
      return 1;
    } else {
      return -1;
    }
  }
  return 0;
};

export const sortUnitId = (arr: number[]) => {
  const dataMap = arr.map(e => {
    if (!UnitObj[e]) {
      return UnitObj[100101];
    }

    return UnitObj[e];
  });

  return dataMap.sort(compare).map(e => e.id);
};
