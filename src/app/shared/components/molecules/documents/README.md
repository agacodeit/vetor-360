# DS-Documents Component

Componente reutilizável do design system para gerenciamento de documentos com upload de arquivos.

## Características

- ✅ Upload de arquivos com validação de formato
- ✅ Checkbox para marcar documentos como obrigatórios
- ✅ Suporte a accordion (opcional)
- ✅ Eventos para upload e remoção de documentos
- ✅ Validação de formulário
- ✅ Design responsivo
- ✅ Variações de estilo (compact, bordered, background)

## Uso Básico

```typescript
import { DocumentsComponent, DocumentItem, DocumentsConfig } from '@shared/components';

@Component({
  template: `
    <ds-documents
      [config]="documentsConfig"
      [initialData]="initialData"
      (documentsChange)="onDocumentsChange($event)"
      (documentUploaded)="onDocumentUploaded($event)"
      (documentRemoved)="onDocumentRemoved($event)"
      (formValid)="onFormValid($event)"
    >
    </ds-documents>
  `,
})
export class MyComponent {
  documentsConfig: DocumentsConfig = {
    title: 'Documentos Obrigatórios',
    showAccordion: true,
    allowMultiple: true,
    documents: [
      {
        id: 'rg-cnh',
        label: 'RG ou CNH - Documento de identidade',
        required: true,
        uploaded: false,
        acceptedFormats: '.pdf,.jpg,.jpeg,.png',
      },
      {
        id: 'cpf',
        label: 'CPF - Cadastro de Pessoa Física',
        required: true,
        uploaded: false,
        acceptedFormats: '.pdf,.jpg,.jpeg,.png',
      },
    ],
  };

  initialData = {};

  onDocumentsChange(event: any) {
    console.log('Documents changed:', event);
  }

  onDocumentUploaded(event: any) {
    console.log('Document uploaded:', event);
  }

  onDocumentRemoved(documentId: string) {
    console.log('Document removed:', documentId);
  }

  onFormValid(isValid: boolean) {
    console.log('Form valid:', isValid);
  }
}
```

## Configuração

### DocumentsConfig

```typescript
interface DocumentsConfig {
  title?: string; // Título do accordion
  description?: string; // Descrição (futuro)
  showAccordion?: boolean; // Mostrar accordion (padrão: true)
  allowMultiple?: boolean; // Permitir múltiplos accordions abertos
  documents: DocumentItem[]; // Lista de documentos
}
```

### DocumentItem

```typescript
interface DocumentItem {
  id: string; // ID único do documento
  label: string; // Label do checkbox
  required: boolean; // Se é obrigatório
  file?: File; // Arquivo carregado
  uploaded: boolean; // Se foi carregado
  acceptedFormats: string; // Formatos aceitos (ex: '.pdf,.jpg,.png')
}
```

## Eventos

- `documentsChange`: Emitido quando o formulário muda
- `documentUploaded`: Emitido quando um arquivo é carregado
- `documentRemoved`: Emitido quando um arquivo é removido
- `formValid`: Emitido quando a validade do formulário muda

## Variações de Estilo

### Compact

```html
<ds-documents class="ds-documents--compact" [config]="config"></ds-documents>
```

### Bordered

```html
<ds-documents class="ds-documents--bordered" [config]="config"></ds-documents>
```

### Background

```html
<ds-documents class="ds-documents--background" [config]="config"></ds-documents>
```

## Métodos Públicos

- `getFormValue()`: Retorna o valor atual do formulário
- `setFormValue(data)`: Define dados do formulário
- `getFileName(documentId)`: Retorna o nome do arquivo ou texto padrão
- `removeDocument(documentId)`: Remove um documento

## Responsividade

O componente é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout horizontal com ações à direita
- **Tablet**: Layout adaptado com melhor espaçamento
- **Mobile**: Layout vertical com ações em linha separada

## Acessibilidade

- Suporte a navegação por teclado
- Labels apropriados para screen readers
- Contraste adequado de cores
- Estados visuais claros (uploaded, hover, focus)
