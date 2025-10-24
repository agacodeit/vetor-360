# Sistema de Perfis - Documentação

## Visão Geral

O sistema de perfis permite controlar o acesso a componentes, rotas e funcionalidades baseado no perfil do usuário logado. O sistema é flexível e permite diferentes níveis de controle de acesso.

## Estrutura do Sistema

### 1. Tipos e Enums (`types/profile.types.ts`)

```typescript
enum UserProfile {
  GESTOR_ACESSEBANK = 'GESTOR_ACESSEBANK',
  PARCEIRO_ACESSEBANK = 'PARCEIRO_ACESSEBANK',
}
```

### 2. ProfileService (`services/profile/profile.service.ts`)

Serviço principal que gerencia:

- Usuário atual
- Verificação de permissões
- Controle de acesso a rotas
- Gerenciamento de estado

### 3. ProfileGuard (`guards/profile.guard.ts`)

Guard para proteção de rotas baseado em:

- Perfil do usuário
- Permissões específicas
- Redirecionamento automático

### 4. ProfileIfDirective (`directives/profile-if.directive.ts`)

Diretiva para controlar visibilidade de elementos:

- `*profileIf` - Mostra baseado no perfil
- `*profileIfComponent` - Mostra baseado em permissões
- `*profileIfNot` - Inverte a lógica

### 5. ProfilePipe (`pipes/profile.pipe.ts`)

Pipe para uso em templates:

- `profile:'hasPermission'` - Verifica permissão
- `profile:'hasProfile'` - Verifica perfil
- `profile:'canAccess'` - Verifica acesso a rota

## Como Usar

### 1. Configuração Inicial

```typescript
// No seu componente ou serviço
import { ProfileService } from '@shared/services/profile';
import { UserProfile } from '@shared/types';

constructor(private profileService: ProfileService) {}

// Definir usuário atual
const user = {
  id: '1',
  name: 'João Silva',
  email: 'joao@example.com',
  profile: UserProfile.GESTOR_ACESSEBANK
};

this.profileService.setCurrentUser(user);
```

### 2. Proteção de Rotas

```typescript
// app.routes.ts
import { requireProfile, requirePermissions } from '@shared/guards';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    ...requireProfile([UserProfile.GESTOR_ACESSEBANK, UserProfile.PARCEIRO_ACESSEBANK]),
  },
  {
    path: 'admin',
    component: AdminComponent,
    ...requirePermissions([{ component: 'admin', action: 'manage' }]),
  },
];
```

### 3. Controle de Visibilidade em Templates

```html
<!-- Mostrar apenas para GESTOR_ACESSEBANK -->
<div *profileIf="'GESTOR_ACESSEBANK'">Conteúdo exclusivo para gestores</div>

<!-- Mostrar para múltiplos perfis -->
<div *profileIf="['GESTOR_ACESSEBANK', 'PARCEIRO_ACESSEBANK']">
  Conteúdo para gestores e parceiros
</div>

<!-- Mostrar baseado em permissão -->
<div *profileIfComponent="'reports'" *profileIfAction="'export'">
  <button>Exportar Relatórios</button>
</div>

<!-- Esconder para perfil específico -->
<div *profileIf="'PARCEIRO_ACESSEBANK'" *profileIfNot="true">Conteúdo restrito</div>
```

### 4. Uso do Pipe

```html
<!-- Verificar permissão -->
<div *ngIf="'reports' | profile:'hasPermission':'reports':'export'">
  <button>Exportar</button>
</div>

<!-- Verificar perfil -->
<div *ngIf="'GESTOR_ACESSEBANK' | profile:'hasProfile'">
  <h4>Bem-vindo, Gestor!</h4>
</div>

<!-- Mostrar perfil atual -->
<p>Perfil: {{ null | profile:'getProfile' }}</p>
```

### 5. Verificação Programática

```typescript
// Verificar permissão específica
if (this.profileService.hasPermission('reports', 'export')) {
  // Usuário pode exportar relatórios
}

// Verificar perfil
if (this.profileService.getCurrentUser()?.userTypeEnum === UserProfile.GESTOR_ACESSEBANK) {
  // Usuário é gestor
}

// Verificar múltiplas permissões
const canManage = this.profileService.hasAllPermissions([
  { component: 'users', action: 'view' },
  { component: 'users', action: 'edit' },
]);

// Verificar qualquer permissão
const canViewReports = this.profileService.hasAnyPermission([
  { component: 'reports', action: 'view' },
  { component: 'analytics', action: 'view' },
]);
```

## Configuração de Permissões

### 1. Definir Permissões por Perfil

```typescript
// profile-permissions.config.ts
export const PROFILE_PERMISSIONS_CONFIG: ProfileConfig[] = [
  {
    profile: UserProfile.GESTOR_ACESSEBANK,
    description: 'Gestor com acesso completo',
    permissions: [
      { component: 'dashboard', action: 'view' },
      { component: 'reports', action: 'view' },
      { component: 'reports', action: 'export' },
      { component: 'users', action: 'manage' },
    ],
  },
];
```

### 2. Mapear Rotas para Permissões

```typescript
export const ROUTE_PERMISSIONS_CONFIG = {
  '/authorized/reports': {
    requiredPermissions: [{ component: 'reports', action: 'view' }],
  },
  '/authorized/admin': {
    requiredPermissions: [{ component: 'admin', action: 'manage' }],
  },
};
```

## Exemplos Práticos

### 1. Dashboard Condicional

```html
<ng-container [ngSwitch]="profileService.currentProfile()">
  <div *ngSwitchCase="'GESTOR_ACESSEBANK'">
    <h3>Dashboard do Gestor</h3>
    <div class="gestor-widgets">
      <div>Relatórios Financeiros</div>
      <div>Gestão de Usuários</div>
      <div>Configurações Avançadas</div>
    </div>
  </div>

  <div *ngSwitchCase="'PARCEIRO_ACESSEBANK'">
    <h3>Dashboard do Parceiro</h3>
    <div class="parceiro-widgets">
      <div>Meus Relatórios</div>
      <div>Perfil</div>
      <div>Informações Básicas</div>
    </div>
  </div>
</ng-container>
```

### 2. Menu de Navegação Dinâmico

```html
<nav>
  <a routerLink="/dashboard" *ngIf="profileService.hasPermission('dashboard', 'view')">
    Dashboard
  </a>
  <a routerLink="/reports" *ngIf="profileService.hasPermission('reports', 'view')"> Relatórios </a>
</nav>
```

### 3. Botões de Ação Condicionais

```html
<div class="action-buttons">
  <button *ngIf="profileService.hasPermission('reports', 'export')" (click)="exportReports()">
    Exportar Relatórios
  </button>

  <button *ngIf="profileService.hasPermission('users', 'create')" (click)="createUser()">
    Criar Usuário
  </button>
</div>
```

## Integração com Autenticação

```typescript
// auth.service.ts
import { ProfileService } from '@shared/services/profile';

@Injectable()
export class AuthService {
  constructor(private profileService: ProfileService) {}

  async login(credentials: LoginCredentials): Promise<void> {
    const response = await this.http.post('/api/login', credentials).toPromise();

    // Definir usuário após login bem-sucedido
    this.profileService.setCurrentUser({
      id: response.user.id,
      name: response.user.name,
      email: response.user.email,
      profile: response.user.userTypeEnum,
    });
  }

  logout(): void {
    this.profileService.clearCurrentUser();
  }
}
```

## Boas Práticas

1. **Sempre verificar permissões no backend** - O controle no frontend é apenas para UX
2. **Use guards para rotas sensíveis** - Proteja rotas administrativas
3. **Combine permissões quando necessário** - Use `hasAllPermissions` para ações complexas
4. **Documente suas permissões** - Mantenha a configuração atualizada
5. **Teste diferentes perfis** - Verifique o comportamento com cada perfil

## Troubleshooting

### Problema: Diretiva não funciona

**Solução**: Verifique se a diretiva está importada no módulo ou componente

### Problema: Guard redireciona incorretamente

**Solução**: Verifique se as permissões estão configuradas corretamente

### Problema: Pipe não atualiza

**Solução**: O pipe é impure, deve reagir automaticamente às mudanças do serviço

## Extensibilidade

O sistema é facilmente extensível:

1. **Novos perfis**: Adicione ao enum `UserProfile`
2. **Novas permissões**: Adicione à configuração de perfil
3. **Novos guards**: Crie guards específicos para casos complexos
4. **Novas diretivas**: Crie diretivas específicas para casos de uso únicos
