# 🔐 Sistema de Autenticação - Documentação Completa

## 📋 Visão Geral

Este documento descreve o sistema de autenticação completo implementado no projeto **Embaiada Dove Frontend Backoffice**. O sistema utiliza **JWT tokens** com **refresh token** automático e **React Context API** para gerenciamento de estado.

## 🏗️ Arquitetura

### **Componentes Principais:**

1. **AuthContext** - Contexto React para estado global de autenticação
2. **AuthService** - Serviço principal para operações de autenticação
3. **TokenStorage** - Gerenciamento de tokens no localStorage
4. **AuthInterceptor** - Interceptor para renovação automática de tokens
5. **ProtectedRoute** - Componentes para proteção de rotas

### **Fluxo de Autenticação:**

```
Login → Recebe Access + Refresh Token → Armazena no localStorage → 
Requisições autenticadas → Token expira → Interceptor detecta 401 → 
Renova token automaticamente → Retry da requisição original
```

## 🚀 Como Usar

### **1. Configuração de Variáveis de Ambiente**

Crie um arquivo `.env.local` na raiz do projeto:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:3003/api/v1

# Authentication Endpoints
NEXT_PUBLIC_AUTH_LOGIN=http://localhost:3003/api/v1/auth/login
NEXT_PUBLIC_AUTH_REFRESH=http://localhost:3003/api/v1/auth/refresh
NEXT_PUBLIC_AUTH_LOGOUT=http://localhost:3003/api/v1/auth/logout

# Device ID (obrigatório para todas as requisições)
NEXT_PUBLIC_DEVICE_ID=devide-web-01222
```

### **2. Uso do Hook useAuth**

```tsx
import { useAuth } from "@/contexts/AuthContext";

function MyComponent() {
  const { 
    user, 
    isAuthenticated, 
    login, 
    logout, 
    refreshTokens 
  } = useAuth();

  // Verificar se está autenticado
  if (!isAuthenticated) {
    return <div>Faça login para continuar</div>;
  }

  return (
    <div>
      <h1>Bem-vindo, {user?.name}!</h1>
      <button onClick={logout}>Sair</button>
    </div>
  );
}
```

### **3. Proteção de Rotas**

#### **Middleware (Proteção no Servidor):**
```typescript
// middleware.ts já configurado automaticamente
// Protege todas as rotas /dashboard/* e redireciona para /login
```

#### **Componente ProtectedRoute (Proteção no Cliente):**
```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>Conteúdo protegido</div>
    </ProtectedRoute>
  );
}
```

#### **Componente GuestRoute (Apenas usuários NÃO autenticados):**
```tsx
import { GuestRoute } from "@/components/auth/ProtectedRoute";

function LoginPage() {
  return (
    <GuestRoute>
      <div>Formulário de login</div>
    </GuestRoute>
  );
}
```

### **4. Requisições Autenticadas**

#### **Usando AuthService diretamente:**
```typescript
import { AuthService } from "@/lib/auth/authService";

// Headers de autenticação automáticos
const headers = AuthService.getAuthHeaders();

// Requisição com interceptor automático
const response = await AuthService.authenticatedFetch("/api/protected");
```

#### **Usando missionService (já integrado):**
```typescript
import { createMission, updateMission } from "@/lib/missionService";

// Tokens são incluídos automaticamente
await createMission(missionData);
await updateMission(id, updateData);
```

## 🔧 Funcionalidades Implementadas

### **✅ Sistema Completo:**
- [x] Login com username/password
- [x] Refresh token automático
- [x] Logout com limpeza de dados
- [x] Proteção de rotas (middleware + componentes)
- [x] Interceptor para renovação automática
- [x] Gerenciamento de estado com React Context
- [x] Armazenamento seguro no localStorage
- [x] Redirecionamentos inteligentes
- [x] Tratamento de erros robusto

### **✅ Integração:**
- [x] Header com informações do usuário
- [x] Menu dropdown com logout
- [x] Página de login funcional
- [x] Integração com missionService
- [x] Página de teste de autenticação

### **✅ Segurança:**
- [x] Tokens JWT seguros
- [x] Refresh automático transparente
- [x] Limpeza automática em falhas
- [x] Headers de autenticação automáticos
- [x] Device ID obrigatório

## 🧪 Testando o Sistema

### **1. Página de Teste:**
Acesse `/dashboard/test-auth` para testar todas as funcionalidades:
- Status da autenticação
- Informações do usuário
- Visualização de tokens
- Teste de renovação
- Teste de logout

### **2. Credenciais de Teste:**
```
Usuário: backoffice
Senha: backoffice
```

### **3. Fluxo de Teste:**
1. Acesse `/login`
2. Faça login com as credenciais
3. Será redirecionado para `/dashboard`
4. Teste acessar rotas protegidas
5. Teste o logout
6. Verifique redirecionamento para login

## 🚨 Troubleshooting

### **Problemas Comuns:**

#### **1. "useAuth deve ser usado dentro de um AuthProvider"**
- Verifique se o `AuthProvider` está envolvendo sua aplicação no `layout.tsx`

#### **2. Tokens não são renovados automaticamente**
- Verifique se as variáveis de ambiente estão configuradas
- Confirme se o backend está respondendo corretamente

#### **3. Redirecionamentos não funcionam**
- Verifique se o middleware está configurado
- Confirme se as rotas estão protegidas corretamente

#### **4. Erro "Device ID não configurado"**
- Verifique se `NEXT_PUBLIC_DEVICE_ID` está definido no `.env.local`

### **Logs de Debug:**
- Abra o console do navegador para ver logs detalhados
- Use a página `/dashboard/test-auth` para informações de debug
- Verifique o Network tab para requisições de autenticação

## 🔄 Atualizações e Manutenção

### **Adicionando Novos Endpoints:**
1. Atualize `lib/env.ts` com novos endpoints
2. Adicione métodos no `AuthService` se necessário
3. Use `AuthService.getAuthHeaders()` para headers automáticos

### **Modificando o Fluxo de Autenticação:**
1. Edite o `AuthContext.tsx` para mudanças no estado
2. Modifique o `AuthService.ts` para mudanças na lógica
3. Atualize o `middleware.ts` para mudanças na proteção de rotas

### **Customizando Validações:**
1. Edite os schemas Zod nos formulários
2. Modifique as mensagens de erro
3. Ajuste os componentes de validação

## 📚 Recursos Adicionais

### **Documentação Externa:**
- [Next.js Middleware](https://nextjs.org/docs/app/building-your-application/routing/middleware)
- [React Context API](https://react.dev/reference/react/createContext)
- [JWT Tokens](https://jwt.io/introduction)

### **Componentes Relacionados:**
- `components/ui/loading.tsx` - Componentes de loading
- `components/layout/header.tsx` - Header com autenticação
- `components/auth/ProtectedRoute.tsx` - Proteção de rotas

### **Arquivos de Configuração:**
- `middleware.ts` - Proteção de rotas no servidor
- `lib/env.ts` - Configurações de ambiente
- `app/layout.tsx` - Provider global de autenticação

---

## 🎯 Próximos Passos

### **Funcionalidades Futuras:**
- [ ] Recuperação de senha
- [ ] Registro de usuários
- [ ] Perfil do usuário editável
- [ ] Histórico de login
- [ ] Autenticação de dois fatores
- [ ] Integração com provedores OAuth

### **Melhorias de Segurança:**
- [ ] Validação de força de senha
- [ ] Rate limiting para tentativas de login
- [ ] Logs de auditoria
- [ ] Sessões simultâneas

---

**🎉 Sistema de Autenticação implementado com sucesso!**

Para dúvidas ou problemas, consulte os logs do console e a página de teste em `/dashboard/test-auth`.
