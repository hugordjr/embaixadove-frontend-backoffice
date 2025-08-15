"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PageLoading } from "@/components/ui/loading";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({ children, fallback = <PageLoading text="Verificando autenticação..." /> }: ProtectedRouteProps) {
  // PROTEÇÃO DESABILITADA TEMPORARIAMENTE PARA DESENVOLVIMENTO
  return <>{children}</>;
  
  /*
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(`/login?redirect=${encodeURIComponent(redirect)}`);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return fallback;
  }
  if (!isAuthenticated) {
    return null;
  }
  return <>{children}</>;
  */
}

export function GuestRoute({ children, fallback = <PageLoading text="Verificando..." /> }: ProtectedRouteProps) {
  // PROTEÇÃO DESABILITADA TEMPORARIAMENTE PARA DESENVOLVIMENTO
  return <>{children}</>;
  
  /*
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const redirect = searchParams.get("redirect") || "/dashboard";
      router.push(redirect);
    }
  }, [isAuthenticated, isLoading, router, searchParams]);

  if (isLoading) {
    return fallback;
  }
  if (isAuthenticated) {
    return null;
  }
  return <>{children}</>;
  */
}
