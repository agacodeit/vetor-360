# 🔧 Correção da URL da API

## ✅ **Problema Identificado e Corrigido**

O AuthService estava usando `environment.acesseBankApiUrl` em vez do `environment.apiUrl` padrão.

## 🔧 **Correções Realizadas**

### **1. AuthService (`services/auth/auth.service.ts`)**

```typescript
// ❌ ANTES (incorreto)
private readonly API_BASE_URL = environment.acesseBankApiUrl;

// ✅ DEPOIS (correto)
private readonly API_BASE_URL = environment.apiUrl;
```

### **2. Environment de Desenvolvimento (`environment.ts`)**

```typescript
// ✅ Configuração correta
export const environment = {
  production: false,
  apiUrl: 'https://hml.acessebank.com.br/acessebankapi/api/v1/secure',
  appName: 'Vetor 360',
  version: '1.0.0',
};
```

### **3. Environment de Produção (`environment.prod.ts`)**

```typescript
// ✅ Configuração correta
export const environment = {
  production: true,
  apiUrl: 'https://advisorbank.com.br/acesssebankapi/api/v1/secure',
  appName: 'Vetor 360',
  version: '1.0.0',
};
```

## 🎯 **URLs Configuradas**

### **Desenvolvimento:**

- **URL**: `https://hml.acessebank.com.br/acessebankapi/api/v1/secure`
- **Uso**: Ambiente de homologação

### **Produção:**

- **URL**: `https://advisorbank.com.br/acesssebankapi/api/v1/secure`
- **Uso**: Ambiente de produção

## 🚀 **Como Funciona Agora**

### **1. AuthService:**

```typescript
// Usa environment.apiUrl automaticamente
const response = await this.http.get<User>(`${this.API_BASE_URL}/user`, {
  headers: this.getAuthHeaders(),
});
```

### **2. Mudança Automática:**

- **Desenvolvimento**: Usa HML automaticamente
- **Produção**: Usa produção automaticamente
- **Baseado no build**: `ng build` vs `ng build --configuration=production`

## 📋 **Endpoints Disponíveis**

### **Login:**

```
POST /auth/login
```

### **Usuário:**

```
GET /user
```

### **Exemplo de Uso:**

```typescript
// Login
const user = await this.authService.login({
  email: 'usuario@acessebank.com.br',
  password: 'senha123',
});

// Carregar usuário
const user = await this.authService.loadUserFromAPI();
```

## ✅ **Vantagens da Correção**

### **1. Consistência:**

- Usa o padrão `apiUrl` do Angular
- Segue as convenções do projeto

### **2. Simplicidade:**

- Uma única propriedade para API
- Menos confusão na configuração

### **3. Manutenibilidade:**

- Fácil de alterar URLs
- Configuração centralizada

### **4. Flexibilidade:**

- Diferentes URLs por ambiente
- Mudança automática no build

## 🔧 **Configuração Final**

### **Desenvolvimento:**

```bash
ng serve
# Usa: https://hml.acessebank.com.br/acessebankapi/api/v1/secure
```

### **Produção:**

```bash
ng build --configuration=production
# Usa: https://advisorbank.com.br/acesssebankapi/api/v1/secure
```

---

**Sistema de URLs corrigido e funcionando corretamente! 🎉**
