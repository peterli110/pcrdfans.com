import { generateNonce, randomInt } from "@utils/functions";

async function tryCatch<T, E = Error>(promise: Promise<T>): Promise<[T, E]> {
  try {
    const ret = await promise;
    return [ret, null as unknown as E];
  } catch(e) {
    return [null as unknown as T, e];
  }
}

export {
  randomInt,
  generateNonce,
  tryCatch,
};