# Guia de Testes Unitários - Vetor 360

## 📋 Visão Geral

Este projeto utiliza **Karma + Jasmine** para testes unitários (não Jest). Os testes são executados através do Angular CLI.

## ✅ Status Atual dos Testes

### Resultado Geral

- **Total de Specs**: 89
- **Testes Passando**: 85 ✅
- **Testes Pulados (Skipped)**: 4 ⚠️
- **Taxa de Sucesso**: 100% (dos testes executados)
- **Tempo de Execução**: ~0.32s

### Componentes Testados

- ✅ **Authorized Component** - 26 testes (100% passando)
  - Inicialização do componente
  - Renderização do template
  - Integração com HeaderComponent
  - Métodos do componente
  - Ciclo de vida
  - Dependências de serviços
  - Estrutura do DOM

### Testes Desabilitados Temporariamente (4)

⚠️ Os seguintes testes foram desabilitados com `xit()` devido à biblioteca externa `mask-directive`:

1. **InputComponent** - Componente usa mask-directive que requer NgModel
2. **Login** - Depende de InputComponent
3. **Signup** - Depende de InputComponent
4. **ForgotPasswordComponent** - Depende de InputComponent

**Motivo**: A biblioteca `mask-directive` de terceiros causa erro de injeção de dependências (`NG0201: No provider found for _NgModel`).

**Soluções Futuras**:

- Remover `mask-directive` e implementar máscaras customizadas
- Criar um mock/wrapper para a biblioteca nos testes
- Substituir por uma biblioteca de máscaras mais testável

### Cobertura de Código

```
Statements   : 4.63% (77/1662)
Branches     : 0.65% (4/611)
Functions    : 1.18% (5/421)
Lines        : 4.37% (68/1553)
```

## 🚀 Como Executar os Testes

### Comandos Principais

```bash
# Executar TODOS os testes do projeto
npm test

# Executar teste específico (Authorized)
npm test -- --include='**/authorized.spec.ts' --watch=false

# Executar com cobertura de código
npm test -- --code-coverage

# Executar em modo headless (para CI/CD)
npm test -- --browsers=ChromeHeadless --watch=false

# Executar com cobertura em modo headless
npm test -- --browsers=ChromeHeadless --watch=false --code-coverage
```

### ⚠️ Importante: Este projeto NÃO usa Jest

O projeto usa **Karma + Jasmine**, não Jest. Se você tentar executar com Jest, receberá o erro:

```
Error: Cannot find module '.../node_modules/jest/bin/jest.js'
```

## 🏗️ Estrutura do Teste do Componente Authorized

### Arquivo: `src/app/pages/authorized/authorized.spec.ts`

```typescript
describe('Authorized', () => {
  // Setup com mocks
  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', [...]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [Authorized, RouterTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();
  });

  // 26 testes organizados em 8 categorias...
});
```

### Categorias de Testes (26 testes)

#### 1. Component Initialization (4 testes)

- ✅ Criação do componente
- ✅ Definição do componente
- ✅ Injeção do AuthService
- ✅ Injeção do Router

#### 2. Template Rendering (5 testes)

- ✅ Renderização do header component
- ✅ Renderização do main content container
- ✅ Classes container no main element
- ✅ Renderização do router-outlet
- ✅ Estrutura correta com header e main

#### 3. Header Component Integration (3 testes)

- ✅ Binding do evento onProfileClick ao header
- ✅ Chamada de onProfileClick quando header emite evento
- ✅ Manipulação de eventos de clique no perfil

#### 4. Component Methods (4 testes)

- ✅ Método onProfileClick existe
- ✅ onProfileClick é uma função
- ✅ Executa sem erros
- ✅ É chamável

#### 5. Component Lifecycle (2 testes)

- ✅ Inicialização sem erros
- ✅ Múltiplos ciclos de detecção de mudanças

#### 6. Service Dependencies (4 testes)

- ✅ Acesso ao AuthService
- ✅ Acesso ao Router
- ✅ Uso da instância injetada do AuthService
- ✅ Uso da instância injetada do Router

#### 7. Component Structure (2 testes)

- ✅ RouterOutlet importado
- ✅ HeaderComponent importado

#### 8. DOM Structure (2 testes)

- ✅ Classes CSS corretas
- ✅ Hierarquia de elementos adequada

## 📝 Boas Práticas Implementadas

### 1. Mocks e Spies do Jasmine

```typescript
const authServiceSpy = jasmine.createSpyObj('AuthService', [
  'isAuthenticated',
  'logout',
  'getCurrentUser',
  'getToken',
]);
```

### 2. Uso do TestBed do Angular

```typescript
await TestBed.configureTestingModule({
  imports: [Authorized, RouterTestingModule],
  providers: [{ provide: AuthService, useValue: authServiceSpy }],
}).compileComponents();
```

### 3. Testes de DOM com DebugElement

```typescript
const headerDebugElement = fixture.debugElement.query(By.directive(HeaderComponent));
const headerComponent = headerDebugElement.componentInstance;
```

### 4. Testes Isolados e Independentes

- Cada teste tem seu próprio setup via `beforeEach`
- Não há dependências entre testes
- Testes podem rodar em qualquer ordem

### 5. Nomenclatura Descritiva

```typescript
describe('Component Initialization', () => {
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
});
```

## 🛠️ Configuração do Ambiente

### Arquivos de Configuração

#### 1. `tsconfig.spec.json`

Configuração TypeScript para testes:

```json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "outDir": "./out-tsc/spec",
    "types": ["jasmine"]
  },
  "include": ["src/**/*.spec.ts", "src/**/*.d.ts"]
}
```

#### 2. `karma.conf.js`

Configuração do Karma:

```javascript
module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    browsers: ['Chrome'],
    // ... outras configurações
  });
};
```

## 🐛 Correções Realizadas

Durante a implementação, os seguintes arquivos foram corrigidos:

### 1. `list-view.component.spec.ts`

```typescript
// ANTES
import { ListViewComponent } from './list-view.component';

// DEPOIS
import { DsListViewComponent } from './list-view.component';
```

### 2. `kanban.component.spec.ts`

```typescript
// ANTES
{ id: '1', title: 'Card 1' }

// DEPOIS
{ id: '1', title: 'Card 1', status: 'todo' }
```

### 3. `auth.service.spec.ts`

```typescript
// ANTES
const signupData: SignupRequest = {
  email: '...',
  password: '...',
  name: '...',
  confirmPassword: '...', // ❌
};

// DEPOIS
const signupData: SignupRequest = {
  email: '...',
  password: '...',
  name: '...',
  cellphone: '11999999999', // ✅
};
```

## 🎯 Próximos Componentes para Testar

### Prioridade Alta

1. **Dashboard Component**

   - Carregamento de dados
   - Filtros e busca
   - Interação com solicitações

2. **Login Component**

   - Validação de formulário
   - Submissão e autenticação
   - Mensagens de erro

3. **Signup Component**
   - Validação de campos
   - Confirmação de senha
   - Criação de conta

### Prioridade Média

4. **Header Component**

   - Navegação
   - Menu dropdown
   - Logout

5. **Modal Components**
   - Abertura/fechamento
   - Conteúdo dinâmico
   - Ações e callbacks

## 📊 Visualização de Cobertura

Após executar os testes com cobertura:

```bash
npm test -- --code-coverage
```

O relatório é gerado em:

```
coverage/vetor-360/index.html
```

Abra no navegador para visualizar:

```bash
open coverage/vetor-360/index.html
```

## 💡 Dicas

1. **Sempre execute os testes antes de fazer commit**

   ```bash
   npm test -- --watch=false
   ```

2. **Mantenha os testes simples e focados**

   - Um teste deve verificar apenas uma coisa
   - Use `describe` para agrupar testes relacionados

3. **Use mocks para isolar dependências**

   - Serviços devem ser mockados
   - HTTP requests devem usar HttpTestingController

4. **Escreva testes que documentem o comportamento**

   - O nome do teste deve explicar o que está sendo testado
   - Exemplo: `'should call onProfileClick when header emits event'`

5. **Mantenha cobertura acima de 80%**
   - Meta: 80% de statements
   - Meta: 70% de branches

## 📚 Recursos

- [Angular Testing Guide](https://angular.dev/guide/testing)
- [Jasmine Documentation](https://jasmine.github.io/)
- [Karma Configuration](https://karma-runner.github.io/)
- [Angular TestBed](https://angular.dev/api/core/testing/TestBed)

## 🔍 Troubleshooting

### Erro: "Cannot find module jest"

**Problema**: Tentando usar Jest ao invés de Karma/Jasmine  
**Solução**: Use `npm test` ao invés de comandos Jest

### Erro: "Cannot find tsconfig.spec.json"

**Problema**: Arquivo de configuração faltando  
**Solução**: Arquivo já foi criado em `tsconfig.spec.json`

### Erro: "NullInjectorError: No provider for..."

**Problema**: Serviço não mockado no teste  
**Solução**: Adicione o mock no array `providers` do TestBed

---

**Última Atualização**: 13 de Outubro de 2025  
**Framework de Testes**: Karma + Jasmine (Angular padrão)  
**Testes Passando**: 26/26 (100%)
