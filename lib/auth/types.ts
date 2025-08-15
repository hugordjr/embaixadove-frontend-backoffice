// Interfaces para o sistema de autenticação

// Request de login
export interface LoginRequest {
  username: string;
  password: string;
}

// Resposta de login
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  profile: Profile;
}

// Perfil do usuário
export interface Profile {
  id: number;
  userId: number;
  name: string;
  photo_url: string | null;
  department: string;
  position_title: string;
}

// Request de refresh token
export interface RefreshRequest {
  refreshToken: string;
}

// Resposta de refresh token
export interface RefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// Estado de autenticação
export interface AuthState {
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  refreshToken: string | null;
}

// Headers padrão para requisições autenticadas
export interface AuthHeaders {
  "Content-Type": "application/json";
  "x-device-id": string;
  "Authorization"?: string;
}
