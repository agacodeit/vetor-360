# 🧪 Estrutura de Mocks Atualizada

## 📋 Mocks Disponíveis

### **1. Usuários (`user-data.mock.ts`)**

#### **Usuários Principais:**

- ✅ **`MOCK_GESTOR_USER`** - Gestor AcesseBank completo
- ✅ **`MOCK_PARCEIRO_USER`** - Parceiro AcesseBank completo

#### **Usuários Especiais:**

- ✅ **`MOCK_GESTOR_TEMP_PASS`** - Gestor com senha temporária
- ✅ **`MOCK_PARCEIRO_UNAUTHORIZED`** - Parceiro não autorizado
- ✅ **`MOCK_USER_INACTIVE`** - Usuário inativo

#### **Credenciais de Login:**

- ✅ **`MOCK_LOGIN_CREDENTIALS`** - Credenciais para testes
- ✅ **`MOCK_LOGIN_RESPONSES`** - Respostas de login estruturadas

### **2. Requisições de Auth (`auth-requests.mock.ts`)**

#### **Requisições de Login:**

- ✅ **`MOCK_LOGIN_REQUEST_GESTOR`** - Login Gestor
- ✅ **`MOCK_LOGIN_REQUEST_PARCEIRO`** - Login Parceiro
- ✅ **`MOCK_INVALID_LOGIN_REQUEST`** - Login inválido

#### **Respostas de Login:**

- ✅ **`MOCK_LOGIN_RESPONSE_GESTOR`** - Resposta Gestor
- ✅ **`MOCK_LOGIN_RESPONSE_PARCEIRO`** - Resposta Parceiro

#### **Erros:**

- ✅ **`MOCK_LOGIN_ERROR`** - Erro de login
- ✅ **`MOCK_SIGNUP_EMAIL_EXISTS_ERROR`** - Email já existe

## 🎯 Como Usar

### **1. Importar Mocks:**

```typescript
import {
  MOCK_GESTOR_USER,
  MOCK_PARCEIRO_USER,
  MOCK_LOGIN_CREDENTIALS,
  MOCK_LOGIN_RESPONSE_GESTOR,
} from '../__mocks__/user-data.mock';
```

### **2. Usar em Testes:**

```typescript
// Teste de login
const user = await authService.login(MOCK_LOGIN_CREDENTIALS.gestor);

// Teste de perfil
profileService.setCurrentUser(MOCK_GESTOR_USER);
const isGestor = profileService.hasProfile(UserProfile.GESTOR_ACESSEBANK);
```

### **3. Usar em Desenvolvimento:**

```typescript
// Simular usuário logado
this.profileService.setCurrentUser(MOCK_GESTOR_USER);

// Testar diferentes cenários
this.profileService.setCurrentUser(MOCK_GESTOR_TEMP_PASS);
this.profileService.setCurrentUser(MOCK_PARCEIRO_UNAUTHORIZED);
```

## 🔧 Estrutura dos Usuários

### **Campos Obrigatórios:**

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  userTypeEnum: UserProfile;
  cpfCnpj: string;
  cellphone: string;
  comercialPhone: string;
  userStatusEnum: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'SUSPENDED';
  dateHourIncluded: string;
  documents: Document[];
  temporaryPass: boolean;
  masterAccessGrantedEnum: 'APPROVED' | 'PENDING' | 'REJECTED';
  notifyClientsByEmail: boolean;
  authorized: boolean;
}
```

### **Perfis Disponíveis:**

- **`GESTOR_ACESSEBANK`** - Acesso completo
- **`PARCEIRO_ACESSEBANK`** - Acesso limitado

## 🧪 Cenários de Teste

### **1. Login Bem-sucedido:**

```typescript
const user = await authService.login(MOCK_LOGIN_CREDENTIALS.gestor);
// Resultado: MOCK_GESTOR_USER
```

### **2. Login com Senha Temporária:**

```typescript
profileService.setCurrentUser(MOCK_GESTOR_TEMP_PASS);
// Resultado: Usuário com temporaryPass: true
```

### **3. Usuário Não Autorizado:**

```typescript
profileService.setCurrentUser(MOCK_PARCEIRO_UNAUTHORIZED);
// Resultado: Usuário com authorized: false
```

### **4. Usuário Inativo:**

```typescript
profileService.setCurrentUser(MOCK_USER_INACTIVE);
// Resultado: Usuário com userStatusEnum: 'INACTIVE'
```

## 🎨 Exemplos de Uso

### **Teste de Componente:**

```typescript
describe('ProfileComponent', () => {
  it('should show gestor content for GESTOR_ACESSEBANK', () => {
    profileService.setCurrentUser(MOCK_GESTOR_USER);
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.hasGestorAccess()).toBe(true);
  });
});
```

### **Teste de Guard:**

```typescript
describe('ProfileGuard', () => {
  it('should allow GESTOR_ACESSEBANK', () => {
    profileService.setCurrentUser(MOCK_GESTOR_USER);
    const result = guard.canActivate();
    expect(result).toBe(true);
  });
});
```

### **Teste de Diretiva:**

```typescript
describe('ProfileIfDirective', () => {
  it('should show content for GESTOR_ACESSEBANK', () => {
    profileService.setCurrentUser(MOCK_GESTOR_USER);
    fixture.detectChanges();

    const element = fixture.debugElement.query(By.css('[data-test="gestor-content"]'));
    expect(element).toBeTruthy();
  });
});
```

## 🚀 Vantagens dos Mocks

### ✅ **Cobertura Completa**

- Todos os cenários de usuário
- Diferentes status e permissões
- Casos de erro e sucesso

### ✅ **Facilidade de Uso**

- Importação centralizada
- Estrutura consistente
- Dados realistas

### ✅ **Manutenibilidade**

- Fácil de atualizar
- Estrutura tipada
- Documentação clara

### ✅ **Flexibilidade**

- Múltiplos cenários
- Dados customizáveis
- Reutilização em testes

---

**Sistema de mocks atualizado e funcionando! 🎉**
