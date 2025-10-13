# Messages Component

Componente de chat/mensagens para comunicação entre usuários.

## Características

- ✅ Header com título e controles (minimizar/fechar)
- ✅ Lista de mensagens com avatares
- ✅ Suporte a menções (@usuário)
- ✅ Anexos de arquivos
- ✅ Campo de entrada com ações (mencionar, anexar, enviar)
- ✅ Estado minimizado
- ✅ Scroll automático para novas mensagens
- ✅ Formatação de mensagens com HTML
- ✅ Diferenciação visual entre mensagens próprias e de outros usuários

## Uso

### Importação

```typescript
import { MessagesComponent, Message } from '@shared/components';
```

### Template Básico

```html
<app-messages
  [messages]="messages"
  (messageSent)="onMessageSent($event)"
  (closed)="onClosed()"
  (minimized)="onMinimized($event)"
>
</app-messages>
```

### Exemplo no Component

```typescript
import { Component } from '@angular/core';
import { Message } from '@shared/components';

@Component({
  selector: 'app-my-component',
  templateUrl: './my-component.html',
})
export class MyComponent {
  messages: Message[] = [
    {
      id: '1',
      author: 'João da Silva - Advisor',
      text: 'Bom dia, equipe. Alguma atualização sobre a solicitação?',
      timestamp: 'Hoje às 09:32',
      isOwn: false,
    },
    {
      id: '2',
      author: 'Gestor - João',
      text: 'Bom dia, @João da Silva! A solicitação está em revisão final.',
      timestamp: 'Hoje às 09:35',
      isOwn: true,
      attachment: {
        name: 'analise_solicitacao_1234.pdf',
        url: '/files/analise.pdf',
      },
    },
  ];

  onMessageSent(text: string): void {
    const newMessage: Message = {
      id: Date.now().toString(),
      author: 'Você',
      text: text,
      timestamp: 'Agora',
      isOwn: true,
    };
    this.messages = [...this.messages, newMessage];
  }

  onClosed(): void {
    console.log('Chat fechado');
  }

  onMinimized(isMinimized: boolean): void {
    console.log('Chat minimizado:', isMinimized);
  }
}
```

## Inputs

| Nome         | Tipo        | Default | Descrição                                                                                        |
| ------------ | ----------- | ------- | ------------------------------------------------------------------------------------------------ |
| `messages`   | `Message[]` | `[]`    | Lista de mensagens a serem exibidas                                                              |
| `showHeader` | `boolean`   | `true`  | Exibe ou oculta o header (título, minimizar, fechar). Quando false, mostra apenas balões e input |

## Outputs

| Nome          | Tipo                    | Descrição                                     |
| ------------- | ----------------------- | --------------------------------------------- |
| `messageSent` | `EventEmitter<string>`  | Emitido quando uma nova mensagem é enviada    |
| `closed`      | `EventEmitter<void>`    | Emitido quando o chat é fechado               |
| `minimized`   | `EventEmitter<boolean>` | Emitido quando o chat é minimizado/maximizado |

## Interface Message

```typescript
interface Message {
  id: string; // ID único da mensagem
  author: string; // Nome do autor
  text: string; // Texto da mensagem (suporta HTML)
  timestamp: string; // Timestamp formatado
  isOwn: boolean; // Se é mensagem do usuário atual
  attachment?: {
    // Anexo opcional
    name: string;
    url: string;
  };
}
```

## Métodos Públicos

| Método                        | Descrição                           |
| ----------------------------- | ----------------------------------- |
| `sendMessage()`               | Envia uma nova mensagem             |
| `close()`                     | Fecha o chat                        |
| `toggleMinimize()`            | Alterna entre minimizado/maximizado |
| `openMentions()`              | Abre seletor de menções             |
| `openAttachment()`            | Abre seletor de anexos              |
| `formatMessage(text: string)` | Formata texto com menções           |

## Menções

O componente suporta menções com `@`. Exemplo:

```typescript
text: 'Olá @João da Silva, tudo bem?';
```

As menções são automaticamente formatadas com destaque visual.

## Estados

- **Normal**: Chat expandido e funcional
- **Minimizado**: Apenas o header é visível

## Personalização de Estilos

O componente usa as variáveis SCSS do projeto:

- `$primary-gradient`: Gradiente do header
- `$secondary-medium`: Cor das menções e ícones
- `$background`: Cor de fundo do container
- `$stroke`: Cor das bordas
- `$label`: Cor dos textos secundários
- `$border-radius-*`: Raios de borda

## Acessibilidade

- ✅ Labels ARIA em botões
- ✅ Navegação por teclado (Enter para enviar)
- ✅ Estados de disabled para inputs

## Testes

O componente possui 52 testes unitários cobrindo:

- Inicialização do componente
- Propriedades de entrada
- Renderização do template
- Formatação de mensagens
- Envio de mensagens
- Minimizar/fechar
- Interações do usuário
- Testes de integração
- Casos extremos

Para rodar os testes:

```bash
npm test -- --include='**/messages.component.spec.ts'
```
