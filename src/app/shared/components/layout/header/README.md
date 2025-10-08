# DS-Header Component

Componente de cabeçalho reutilizável para a aplicação.

## Como Usar

### Importação

```typescript
import { HeaderComponent } from '../../../shared';
```

### Uso Básico

```html
<ds-header title="Dashboard" subtitle="Bem-vindo ao sistema"> </ds-header>
```

### Com Botão de Voltar

```html
<ds-header title="Detalhes da Solicitação" [showBackButton]="true" (onBackClick)="goBack()">
</ds-header>
```

### Com Menu de Usuário

```html
<ds-header
  title="Perfil"
  [showUserMenu]="true"
  userName="João Silva"
  userEmail="joao@email.com"
  userAvatar="/assets/avatars/joao.jpg"
  (onUserMenuClick)="openUserMenu()"
  (onLogoutClick)="logout()"
>
</ds-header>
```

### Com Menu Hambúrguer

```html
<ds-header title="Menu Principal" [showMenuButton]="true" (onMenuClick)="toggleSidebar()">
</ds-header>
```

## Props

### Inputs

- `title: string` - Título principal do header
- `subtitle: string` - Subtítulo (opcional)
- `showBackButton: boolean` - Mostra botão de voltar
- `showMenuButton: boolean` - Mostra botão de menu hambúrguer
- `showUserMenu: boolean` - Mostra menu do usuário
- `userAvatar: string` - URL do avatar do usuário
- `userName: string` - Nome do usuário
- `userEmail: string` - Email do usuário
- `variant: 'default' | 'transparent' | 'elevated'` - Variante visual
- `size: 'sm' | 'md' | 'lg'` - Tamanho do header

### Outputs

- `onBackClick: EventEmitter<void>` - Emitido ao clicar no botão voltar
- `onMenuClick: EventEmitter<void>` - Emitido ao clicar no botão menu
- `onUserMenuClick: EventEmitter<void>` - Emitido ao clicar no menu do usuário
- `onLogoutClick: EventEmitter<void>` - Emitido ao clicar em logout

## Variantes

### Default

```html
<ds-header title="Título" variant="default"> </ds-header>
```

### Transparent

```html
<ds-header title="Título" variant="transparent"> </ds-header>
```

### Elevated

```html
<ds-header title="Título" variant="elevated"> </ds-header>
```

## Tamanhos

### Small

```html
<ds-header title="Título" size="sm"> </ds-header>
```

### Medium (padrão)

```html
<ds-header title="Título" size="md"> </ds-header>
```

### Large

```html
<ds-header title="Título" size="lg"> </ds-header>
```

## Responsividade

- **Desktop**: Mostra todas as informações do usuário
- **Mobile**: Esconde informações do usuário, mantém apenas avatar
- **Tablet**: Adapta tamanhos de fonte e espaçamentos

## Estilos

O componente usa as variáveis do design system:

- Cores: `var(--primary-medium)`, `var(--label)`, `var(--stroke)`
- Tipografia: `$font-primary`, `$font-xl`, `$font-weight-bold`
- Espaçamentos: `$padding-md`, `$padding-sm`, `$padding-xs`
- Bordas: `$border-radius-md`
