# DS Kanban Component

Um componente de quadro Kanban completo com funcionalidade de drag & drop, integrado ao design system.

## Funcionalidades

- ✅ **Drag & Drop**: Arraste cards entre colunas
- ✅ **Colunas Dinâmicas**: Adicione, edite e remova colunas
- ✅ **Cards Personalizáveis**: Título, descrição, prioridade, responsável, data de vencimento, tags
- ✅ **Responsivo**: Adapta-se a diferentes tamanhos de tela
- ✅ **Integração com DS**: Utiliza componentes do design system (Card, Button, Icon)
- ✅ **Temas**: Suporte às variáveis de cores e estilos do design system
- ✅ **Eventos**: Callbacks para todas as ações (mover, adicionar, remover)

## Uso Básico

```typescript
import { KanbanComponent, KanbanColumn, KanbanCard } from './shared/components';

@Component({
  template: ` <ds-kanban [columns]="columns" (cardMoved)="onCardMoved($event)"> </ds-kanban> `,
})
export class MyComponent {
  columns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      cards: [
        {
          id: '1',
          title: 'Minha tarefa',
          description: 'Descrição da tarefa',
          priority: 'high',
        },
      ],
    },
  ];

  onCardMoved(event: any) {
    console.log('Card movido:', event);
  }
}
```

## Interfaces

### KanbanCard

```typescript
interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  dueDate?: Date;
  tags?: string[];
  data?: any;
}
```

### KanbanColumn

```typescript
interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  color?: string;
  maxCards?: number;
}
```

## Inputs

| Propriedade          | Tipo             | Padrão | Descrição                  |
| -------------------- | ---------------- | ------ | -------------------------- |
| `columns`            | `KanbanColumn[]` | `[]`   | Array de colunas do Kanban |
| `allowAddCards`      | `boolean`        | `true` | Permite adicionar cards    |
| `allowAddColumns`    | `boolean`        | `true` | Permite adicionar colunas  |
| `allowDeleteColumns` | `boolean`        | `true` | Permite deletar colunas    |
| `allowEditColumns`   | `boolean`        | `true` | Permite editar colunas     |
| `showCardCount`      | `boolean`        | `true` | Mostra contador de cards   |
| `maxColumns`         | `number`         | `10`   | Número máximo de colunas   |

## Outputs

| Evento          | Tipo           | Descrição                              |
| --------------- | -------------- | -------------------------------------- |
| `cardMoved`     | `EventEmitter` | Emitido quando um card é movido        |
| `cardAdded`     | `EventEmitter` | Emitido quando um card é adicionado    |
| `cardRemoved`   | `EventEmitter` | Emitido quando um card é removido      |
| `columnAdded`   | `EventEmitter` | Emitido quando uma coluna é adicionada |
| `columnRemoved` | `EventEmitter` | Emitido quando uma coluna é removida   |
| `columnRenamed` | `EventEmitter` | Emitido quando uma coluna é renomeada  |

## Estilos

O componente utiliza as variáveis do design system:

- **Cores**: `--primary-blue`, `--primary-green`, `--stroke`, etc.
- **Espaçamentos**: `$padding-xs`, `$padding-s`, `$padding-md`, etc.
- **Border Radius**: `$border-radius-xs`, `$border-radius-md`, etc.
- **Tipografia**: `$font-primary`, `$font-sm`, `$font-weight-bold`, etc.

## Dependências

- `@angular/cdk` - Para funcionalidade de drag & drop
- `@angular/forms` - Para edição inline de colunas
- Componentes do DS: `CardComponent`, `ButtonComponent`, `IconComponent`

## Exemplo Completo

Veja `kanban-example.component.ts` para um exemplo completo de implementação.
