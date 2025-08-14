"use client";

import * as React from "react";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./toast";

type ToastMessage = { id: number; title?: string; description?: string; variant?: "default" | "destructive" };

const ToastContext = React.createContext<{ toast: (msg: Omit<ToastMessage, "id">) => void } | undefined>(undefined);

export function Toaster({ children }: { children?: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);
  const toast = React.useCallback((msg: Omit<ToastMessage, "id">) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), ...msg }]);
  }, []);
  const remove = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));

  return (
    <ToastProvider>
      <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
      {toasts.map((t) => (
        <Toast key={t.id} variant={t.variant} open onOpenChange={(o) => !o && remove(t.id)}>
          {t.title ? <ToastTitle>{t.title}</ToastTitle> : null}
          {t.description ? <ToastDescription>{t.description}</ToastDescription> : null}
          <ToastClose />
        </Toast>
      ))}
      <ToastViewport />
    </ToastProvider>
  );
}

export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <Toaster>");
  return ctx;
}


