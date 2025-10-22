# 🔧 Correção do Teste "should send correct headers on login"

## ❌ **Problema Identificado**

### **Erro:**

```
Error: Expected one matching request for criteria "Match URL: /api/v1/auth/login", found none.
```

### **Causa:**

O teste estava chamando `httpMock.expectOne()` **antes** de executar `service.login()`, consumindo a requisição antes dela ser feita.

## ✅ **Solução Aplicada**

### **❌ ANTES (incorreto):**

```typescript
it('should send correct headers on login', async () => {
  const req = httpMock.expectOne('/api/v1/auth/login'); // ❌ Chamado antes do login
  expect(req.request.headers.get('Content-Type')).toBe('application/json');
  expect(req.request.headers.get('Accept')).toBe('application/json, text/plain, */*');
  req.flush(MOCK_LOGIN_RESPONSE_GESTOR);

  await service.login(MOCK_LOGIN_REQUEST_GESTOR); // ❌ Requisição já foi consumida
});
```

### **✅ DEPOIS (correto):**

```typescript
it('should send correct headers on login', async () => {
  await service.login(MOCK_LOGIN_REQUEST_GESTOR); // ✅ Executa primeiro

  const req = httpMock.expectOne('/api/v1/auth/login'); // ✅ Agora pode interceptar
  expect(req.request.headers.get('Content-Type')).toBe('application/json');
  expect(req.request.headers.get('Accept')).toBe('application/json, text/plain, */*');
  req.flush(MOCK_LOGIN_RESPONSE_GESTOR);
});
```

## 🎯 **Como Funciona Agora**

### **1. Ordem Correta:**

1. ✅ **Executa** `service.login()` - faz a requisição HTTP
2. ✅ **Intercepta** com `httpMock.expectOne()` - captura a requisição
3. ✅ **Verifica** headers - testa os cabeçalhos
4. ✅ **Responde** com `req.flush()` - simula resposta da API

### **2. Fluxo do Teste:**

```typescript
// 1. Executa login (faz requisição HTTP)
await service.login(MOCK_LOGIN_REQUEST_GESTOR);

// 2. Intercepta a requisição feita
const req = httpMock.expectOne('/api/v1/auth/login');

// 3. Verifica headers
expect(req.request.headers.get('Content-Type')).toBe('application/json');
expect(req.request.headers.get('Accept')).toBe('application/json, text/plain, */*');

// 4. Simula resposta da API
req.flush(MOCK_LOGIN_RESPONSE_GESTOR);
```

## ✅ **Resultado**

- ✅ **Teste corrigido** - ordem correta de execução
- ✅ **Headers verificados** - Content-Type e Accept
- ✅ **Sem erros** - requisição interceptada corretamente

---

**Teste "should send correct headers on login" corrigido! 🎉**
