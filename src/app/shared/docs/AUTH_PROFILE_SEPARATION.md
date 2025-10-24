# 🔐 Separação de Responsabilidades: Auth vs Profile

## 📋 Estrutura Atualizada

### **AuthService** (`services/auth/auth.service.ts`)

**Responsabilidade**: Autenticação e comunicação com API

- ✅ **Login/Logout** - Gerenciamento de sessão
- ✅ **Token Management** - Armazenamento e validação
- ✅ **API Communication** - Chamadas para API do AcesseBank
- ✅ **User Sync** - Sincronização com servidor
- ✅ **Environment-based URLs** - URLs diferentes por ambiente

### **ProfileService** (`services/profile/profile.service.ts`)

**Responsabilidade**: Gerenciamento de perfis e permissões

- ✅ **Profile Management** - Controle de perfis de usuário
- ✅ **Permission System** - Sistema de permissões
- ✅ **Local Storage** - Persistência local de dados
- ✅ **Profile Guards** - Proteção baseada em perfil
- ✅ **Profile Directives** - Controle de visibilidade

## 🎯 Como Usar

### **1. Autenticação (AuthService)**

```typescript
// Login
const user = await this.authService.login({
  email: 'usuario@acessebank.com.br',
  password: 'senha123',
});

// Logout
this.authService.logout();

// Verificar autenticação
const isAuth = this.authService.isAuthenticated();

// Sincronizar com API
const user = await this.authService.forceSyncWithAPI();
```

### **2. Perfis e Permissões (ProfileService)**

```typescript
// Verificar perfil
const isGestor = this.profileService.hasProfile(UserProfile.GESTOR_ACESSEBANK);

// Verificar permissão
const canViewReports = this.profileService.hasPermission('reports', 'view');

// Obter usuário atual
const user = this.profileService.getCurrentUser();
```

### **3. Templates com Perfis**

```html
<!-- Controle de visibilidade -->
<div *profileIf="'GESTOR_ACESSEBANK'">Área do Gestor</div>
<div *profileIf="'PARCEIRO_ACESSEBANK'">Área do Parceiro</div>
<div *profileIfComponent="'reports'">Relatórios</div>
```

## 🔧 Configuração de Ambientes

### **Desenvolvimento** (`environment.ts`)

```typescript
export const environment = {
  production: false,
  acesseBankApiUrl: 'https://hml.acessebank.com.br/acessebankapi/api/v1/secure',
};
```

### **Produção** (`environment.prod.ts`)

```typescript
export const environment = {
  production: true,
  acesseBankApiUrl: 'https://advisorbank.com.br/acesssebankapi/api/v1/secure',
};
```

## 🚀 Fluxo de Funcionamento

### **1. Login**

```
Usuário faz login → AuthService → API AcesseBank → ProfileService → localStorage
```

### **2. Aplicação Inicia**

```
App inicia → AuthService verifica token → ProfileService carrega dados → Sync automático
```

### **3. Uso Normal**

```
Usuário navega → ProfileService (dados locais) → AuthService (sync em background)
```

### **4. Logout**

```
Usuário faz logout → AuthService limpa token → ProfileService limpa dados
```

## 📊 Vantagens da Separação

### ✅ **Responsabilidades Claras**

- **AuthService**: Foca em autenticação e API
- **ProfileService**: Foca em perfis e permissões

### ✅ **Manutenibilidade**

- Código mais organizado
- Fácil de testar
- Fácil de modificar

### ✅ **Reutilização**

- AuthService pode ser usado em outros projetos
- ProfileService é independente da API

### ✅ **Performance**

- Dados de perfil sempre disponíveis
- Sync em background
- Fallback para dados locais

## 🎨 Exemplos de Uso

### **Login Component**

```typescript
async onLogin(credentials: LoginCredentials) {
  const user = await this.authService.login(credentials);

  if (user) {
    // Usuário logado com sucesso
    this.router.navigate(['/authorized/dashboard']);
  } else {
    // Mostrar erro de login
    this.showError('Credenciais inválidas');
  }
}
```

### **Dashboard Component**

```typescript
ngOnInit() {
  // Dados já estão disponíveis via ProfileService
  const user = this.profileService.getCurrentUser();

  if (user) {
    console.log('Usuário logado:', user.name);
    // Renderizar dashboard baseado no perfil
  }
}
```

### **Guard de Autenticação**

```typescript
canActivate(): boolean {
  if (this.authService.isAuthenticated()) {
    return true;
  }

  this.router.navigate(['/unauthorized/login']);
  return false;
}
```

### **Guard de Perfil**

```typescript
canActivate(): boolean {
  if (this.profileService.hasProfile(UserProfile.GESTOR_ACESSEBANK)) {
    return true;
  }

  this.router.navigate(['/unauthorized/access-denied']);
  return false;
}
```

## 🔄 Sincronização Automática

### **Quando Acontece:**

- ✅ A cada 5 minutos automaticamente
- ✅ Após login
- ✅ Quando chamado `forceSyncWithAPI()`
- ✅ Quando chamado `getUserWithSync()`

### **O que Faz:**

- ✅ Chama API com token atual
- ✅ Atualiza dados no ProfileService
- ✅ Mantém dados antigos se API falhar
- ✅ Log de erros para debug

## 🛡️ Tratamento de Erros

### **Token Inválido**

```typescript
// Se token for inválido, usuário é deslogado automaticamente
if (!token || tokenExpired) {
  this.authService.logout();
  this.router.navigate(['/unauthorized/login']);
}
```

### **API Indisponível**

```typescript
// Se API falhar, mantém dados do localStorage
catch (error) {
  console.error('API indisponível, usando dados locais');
  return this.profileService.getCurrentUser();
}
```

## 🚀 Próximos Passos

1. **Integrar AuthService com seu sistema de login existente**
2. **Atualizar guards para usar AuthService**
3. **Implementar logout em todos os componentes**
4. **Testar sincronização automática**
5. **Configurar tratamento de erros**

---

**Sistema de autenticação e perfis separados e funcionando! 🎉**
