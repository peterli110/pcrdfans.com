import { SERVERADDRESS } from '@config/index';
import * as e6p from "es6-promise";
import 'isomorphic-fetch';
e6p.polyfill();

export interface Result {
  code: number,
  msg: string,
  data: any,
  ttl?: number,
}

export const ErrRequest: Result = {
  code: -999,
  msg: "",
  data: {},
};

export async function getServer(path: string, data?: string, token?: string) {
  const res = await fetch(SERVERADDRESS + path + (data ? "?" + data : ""), {
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
  if (res.status !== 200) throw new Error(`request error: ${res.status}`);
  return await res.json() as Result;
}

export async function postServer(path: string, data?: string, token?: string) {
  const res = await fetch(SERVERADDRESS + path, {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: data
  });
  if (res.status !== 200) throw new Error(`request error: ${res.status}`);
  return await res.json() as Result;
}

export async function putServer(path: string, data?: string, token?: string) {
  const res = await fetch(SERVERADDRESS + path, {
    method: 'PUT',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: data
  });
  if (res.status !== 200) throw new Error(`request error: ${res.status}`);
  return await res.json() as Result;
}

export async function deleteServer(path: string, data?: string, token?: string) {
  const res = await fetch(SERVERADDRESS + path, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: data
  });
  if (res.status !== 200) throw new Error(`request error: ${res.status}`);
  return await res.json() as Result;
}