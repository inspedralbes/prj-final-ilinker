// config.ts

type AppConfig = {
  apiUrl: string;
  appUrl: string;
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
};

export default config;
