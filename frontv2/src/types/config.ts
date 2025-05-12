// src/types/config.ts
export interface AppConfig {
  apiUrl: string | undefined;
  appUrl: string | undefined;
  storageUrl: string | undefined;
  socketUrl: string | undefined;
  mapboxToken: string | undefined;
}

const config: AppConfig = {
  apiUrl:      process.env.NEXT_PUBLIC_API_URL      ,
  appUrl:      process.env.NEXT_PUBLIC_APP_URL      ,
  storageUrl:  process.env.NEXT_PUBLIC_STORAGE_URL  ,
  socketUrl:   process.env.NEXT_PUBLIC_SOCKET_URL   ,
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN ,
};

export default config;
