# MessageContainer Component

Componente de chat flutuante com botão FAB (Floating Action Button) fixo no canto inferior direito da tela.

## Características

- ✅ Botão flutuante fixo no canto inferior direito
- ✅ Ícone de mensagem animado
- ✅ Badge de notificação para novas mensagens
- ✅ Chat popup que aparece acima do botão
- ✅ Animação de abertura suave (slide up)
- ✅ Totalmente responsivo
- ✅ Usa o componente `MessagesComponent` com header

## Uso

### Importação

```typescript
import { MessageContainerComponent } from '@shared/components';
```

### Template Básico

```html
<!-- Adicione em seu layout principal (ex: app.component.html) -->
<app-message-container />
```

### Exemplo no App Component

```typescript
import { Component } from '@angular/core';
import { MessageContainerComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [MessageContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-message-container />
  `,
})
export class AppComponent {}
```

## Funcionalidades

### **1. Botão Flutuante (FAB)**

- Posicionado no canto inferior direito
- Gradiente primário por padrão
- Muda para cor secundária quando ativo
- Animação ao hover (scale)
- Ícone: `fa-comment-dots`

### **2. Badge de Notificação**

- Aparece quando há novas mensagens
- Animação de pulse
- Oculta quando chat está aberto

### **3. Popup de Chat**

- Abre acima do botão FAB
- Usa `MessagesComponent` com `showHeader="true"`
- Animação de slide up ao abrir
- Controles de minimizar e fechar

### **4. Responsividade**

- Desktop: Popup fixo no canto direito
- Mobile (≤768px): Popup ocupa largura da tela com margem

## Propriedades

### **Estado Interno**

| Propriedade      | Tipo        | Default | Descrição                           |
| ---------------- | ----------- | ------- | ----------------------------------- |
| `isOpen`         | `boolean`   | `false` | Controla se o chat está aberto      |
| `hasNewMessages` | `boolean`   | `false` | Controla exibição do badge          |
| `messages`       | `Message[]` | `[...]` | Mensagens iniciais (personalizável) |

## Métodos

| Método            | Descrição                                  |
| ----------------- | ------------------------------------------ |
| `toggleChat()`    | Abre/fecha o chat                          |
| `onMessageSent()` | Adiciona nova mensagem enviada             |
| `onClosed()`      | Fecha o chat (evento do MessagesComponent) |
| `onMinimized()`   | Fecha o chat quando minimizado             |

## Personalização

### **Mensagens Iniciais**

Edite o array `messages` no componente:

```typescript
messages: Message[] = [
  {
    id: '1',
    author: 'Suporte - Ana',
    text: 'Olá! Como posso ajudá-lo hoje?',
    timestamp: 'Hoje às 14:30',
    isOwn: false
  }
];
```

### **Posição do Botão**

Altere no SCSS:

```scss
.message-fab {
  bottom: 24px; // Distância do bottom
  right: 24px; // Distância da direita
}
```

### **Cores**

O componente usa variáveis do projeto:

- `$primary-gradient`: Botão FAB normal
- `$secondary-medium`: Botão FAB ativo
- `#dc3545`: Badge de notificação (vermelho)

## Estrutura HTML

```html
<!-- Botão Flutuante -->
<button class="message-fab">
  <span class="message-fab__badge"></span>
  <!-- Badge opcional -->
  <i class="message-fab__icon"></i>
</button>

<!-- Popup do Chat -->
<div class="message-popup">
  <app-messages [showHeader]="true" />
</div>
```

## Animações

### **Slide Up (abertura)**

```scss
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### **Pulse (badge)**

```scss
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0.7);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(220, 53, 69, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(220, 53, 69, 0);
  }
}
```

## Z-Index

- Botão FAB: `z-index: 1000`
- Popup Chat: `z-index: 999`

## Acessibilidade

- ✅ `aria-label` no botão FAB
- ✅ Cursor pointer
- ✅ Estados de foco visíveis
- ✅ Animações suaves

## Integração com Backend (Futuro)

Para adicionar funcionalidades em tempo real:

```typescript
// 1. Integrar com WebSocket para mensagens em tempo real
// 2. Marcar mensagens como lidas
// 3. Carregar histórico de mensagens
// 4. Notificações de novas mensagens
```

## Exemplo Completo

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { MessageContainerComponent } from '@shared/components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MessageContainerComponent],
  template: `
    <router-outlet></router-outlet>
    <app-message-container />
  `,
})
export class AppComponent {}
```

**O chat flutuante estará disponível em todas as páginas!** 🎉
