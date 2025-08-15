// Configurações de ambiente para a aplicação
export const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3003/api/v1";

export const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3001/api/v1";

// Device ID fixo para o frontend web
export const DEVICE_ID = "device-web-01222";

// URLs específicas para autenticação
export const AUTH_ENDPOINTS = {
  LOGIN: `${AUTH_BASE_URL}/auth/login`,
  REFRESH: `${AUTH_BASE_URL}/refresh`,
  LOGOUT: `${AUTH_BASE_URL}/auth/logout`, // Se existir no backend
} as const;


