"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { AuthService } from "@/lib/auth/authService";

export default function TestAuthPage() {
  const { user, isAuthenticated, accessToken, refreshToken, logout, refreshTokens } = useAuth();

  const handleRefreshTokens = async () => {
    try {
      await refreshTokens();
      toast.success("Tokens renovados com sucesso!");
    } catch (error) {
      console.error("Erro ao renovar tokens:", error);
      toast.error("Erro ao renovar tokens");
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  const testAuthenticatedRequest = async () => {
    try {
      const response = await AuthService.authenticatedFetch("/api/test");
      toast.success("Requisição autenticada realizada com sucesso!");
      console.log("Response:", response);
    } catch (error) {
      console.error("Erro na requisição autenticada:", error);
      toast.error("Erro na requisição autenticada");
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Teste de Autenticação</h1>
        <p className="text-muted-foreground">
          Página para testar o sistema de autenticação
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status da Autenticação */}
        <Card>
          <CardHeader>
            <CardTitle>Status da Autenticação</CardTitle>
            <CardDescription>
              Informações sobre o estado atual da autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Autenticado:</span>
              <Badge variant={isAuthenticated ? "default" : "destructive"}>
                {isAuthenticated ? "Sim" : "Não"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Access Token:</span>
              <Badge variant={accessToken ? "default" : "destructive"}>
                {accessToken ? "Presente" : "Ausente"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="font-medium">Refresh Token:</span>
              <Badge variant={refreshToken ? "default" : "destructive"}>
                {refreshToken ? "Presente" : "Ausente"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Perfil do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle>Perfil do Usuário</CardTitle>
            <CardDescription>
              Dados do usuário logado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {user ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-medium">Nome:</span>
                  <span>{user.name}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Departamento:</span>
                  <span>{user.department}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">Cargo:</span>
                  <span>{user.position_title}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="font-medium">ID:</span>
                  <span>{user.id}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum usuário logado</p>
            )}
          </CardContent>
        </Card>

        {/* Tokens */}
        <Card>
          <CardHeader>
            <CardTitle>Tokens</CardTitle>
            <CardDescription>
              Informações sobre os tokens de autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <span className="font-medium">Access Token:</span>
              <div className="text-xs bg-muted p-2 rounded break-all">
                {accessToken ? `${accessToken.substring(0, 50)}...` : "Não disponível"}
              </div>
            </div>
            
            <div className="space-y-2">
              <span className="font-medium">Refresh Token:</span>
              <div className="text-xs bg-muted p-2 rounded break-all">
                {refreshToken ? `${refreshToken.substring(0, 50)}...` : "Não disponível"}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Ações */}
        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
            <CardDescription>
              Testar funcionalidades de autenticação
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleRefreshTokens} 
              className="w-full"
              variant="outline"
            >
              Renovar Tokens
            </Button>
            
            <Button 
              onClick={testAuthenticatedRequest} 
              className="w-full"
              variant="outline"
            >
              Testar Requisição Autenticada
            </Button>
            
            <Button 
              onClick={handleLogout} 
              className="w-full"
              variant="destructive"
            >
              Fazer Logout
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Informações de Debug */}
      <Card>
        <CardHeader>
          <CardTitle>Informações de Debug</CardTitle>
          <CardDescription>
            Dados técnicos para desenvolvimento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm space-y-2">
            <p><strong>Device ID:</strong> {process.env.NEXT_PUBLIC_DEVICE_ID || "Não configurado"}</p>
            <p><strong>API Base URL:</strong> {process.env.NEXT_PUBLIC_API_BASE_URL || "Não configurado"}</p>
            <p><strong>Auth Endpoints:</strong></p>
            <ul className="ml-4 space-y-1">
              <li>• Login: {process.env.NEXT_PUBLIC_AUTH_LOGIN || "Não configurado"}</li>
              <li>• Refresh: {process.env.NEXT_PUBLIC_AUTH_REFRESH || "Não configurado"}</li>
              <li>• Logout: {process.env.NEXT_PUBLIC_AUTH_LOGOUT || "Não configurado"}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
