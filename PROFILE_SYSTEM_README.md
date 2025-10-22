# 🎯 Sistema de Perfis - Vetor 360

## 📋 Visão Geral

Sistema completo de controle de acesso baseado em perfis de usuário para a aplicação Vetor 360. Permite controlar visibilidade de componentes, proteção de rotas e funcionalidades baseadas no perfil do usuário logado.

## 🏗️ Estrutura Implementada

### 📁 Arquivos Criados

```
src/app/shared/
├── types/
│   └── profile.types.ts                    # Tipos e interfaces
├── services/profile/
│   ├── profile.service.ts                  # Serviço principal
│   └── index.ts
├── guards/
│   ├── profile.guard.ts                   # Guard para proteção de rotas
│   └── index.ts
├── directives/
│   ├── profile-if.directive.ts            # Diretiva *profileIf
│   └── index.ts
├── pipes/
│   ├── profile.pipe.ts                    # Pipe para templates
│   └── index.ts
├── config/
│   ├── profile-permissions.config.ts     # Configuração de permissões
│   └── index.ts
├── examples/
│   ├── profile-usage.examples.ts         # Exemplos de uso
│   ├── routes-with-profiles.example.ts   # Exemplos de rotas
│   └── profile-demo.component.ts         # Componente de demonstração
└── docs/
    └── PROFILE_SYSTEM.md                 # Documentação completa
```

## 🚀 Funcionalidades

### 1. **ProfileService** - Serviço Principal

- ✅ Gerenciamento de usuário atual
- ✅ Verificação de permissões
- ✅ Controle de acesso a rotas
- ✅ Signals reativos para Angular
- ✅ Persistência em localStorage

### 2. **ProfileGuard** - Proteção de Rotas

- ✅ Proteção baseada em perfil
- ✅ Proteção baseada em permissões
- ✅ Redirecionamento automático
- ✅ Decorators para facilitar uso

### 3. **ProfileIfDirective** - Controle de Visibilidade

- ✅ `*profileIf` - Mostrar baseado no perfil
- ✅ `*profileIfComponent` - Mostrar baseado em permissões
- ✅ `*profileIfNot` - Inverter lógica
- ✅ Suporte a múltiplos perfis

### 4. **ProfilePipe** - Uso em Templates

- ✅ `profile:'hasPermission'` - Verificar permissão
- ✅ `profile:'hasProfile'` - Verificar perfil
- ✅ `profile:'canAccess'` - Verificar acesso a rota
- ✅ `profile:'getProfile'` - Obter perfil atual

### 5. **Configuração de Permissões**

- ✅ Mapeamento por perfil
- ✅ Configuração de rotas
- ✅ Helper functions
- ✅ Sistema extensível

## 👥 Perfis Implementados

### 🎯 GESTOR_ACESSEBANK

- Acesso completo ao sistema
- Relatórios e exportação
- Gestão de usuários
- Configurações avançadas
- Analytics e financeiro

### 🤝 PARCEIRO_ACESSEBANK

- Acesso limitado
- Visualização de relatórios
- Gestão do próprio perfil
- Acesso básico ao financeiro

## 💻 Como Usar

### 1. **Configuração Básica**

```typescript
// Definir usuário
const user = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  profile: UserProfile.GESTOR_ACESSEBANK,
};

this.profileService.setCurrentUser(user);
```

### 2. **Proteção de Rotas**

```typescript
// Usando decorators
{
  path: 'dashboard',
  component: DashboardComponent,
  ...requireProfile([UserProfile.GESTOR_ACESSEBANK, UserProfile.PARCEIRO_ACESSEBANK])
}

// Usando permissões
{
  path: 'reports',
  component: ReportsComponent,
  ...requirePermissions([{ component: 'reports', action: 'view' }])
}
```

### 3. **Controle de Visibilidade**

```html
<!-- Mostrar apenas para Gestor -->
<div *profileIf="'GESTOR_ACESSEBANK'">Conteúdo exclusivo</div>

<!-- Mostrar baseado em permissão -->
<div *profileIfComponent="'reports'" *profileIfAction="'export'">
  <button>Exportar</button>
</div>

<!-- Esconder para Parceiro -->
<div *profileIf="'PARCEIRO_ACESSEBANK'" *profileIfNot="true">Conteúdo restrito</div>
```

### 4. **Verificações Programáticas**

```typescript
// Verificar permissão
if (this.profileService.hasPermission('reports', 'export')) {
  // Usuário pode exportar
}

// Verificar múltiplas permissões
const canManage = this.profileService.hasAllPermissions([
  { component: 'users', action: 'view' },
  { component: 'users', action: 'edit' },
]);
```

## 🎨 Exemplos Práticos

### Dashboard Condicional

```html
<ng-container [ngSwitch]="profileService.currentProfile()">
  <div *ngSwitchCase="'GESTOR_ACESSEBANK'">
    <h3>Dashboard do Gestor</h3>
    <div class="gestor-widgets">
      <div>Relatórios Financeiros</div>
      <div>Gestão de Usuários</div>
    </div>
  </div>

  <div *ngSwitchCase="'PARCEIRO_ACESSEBANK'">
    <h3>Dashboard do Parceiro</h3>
    <div class="parceiro-widgets">
      <div>Meus Relatórios</div>
      <div>Perfil</div>
    </div>
  </div>
</ng-container>
```

### Menu de Navegação Dinâmico

```html
<nav>
  <a routerLink="/dashboard" *ngIf="profileService.hasPermission('dashboard', 'view')">
    Dashboard
  </a>
  <a routerLink="/reports" *ngIf="profileService.hasPermission('reports', 'view')"> Relatórios </a>
</nav>
```

## 🔧 Integração

### 1. **Importar no Módulo/Componente**

```typescript
import { ProfileService, ProfileIfDirective, ProfilePipe } from '@shared';
```

### 2. **Configurar Rotas**

```typescript
import { requireProfile, requirePermissions } from '@shared/guards';
```

### 3. **Usar em Templates**

```html
<div *profileIf="'GESTOR_ACESSEBANK'">
  <!-- Conteúdo -->
</div>
```

## 📚 Documentação

- **Documentação Completa**: `src/app/shared/docs/PROFILE_SYSTEM.md`
- **Exemplos de Uso**: `src/app/shared/examples/`
- **Componente Demo**: `src/app/shared/examples/profile-demo.component.ts`

## 🧪 Testando o Sistema

1. **Componente Demo**: Use o `ProfileDemoComponent` para testar todas as funcionalidades
2. **Diferentes Perfis**: Teste com cada perfil para ver as diferenças
3. **Permissões**: Verifique se as permissões estão funcionando corretamente

## 🚀 Próximos Passos

1. **Integrar com Autenticação**: Conectar com seu sistema de login
2. **Configurar Rotas**: Aplicar proteção nas rotas existentes
3. **Personalizar Permissões**: Ajustar conforme suas necessidades
4. **Testar**: Usar o componente demo para validar

## ✨ Benefícios

- 🎯 **Controle Granular**: Permissões específicas por componente
- 🔒 **Segurança**: Proteção de rotas e funcionalidades
- 🎨 **UX Melhorada**: Interface adaptada ao perfil do usuário
- 🔧 **Flexibilidade**: Fácil de estender e modificar
- 📱 **Reativo**: Atualizações automáticas com signals
- 🧪 **Testável**: Componente demo para validação

---

**Sistema implementado com sucesso! 🎉**

Agora você tem um sistema completo de perfis que permite controlar acesso a qualquer parte da sua aplicação baseado no perfil do usuário logado.
