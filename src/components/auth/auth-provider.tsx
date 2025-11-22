"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isChecking, setIsChecking] = useState(true);
  const [mounted, setMounted] = useState(false);
  const hasChecked = useRef(false);
  const isNavigating = useRef(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || hasChecked.current || isNavigating.current) return;

    // Verificar autenticação e redirecionar se necessário
    const checkAuth = () => {
      try {
        const authToken = localStorage.getItem("authToken");
        const userRole = localStorage.getItem("userRole");
        const isAuthenticated = !!authToken && userRole === "admin";
        
        // Redirecionar apenas se estiver em rota admin e não autenticado
        if (pathname?.startsWith("/admin") && !isAuthenticated) {
          isNavigating.current = true;
          setTimeout(() => {
            if (mounted && !hasChecked.current) {
              router.push("/login");
            }
          }, 150);
        }
        
        hasChecked.current = true;
        setIsChecking(false);
      } catch (error) {
        console.error("Erro ao verificar autenticação:", error);
        hasChecked.current = true;
        setIsChecking(false);
      }
    };

    // Pequeno delay para evitar conflitos com HMR
    const timer = setTimeout(checkAuth, 250);
    
    return () => {
      clearTimeout(timer);
    };
  }, [pathname, router, mounted]);

  // Reset hasChecked quando pathname mudar
  useEffect(() => {
    hasChecked.current = false;
    isNavigating.current = false;
  }, [pathname]);

  // Mostrar loading apenas durante verificação inicial em rotas admin
  if (!mounted || (isChecking && pathname?.startsWith("/admin"))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
