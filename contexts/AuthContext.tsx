"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { AuthState, Profile, LoginRequest } from "@/lib/auth/types";
import { AuthService } from "@/lib/auth/authService";
import { TokenStorage } from "@/lib/auth/storage";

// Ações do reducer
type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: { user: Profile; accessToken: string; refreshToken: string } }
  | { type: "LOGIN_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "REFRESH_START" }
  | { type: "REFRESH_SUCCESS"; payload: { accessToken: string; refreshToken: string } }
  | { type: "REFRESH_FAILURE" }
  | { type: "INITIALIZE"; payload: { user: Profile; accessToken: string; refreshToken: string } };

// Estado inicial
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  accessToken: null,
  refreshToken: null,
};

// Reducer para gerenciar o estado
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
      return { ...state, isLoading: true };
    
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    
    case "LOGIN_FAILURE":
      return { ...state, isLoading: false };
    
    case "LOGOUT":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case "REFRESH_START":
      return { ...state, isLoading: true };
    
    case "REFRESH_SUCCESS":
      return {
        ...state,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isLoading: false,
      };
    
    case "REFRESH_FAILURE":
      return {
        ...state,
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      };
    
    case "INITIALIZE":
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      };
    
    default:
      return state;
  }
}

// Interface do contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
}

// Criar contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider do contexto
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Inicializar estado ao montar o componente
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const accessToken = TokenStorage.getAccessToken();
        const refreshToken = TokenStorage.getRefreshToken();
        const userProfile = TokenStorage.getUserProfile();

        if (accessToken && refreshToken && userProfile) {
          dispatch({
            type: "INITIALIZE",
            payload: {
              user: userProfile,
              accessToken,
              refreshToken,
            },
          });
        } else {
          dispatch({ type: "LOGOUT" });
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
        dispatch({ type: "LOGOUT" });
      }
    };

    initializeAuth();
  }, []);

  // Função de login
  const login = async (credentials: LoginRequest) => {
    try {
      dispatch({ type: "LOGIN_START" });
      
      const response = await AuthService.login(credentials);
      
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: {
          user: response.profile,
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error) {
      console.error("Erro no login:", error);
      dispatch({ type: "LOGIN_FAILURE" });
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Erro no logout:", error);
    } finally {
      dispatch({ type: "LOGOUT" });
    }
  };

  // Função de refresh de tokens
  const refreshTokens = async () => {
    try {
      dispatch({ type: "REFRESH_START" });
      
      const response = await AuthService.refreshTokens();
      
      dispatch({
        type: "REFRESH_SUCCESS",
        payload: {
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
        },
      });
    } catch (error) {
      console.error("Erro ao renovar tokens:", error);
      dispatch({ type: "REFRESH_FAILURE" });
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshTokens,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook customizado para usar o contexto
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
}
