type RequestIdleCallbackHandle = any;
export interface RequestIdleCallbackOptions {
  timeout: number;
}
export interface RequestIdleCallbackDeadline {
  readonly didTimeout: boolean;
  timeRemaining: () => number;
}

declare global {
  interface Window {
    requestIdleCallback: (
      callback: (deadline: RequestIdleCallbackDeadline) => void,
      opts?: RequestIdleCallbackOptions
    ) => RequestIdleCallbackHandle;
    cancelIdleCallback: (handle: RequestIdleCallbackHandle) => void;
  }
}

export interface RequestBody {
  nonce: string;
  ts: number;
  _sign?: string;
}
