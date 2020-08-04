import axios, { AxiosInstance } from 'axios';
import { EnvService } from '~/utils';

export const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_HOST,
  headers: {
    host: process.env.NEXT_PUBLIC_HOST,
  },
});

export const clientAxios = axios.create({
  baseURL: '/',
});

export function getHttpClient(): AxiosInstance {
  if (EnvService.isInClient()) {
    return clientAxios;
  } else {
    return serverAxios;
  }
}
