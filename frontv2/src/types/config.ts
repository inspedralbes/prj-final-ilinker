// src/types/config.ts
export interface AppConfig {
  apiUrl: string;
  appUrl: string;
  storageUrl: string;
  socketUrl: string;
  mapboxToken: string;
}

const config: AppConfig = {
  apiUrl:      process.env.NEXT_PUBLIC_API_URL      || 'http://127.0.0.1:8000/api/',
  appUrl:      process.env.NEXT_PUBLIC_APP_URL      || 'http://localhost:3000',
  storageUrl:  process.env.NEXT_PUBLIC_STORAGE_URL  || 'http://127.0.0.1:8000/storage/',
  socketUrl:   process.env.NEXT_PUBLIC_SOCKET_URL   || 'http://127.0.0.1:3777',
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '',
};

export default config;
