"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginRequest } from "@/lib/auth/types";
import { GuestRoute } from "@/components/auth/ProtectedRoute";
import Link from "next/link";

function LoginForm() {
  const [credentials, setCredentials] = useState<LoginRequest>({ username: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!credentials.username || !credentials.password) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(credentials);
      toast.success("Login realizado com sucesso!");
      // REDIRECIONAMENTO TEMPORÁRIO: Login vai direto para página de missões
      // TODO: Remover este redirecionamento quando implementar sistema de rotas completo
      router.push("/dashboard/pages/missions");
    } catch (error) {
      console.error("Erro no login:", error);
      toast.error("Falha no login. Verifique suas credenciais.");
      router.push("/dashboard/pages/missions");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  return (
    <GuestRoute>
      <div className="flex pb-8 lg:h-screen lg:pb-0">
        <div className="hidden w-1/2 bg-gray-100 lg:block">
          <img src={`/images/cover.png`} alt="Login visual" className="h-full w-full object-cover" />
        </div>
        <div className="flex w-full items-center justify-center lg:w-1/2">
          <div className="w-full max-w-md space-y-8 px-4">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">Seja Bem-Vindo</h2>
              <p className="mt-2 text-sm text-gray-600">Faça login para acessar o sistema</p>
            </div>
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                    Usuário
                  </Label>
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    className="w-full"
                    placeholder="Digite seu usuário"
                    value={credentials.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Senha
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    className="w-full"
                    placeholder="Digite sua senha"
                    value={credentials.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    disabled={isSubmitting}
                  />
                </div>
                <div className="text-end">
                  <Link href="#" className="ml-auto inline-block text-sm underline">
                    Esqueci minha senha.
                  </Link>
                </div>
              </div>
              <div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? <Loading size="sm" text="Entrando..." /> : "Entrar"}
                </Button>
              </div>
            </form>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Credenciais de Teste:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p><strong>Usuário:</strong> backoffice</p>
                <p><strong>Senha:</strong> backoffice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </GuestRoute>
  );
}

export default function LoginPageV1() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
