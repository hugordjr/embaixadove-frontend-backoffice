import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// MIDDLEWARE TEMPORÁRIO: Redireciona rota raiz para página de missões
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // REDIRECIONAMENTO TEMPORÁRIO: Rota raiz vai para missões
  // TODO: Remover este redirecionamento quando implementar sistema de rotas completo
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard/pages/missions', request.url));
  }
  
  // Para todas as outras rotas, permitir acesso livre
  return NextResponse.next();
}

export const config = {
  // MIDDLEWARE ATIVO APENAS PARA ROTA RAIZ
  matcher: ['/'],
};
