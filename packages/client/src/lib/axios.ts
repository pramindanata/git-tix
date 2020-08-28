import axios, { AxiosInstance } from 'axios';
import { EnvService } from '~/utils';

export const serverAxios = axios.create({
  baseURL: process.env.APP_PROXY_HOST,
  headers: {
    host: process.env.APP_HOST,
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
