"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loading } from "@/components/ui/loading";

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // REDIRECIONAMENTO TEMPORÁRIO: Todas as rotas inválidas vão para missões
    // TODO: Remover este redirecionamento quando implementar sistema de rotas completo
    const timer = setTimeout(() => {
      router.push("/dashboard/pages/missions");
    }, 1000); // 1 segundo de delay para mostrar o loading

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Página não encontrada
        </h2>
        <p className="text-gray-600 mb-6">
          Redirecionando para a página de missões...
        </p>
        <Loading size="lg" text="Redirecionando..." />
        <p className="text-xs text-gray-500 mt-4">
          Redirecionamento temporário - Sistema em desenvolvimento
        </p>
      </div>
    </div>
  );
}



