"use client";

import Link from "next/link";
import { Fish, Menu, User, LogOut, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Verificar autenticação
    const authToken = localStorage.getItem("authToken");
    const name = localStorage.getItem("userName");
    
    if (authToken) {
      setIsAuthenticated(true);
      setUserName(name || "Usuário");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    setIsAuthenticated(false);
    router.push("/");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg group-hover:shadow-lg transition-shadow">
              <Fish className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              AquaLeilões
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/leiloes" prefetch={false}>
              <Button variant="ghost">Leilões</Button>
            </Link>
            <Link href="/vendas" prefetch={false}>
              <Button variant="ghost">Vendas</Button>
            </Link>
            <Link href="/vendedores" prefetch={false}>
              <Button variant="ghost">Vendedores</Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/admin" prefetch={false}>
                  <Button variant="outline">Painel Admin</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="gap-2">
                      <User className="w-4 h-4" />
                      {userName}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      Painel Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" prefetch={false}>
                  <Button variant="outline">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro" prefetch={false}>
                  <Button className="gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600">
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 border-t">
            <Link href="/leiloes" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Leilões
              </Button>
            </Link>
            <Link href="/vendas" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Vendas
              </Button>
            </Link>
            <Link href="/vendedores" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start">
                Vendedores
              </Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link href="/admin" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Painel Admin
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    Entrar
                  </Button>
                </Link>
                <Link href="/cadastro" prefetch={false} onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full justify-start gap-2 bg-gradient-to-r from-blue-500 to-cyan-500">
                    <UserPlus className="w-4 h-4" />
                    Cadastrar
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
