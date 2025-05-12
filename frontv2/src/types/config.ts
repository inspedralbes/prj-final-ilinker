// src/types/config.ts
export interface AppConfig {
  apiUrl: string;
  appUrl: string;
  storageUrl: string;
  socketUrl: string;
  mapboxToken: string;
}

const config: AppConfig = {
  apiUrl:      process.env.NEXT_PUBLIC_API_URL      || 'https://ilinker.cat/api/',
  appUrl:      process.env.NEXT_PUBLIC_APP_URL      || 'https://ilinker.cat',
  storageUrl:  process.env.NEXT_PUBLIC_STORAGE_URL  || 'https://ilinker.cat/storage/',
  socketUrl:   process.env.NEXT_PUBLIC_SOCKET_URL   || 'https://ilinker.cat/socket.io',
  mapboxToken: process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoiYTIyamhlcGluY3JlIiwiYSI6ImNtYWdsc2V1MDAyYzgyaXFzNHZ2Y3U1bG4ifQ.WaA39FCZrDZqHd4RB3FUAg',
};

export default config;
