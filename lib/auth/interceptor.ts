import { AuthService } from "./authService";
import { TokenStorage } from "./storage";

// Interceptor para renovar tokens automaticamente
export class AuthInterceptor {
  private static isRefreshing = false;
  private static failedQueue: Array<{
    resolve: (value: any) => void;
    reject: (reason?: any) => void;
  }> = [];

  // Processar fila de requisições falhadas
  private static processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(({ resolve, reject }) => {
      if (error) {
        reject(error);
      } else {
        resolve(token);
      }
    });
    
    this.failedQueue = [];
  }

  // Interceptar requisições fetch e renovar tokens quando necessário
  static async intercept(request: Request): Promise<Response> {
    try {
      // Fazer a requisição original
      const response = await fetch(request);
      
      // Se a resposta for 401 (Unauthorized), tentar renovar o token
      if (response.status === 401) {
        return this.handleUnauthorized(request);
      }
      
      return response;
    } catch (error) {
      console.error("Erro na requisição:", error);
      throw error;
    }
  }

  // Lidar com resposta 401 (Unauthorized)
  private static async handleUnauthorized(originalRequest: Request): Promise<Response> {
    // Se já estiver renovando, adicionar à fila
    if (this.isRefreshing) {
      return new Promise((resolve, reject) => {
        this.failedQueue.push({ resolve, reject });
      }).then(() => {
        // Retry da requisição original com novo token
        return this.retryRequest(originalRequest);
      });
    }

    this.isRefreshing = true;

    try {
      // Tentar renovar o token
      const refreshResponse = await AuthService.refreshTokens();
      
      // Processar fila de sucesso
      this.processQueue(null, refreshResponse.accessToken);
      
      // Retry da requisição original com novo token
      return this.retryRequest(originalRequest);
    } catch (error) {
      // Processar fila de erro
      this.processQueue(error, null);
      
      // Limpar dados de autenticação e redirecionar para login
      TokenStorage.clearAuthData();
      
      // Se estiver no browser, redirecionar para login
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  // Retry da requisição com novo token
  private static async retryRequest(originalRequest: Request): Promise<Response> {
    const newToken = TokenStorage.getAccessToken();
    
    if (!newToken) {
      throw new Error("Token não disponível após refresh");
    }

    // Criar nova requisição com o token atualizado
    const newRequest = new Request(originalRequest, {
      headers: {
        ...Object.fromEntries(originalRequest.headers.entries()),
        Authorization: `Bearer ${newToken}`,
      },
    });

    return fetch(newRequest);
  }

  // Função helper para usar o interceptor
  static async fetchWithAuth(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const request = new Request(input, init);
    return this.intercept(request);
  }
}

// Função global para usar o interceptor
export const fetchWithAuth = AuthInterceptor.fetchWithAuth.bind(AuthInterceptor);
