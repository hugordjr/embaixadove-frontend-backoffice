"use client";

import { LockIcon, Menu, LogOut, User, Settings, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Search from "./search";
import Logo from "./logo";
import { SidebarNavLink } from "./sidebar";
import { page_routes } from "@/lib/routes-config";
import { Fragment } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();

  // Usuário mock para desenvolvimento quando não há autenticação
  const mockUser = {
    name: "Usuário Demo",
    photo_url: null,
    department: "Desenvolvimento",
    position_title: "Desenvolvedor"
  };

  // Usar usuário real ou mock
  const currentUser = user || mockUser;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      console.error("Erro no logout:", error);
      toast.error("Erro ao fazer logout");
    }
  };

  // PROTEÇÃO DESABILITADA TEMPORARIAMENTE PARA DESENVOLVIMENTO
  // if (!isAuthenticated) {
  //   return null;
  // }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="sticky top-0 z-50 flex flex-col">
      <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="shrink-0 lg:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col overflow-auto">
            <Logo className="px-0" />
            <nav className="grid gap-2 text-lg font-medium">
              {page_routes.map((route) => (
                <Fragment key={route.title}>
                  <div className="px-2 py-4 font-medium">{route.title}</div>
                  <nav className="*:flex *:items-center *:gap-3 *:rounded-lg *:px-3 *:py-2 *:transition-all hover:*:bg-muted">
                    {route.items.map((item, key) => (
                      <SidebarNavLink key={key} item={item} />
                    ))}
                  </nav>
                </Fragment>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        
        <div className="w-full flex-1">
          {/* Aqui pode ser adicionado o Search se necessário */}
        </div>
        
        <ThemeToggle />
        
        {/* Informações do usuário e menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-auto px-3 gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage 
                  src={currentUser?.photo_url || undefined} 
                  alt={currentUser?.name || "Usuário"} 
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                  {currentUser?.name ? getInitials(currentUser.name) : "U"}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start text-left">
                <span className="text-sm font-medium">{currentUser?.name || "Usuário"}</span>
                <span className="text-xs text-muted-foreground">
                  {currentUser?.position_title || "Cargo não informado"}
                </span>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{currentUser?.name || "Usuário"}</p>
                <p className="text-xs leading-none text-muted-foreground">{currentUser?.department} • {currentUser?.position_title}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Perfil</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Configurações</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <HelpCircle className="mr-2 h-4 w-4" />
              <span>Suporte</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>
    </div>
  );
}
