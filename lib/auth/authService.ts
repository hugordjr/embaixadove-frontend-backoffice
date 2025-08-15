// Serviço principal de autenticação

import { AUTH_ENDPOINTS, DEVICE_ID } from "@/lib/env";
import { 
  LoginRequest, 
  LoginResponse, 
  RefreshRequest, 
  RefreshResponse,
  Profile 
} from "./types";
import { TokenStorage } from "./storage";
import { AuthInterceptor } from "./interceptor";

export class AuthService {
  // Fazer login
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await fetch(AUTH_ENDPOINTS.LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": DEVICE_ID,
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro no login: ${response.status}`);
      }

      const data: LoginResponse = await response.json();
      
      // Salvar dados no localStorage
      TokenStorage.setAuthData(data.accessToken, data.refreshToken, data.profile);
      
      return data;
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    }
  }

  // Renovar tokens
  static async refreshTokens(): Promise<RefreshResponse> {
    try {
      const refreshToken = TokenStorage.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error("Refresh token não encontrado");
      }

      const response = await fetch(AUTH_ENDPOINTS.REFRESH, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-device-id": DEVICE_ID,
        },
        body: JSON.stringify({ refreshToken } as RefreshRequest),
      });

      if (!response.ok) {
        // Se o refresh falhar, limpar dados e redirecionar para login
        TokenStorage.clearAuthData();
        throw new Error("Refresh token expirado ou inválido");
      }

      const data: RefreshResponse = await response.json();
      
      // Atualizar tokens no localStorage
      TokenStorage.updateTokens(data.accessToken, data.refreshToken);
      
      return data;
    } catch (error) {
      console.error("Erro ao renovar tokens:", error);
      throw error;
    }
  }

  // Fazer logout
  static async logout(): Promise<void> {
    try {
      const accessToken = TokenStorage.getAccessToken();
      
      // Se houver endpoint de logout no backend, chamar
      if (accessToken) {
        try {
          await fetch(AUTH_ENDPOINTS.LOGOUT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-device-id": DEVICE_ID,
              "Authorization": `Bearer ${accessToken}`,
            },
          });
        } catch (error) {
          // Ignorar erro se o endpoint não existir
          console.warn("Endpoint de logout não disponível:", error);
        }
      }
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      // Sempre limpar dados locais
      TokenStorage.clearAuthData();
    }
  }

  // Verificar se está autenticado
  static isAuthenticated(): boolean {
    return TokenStorage.isAuthenticated();
  }

  // Obter perfil do usuário
  static getUserProfile(): Profile | null {
    return TokenStorage.getUserProfile();
  }

  // Obter access token atual
  static getAccessToken(): string | null {
    return TokenStorage.getAccessToken();
  }

  // Obter headers para requisições autenticadas
  static getAuthHeaders(): Record<string, string> {
    const accessToken = TokenStorage.getAccessToken();
    
    return {
      "Content-Type": "application/json",
      "x-device-id": DEVICE_ID,
      ...(accessToken && { "Authorization": `Bearer ${accessToken}` }),
    };
  }

  // Função para fazer requisições autenticadas com interceptor
  static async authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    return AuthInterceptor.fetchWithAuth(input, init);
  }
}
