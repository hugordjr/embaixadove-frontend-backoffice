"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorToast() {
  useEffect(() => {
    toast.error("Erro interno do servidor. Tente novamente mais tarde.");
  }, []);

  return null; // Componente não renderiza nada visualmente
}
