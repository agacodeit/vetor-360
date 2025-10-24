# 🔐 Integração com Sistema de Login

## 📋 Estratégia Recomendada

### **Abordagem Híbrida: localStorage + API**

1. **Salvar no localStorage** após login bem-sucedido
2. **Sincronizar com API** periodicamente (a cada 5 minutos)
3. **Validar token** automaticamente
4. **Manter dados atualizados** sem impacto na performance

## 🚀 Como Implementar

### 1. **Após o Login (no seu AuthService)**

```typescript
// No seu serviço de autenticação existente
async login(credentials: LoginCredentials): Promise<boolean> {
  try {
    // 1. Fazer login na sua API
    const authResponse = await this.http.post('/api/auth/login', credentials).toPromise();

    if (authResponse.token) {
      // 2. Usar ProfileService para gerenciar usuário
      const user = await this.profileService.login(authResponse.token);

      if (user) {
        console.log('Login realizado:', user.name);
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('Erro no login:', error);
    return false;
  }
}
```

### 2. **No App Initialization (app.component.ts)**

```typescript
export class AppComponent implements OnInit {
  constructor(private profileService: ProfileService) {}

  async ngOnInit() {
    // Verificar se usuário já está logado
    if (this.profileService.isAuthenticated()) {
      console.log('Usuário já autenticado');
    } else {
      // Redirecionar para login se necessário
      this.router.navigate(['/unauthorized/login']);
    }
  }
}
```

### 3. **No AuthGuard (atualizar)**

```typescript
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private profileService: ProfileService, private router: Router) {}

  canActivate(): boolean {
    if (this.profileService.isAuthenticated()) {
      return true;
    }

    this.router.navigate(['/unauthorized/login']);
    return false;
  }
}
```

## 🔧 Métodos Disponíveis

### **ProfileService - Métodos de Autenticação**

```typescript
// Login (após autenticação bem-sucedida)
const user = await this.profileService.login(bearerToken);

// Logout
this.profileService.logout();

// Verificar se está autenticado
const isAuth = this.profileService.isAuthenticated();

// Forçar sincronização com API
const user = await this.profileService.forceSyncWithAPI();

// Obter usuário com sync automático
const user = await this.profileService.getUserWithSync();
```

## 📊 Vantagens da Abordagem

### ✅ **Performance**

- Carregamento instantâneo (dados do localStorage)
- Sincronização em background
- Sem bloqueio da interface

### ✅ **Confiabilidade**

- Dados sempre atualizados
- Fallback para localStorage se API falhar
- Sincronização automática

### ✅ **Segurança**

- Token validado automaticamente
- Logout automático se token inválido
- Dados limpos no logout

## 🎯 Fluxo de Funcionamento

### **1. Login**

```
Usuário faz login → Token salvo → API chamada → Dados salvos no localStorage
```

### **2. Aplicação Inicia**

```
App inicia → Dados carregados do localStorage → Sync automático em background
```

### **3. Uso Normal**

```
Usuário navega → Dados do localStorage → Sync periódico (5min)
```

### **4. Logout**

```
Usuário faz logout → Token removido → Dados limpos → Redirecionamento
```

## 🔄 Sincronização Automática

### **Quando Acontece:**

- ✅ A cada 5 minutos automaticamente
- ✅ Após login
- ✅ Quando chamado `forceSyncWithAPI()`
- ✅ Quando chamado `getUserWithSync()`

### **O que Faz:**

- ✅ Chama API com token atual
- ✅ Atualiza dados no localStorage
- ✅ Mantém dados antigos se API falhar
- ✅ Log de erros para debug

## 🛡️ Tratamento de Erros

### **Token Inválido**

```typescript
// Se token for inválido, usuário é deslogado automaticamente
if (!token || tokenExpired) {
  this.profileService.logout();
  this.router.navigate(['/unauthorized/login']);
}
```

### **API Indisponível**

```typescript
// Se API falhar, mantém dados do localStorage
catch (error) {
  console.error('API indisponível, usando dados locais');
  return this.getCurrentUser(); // Dados do localStorage
}
```

## 📱 Exemplo de Uso Completo

### **1. Login Component**

```typescript
async onLogin(credentials: LoginCredentials) {
  const success = await this.authService.login(credentials);

  if (success) {
    // Usuário logado com sucesso
    this.router.navigate(['/authorized/dashboard']);
  } else {
    // Mostrar erro de login
    this.showError('Credenciais inválidas');
  }
}
```

### **2. Dashboard Component**

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

### **3. Logout Component**

```typescript
onLogout() {
  this.profileService.logout();
  this.router.navigate(['/unauthorized/login']);
}
```

## 🎨 Templates com Perfis

### **Controle de Visibilidade**

```html
<!-- Apenas para Gestor -->
<div *profileIf="'GESTOR_ACESSEBANK'">
  <h3>Área do Gestor</h3>
  <button>Gerenciar Usuários</button>
</div>

<!-- Apenas para Parceiro -->
<div *profileIf="'PARCEIRO_ACESSEBANK'">
  <h3>Área do Parceiro</h3>
  <button>Meus Relatórios</button>
</div>

<!-- Baseado em permissão -->
<div *profileIfComponent="'reports'">
  <button>Ver Relatórios</button>
</div>
```

## 🔧 Configuração da API

### **URLs da API (Environment-based)**

```typescript
// environment.ts (desenvolvimento)
export const environment = {
  production: false,
  apiUrl: 'https://hml.acessebank.com.br/acessebankapi/api/v1/secure',
};

// environment.prod.ts (produção)
export const environment = {
  production: true,
  apiUrl: 'https://advisorbank.com.br/acesssebankapi/api/v1/secure',
};
```

### **Headers Automáticos**

```typescript
// Token é enviado automaticamente
headers: {
  'Authorization': `Bearer ${token}`
}
```

### **Configuração Automática**

- ✅ **Desenvolvimento**: HML API
- ✅ **Produção**: Produção API
- ✅ **Mudança automática** baseada no build

## 🚀 Próximos Passos

1. **Integrar com seu AuthService existente**
2. **Atualizar AuthGuard para usar ProfileService**
3. **Implementar logout em todos os componentes**
4. **Testar sincronização automática**
5. **Configurar tratamento de erros**

---

**Sistema pronto para produção! 🎉**
