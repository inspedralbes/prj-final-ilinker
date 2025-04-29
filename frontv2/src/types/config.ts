// config.ts

type AppConfig = {
  apiUrl: string;
  appUrl: string;
  storageUrl: string;
  socketUrl: string;
};

const getEnv = (key: string, fallback = ''): string => {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === 'development') {
      console.warn(`[config] ⚠️ Missing environment variable: ${key}`);
    }
    return fallback;
  }
  return value;
};

const config: AppConfig = {
  apiUrl: getEnv('NEXT_PUBLIC_API_URL', 'http://127.0.0.1:8000/api/'), // Valor por defecto para la API
  appUrl: getEnv('NEXT_PUBLIC_APP_URL', 'http://localhost:3000'), // Valor por defecto para la app
  storageUrl: getEnv('NEXT_PUBLIC_STORAGE_URL', 'http://127.0.0.1:8000/storage/'), // Valor por defecto para la storage
  socketUrl: getEnv('NEXT_PUBLIC_SOCKET_URL', 'http://127.0.0.1:3777'), // Valor por defecto para el socket
};

export default config;
