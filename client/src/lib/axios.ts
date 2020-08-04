import axios from 'axios';

export const serverAxios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_PROXY_HOST,
  headers: {
    host: process.env.NEXT_PUBLIC_HOST,
  },
});

export const clientAxios = axios.create({
  baseURL: '/',
});
