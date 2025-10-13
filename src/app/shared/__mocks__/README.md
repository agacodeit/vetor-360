# 📦 Mocks Reutilizáveis para Testes

Esta pasta contém mocks reutilizáveis para facilitar a criação de testes unitários em todo o projeto.

## 📁 Estrutura

```
__mocks__/
├── index.ts                    # Exports centralizados
├── jwt-tokens.mock.ts          # Tokens JWT para autenticação
├── user-data.mock.ts           # Dados de usuários
├── auth-requests.mock.ts       # Requisições e respostas de auth
├── kanban-data.mock.ts         # Dados do Kanban
├── modal-data.mock.ts          # Configurações de modais
├── toast-data.mock.ts          # Configurações de toasts
└── README.md                   # Esta documentação
```

## 🚀 Como Usar

### Importação Básica

```typescript
import { VALID_JWT_TOKEN, MOCK_USER, MOCK_LOGIN_REQUEST } from '../../shared/__mocks__';
```

### Exemplo de Uso em Testes

```typescript
import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { VALID_JWT_TOKEN, MOCK_LOGIN_REQUEST, MOCK_LOGIN_RESPONSE } from '../../shared/__mocks__';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthService],
    });
    service = TestBed.inject(AuthService);
  });

  it('should login successfully', (done) => {
    service.login(MOCK_LOGIN_REQUEST).subscribe((response) => {
      expect(response).toEqual(MOCK_LOGIN_RESPONSE);
      expect(service.getToken()).toBe(VALID_JWT_TOKEN);
      done();
    });
  });
});
```

## 📚 Mocks Disponíveis

### 🔐 JWT Tokens (`jwt-tokens.mock.ts`)

- `VALID_JWT_TOKEN` - Token válido que expira em 2100
- `EXPIRED_JWT_TOKEN` - Token expirado (2020)
- `PARCEIRO_JWT_TOKEN` - Token com role específica
- `INVALID_JWT_TOKEN` - Token malformado
- `VALID_TOKEN_PAYLOAD` - Payload decodificado do token válido
- `EXPIRED_TOKEN_PAYLOAD` - Payload decodificado do token expirado

### 👤 User Data (`user-data.mock.ts`)

- `MOCK_USER` - Usuário básico
- `MOCK_ADMIN_USER` - Usuário admin
- `MOCK_EDITOR_USER` - Usuário editor
- `MOCK_MULTI_ROLE_USER` - Usuário com múltiplas roles
- `MOCK_USER_NO_ROLES` - Usuário sem roles
- `MOCK_NEW_USER` - Novo usuário (signup)

### 🔑 Auth Requests (`auth-requests.mock.ts`)

**Requests:**

- `MOCK_LOGIN_REQUEST` - Requisição de login válida
- `MOCK_INVALID_LOGIN_REQUEST` - Requisição com credenciais erradas
- `MOCK_SIGNUP_REQUEST` - Requisição de signup válida
- `MOCK_EXISTING_EMAIL_SIGNUP_REQUEST` - Signup com email existente

**Responses:**

- `MOCK_LOGIN_RESPONSE` - Resposta de login bem-sucedido
- `MOCK_ADMIN_LOGIN_RESPONSE` - Login de admin bem-sucedido
- `MOCK_SIGNUP_RESPONSE` - Resposta de signup bem-sucedido

**Errors:**

- `MOCK_LOGIN_ERROR` - Erro 401 (credenciais inválidas)
- `MOCK_SIGNUP_EMAIL_EXISTS_ERROR` - Erro 409 (email já existe)

### 📋 Kanban Data (`kanban-data.mock.ts`)

- `MOCK_KANBAN_CARD` - Card básico
- `MOCK_COMPLETE_KANBAN_CARD` - Card com todos os dados
- `MOCK_KANBAN_CARDS` - Lista de cards
- `MOCK_KANBAN_COLUMN` - Coluna básica
- `MOCK_KANBAN_COLUMNS` - Colunas padrão do sistema

### 🪟 Modal Data (`modal-data.mock.ts`)

- `MOCK_MODAL_CONFIG` - Configuração básica
- `MOCK_COMPLETE_MODAL_CONFIG` - Configuração completa
- `MOCK_LARGE_MODAL_CONFIG` - Modal grande
- `MOCK_SMALL_MODAL_CONFIG` - Modal pequeno
- `MOCK_NO_HEADER_MODAL_CONFIG` - Modal sem header
- `MOCK_MODAL_WITH_DATA` - Modal com dados customizados

### 🔔 Toast Data (`toast-data.mock.ts`)

**Configurações:**

- `MOCK_SUCCESS_TOAST` - Toast de sucesso
- `MOCK_ERROR_TOAST` - Toast de erro
- `MOCK_WARNING_TOAST` - Toast de aviso
- `MOCK_INFO_TOAST` - Toast de informação
- `MOCK_CUSTOM_TOAST` - Toast customizado

**Helpers:**

- `createMockToastContainer()` - Cria um mock do toast container
- `setupToastContainerMock()` - Configura o mock do container no window
- `cleanupToastContainerMock()` - Limpa o mock do container do window

**Exemplo de uso:**

```typescript
import { setupToastContainerMock, cleanupToastContainerMock } from '../../shared/__mocks__';

let mockContainer: any;

beforeEach(() => {
  mockContainer = setupToastContainerMock();
});

afterEach(() => {
  cleanupToastContainerMock();
});

it('should show success toast', () => {
  service.success('Test message');
  expect(mockContainer.addToast).toHaveBeenCalled();
});
```

## ✨ Boas Práticas

1. **Sempre use os mocks existentes** antes de criar novos
2. **Adicione novos mocks aqui** quando criar dados reutilizáveis
3. **Documente novos mocks** com comentários JSDoc
4. **Mantenha os mocks simples** e focados
5. **Exporte tudo pelo index.ts** para facilitar importações

## 🔄 Adicionando Novos Mocks

1. Crie um novo arquivo `*.mock.ts` na pasta `__mocks__`
2. Exporte as constantes e helpers necessários
3. Adicione o export no `index.ts`
4. Documente no README.md
5. Use em seus testes!

## 📝 Exemplo Completo

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { MOCK_KANBAN_COLUMNS, MOCK_KANBAN_CARDS, MOCK_MODAL_CONFIG } from '../../shared/__mocks__';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should initialize with kanban columns', () => {
    component.columns = MOCK_KANBAN_COLUMNS;

    expect(component.columns.length).toBe(4);
    expect(component.columns[0].id).toBe('pending');
  });

  it('should open modal with card data', () => {
    const card = MOCK_KANBAN_CARDS[0];

    component.openDetailsModal(card);

    expect(modalService.open).toHaveBeenCalledWith(
      jasmine.objectContaining({
        id: 'solicitation-details',
      })
    );
  });
});
```

## 🎯 Benefícios

- ✅ **Reduz duplicação** de código nos testes
- ✅ **Facilita manutenção** centralizada
- ✅ **Acelera criação** de novos testes
- ✅ **Padroniza dados** de teste
- ✅ **Melhora legibilidade** dos testes
- ✅ **Type-safe** com TypeScript

---

**💡 Dica:** Use auto-complete do seu IDE para descobrir todos os mocks disponíveis ao importar de `__mocks__`!
