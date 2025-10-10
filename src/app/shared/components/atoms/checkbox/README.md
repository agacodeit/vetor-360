# DS Checkbox Component

Componente de checkbox customizado para o Design System.

## Uso Básico

```html
<ds-checkbox label="Aceito os termos e condições" [(ngModel)]="acceptTerms"> </ds-checkbox>
```

## Propriedades (@Input)

| Propriedade     | Tipo      | Padrão  | Descrição                                   |
| --------------- | --------- | ------- | ------------------------------------------- |
| `label`         | `string`  | `''`    | Texto do label do checkbox                  |
| `required`      | `boolean` | `false` | Se o campo é obrigatório (mostra asterisco) |
| `disabled`      | `boolean` | `false` | Desabilita o checkbox                       |
| `invalid`       | `boolean` | `false` | Marca o checkbox como inválido              |
| `indeterminate` | `boolean` | `false` | Estado indeterminado (traço)                |
| `errorMessage`  | `string`  | `''`    | Mensagem de erro a ser exibida              |
| `helperText`    | `string`  | `''`    | Texto de ajuda                              |
| `fullWidth`     | `boolean` | `false` | Ocupa toda a largura disponível             |
| `ngModel`       | `boolean` | `false` | Valor do checkbox (two-way binding)         |

## Eventos (@Output)

| Evento          | Tipo                    | Descrição                                     |
| --------------- | ----------------------- | --------------------------------------------- |
| `ngModelChange` | `EventEmitter<boolean>` | Emitido quando o valor muda (two-way binding) |
| `valueChanged`  | `EventEmitter<boolean>` | Emitido quando o valor muda                   |

## Exemplos de Uso

### Checkbox Básico

```html
<ds-checkbox label="Concordo com os termos" [(ngModel)]="agreed"> </ds-checkbox>
```

### Checkbox Obrigatório

```html
<ds-checkbox label="Li e aceito as políticas" [required]="true" [(ngModel)]="acceptedPolicies">
</ds-checkbox>
```

### Checkbox com Validação

```html
<ds-checkbox
  label="Confirmo as informações"
  [invalid]="!isConfirmed && touched"
  errorMessage="Você precisa confirmar as informações"
  [(ngModel)]="isConfirmed"
>
</ds-checkbox>
```

### Checkbox Desabilitado

```html
<ds-checkbox label="Opção desabilitada" [disabled]="true" [(ngModel)]="option"> </ds-checkbox>
```

### Checkbox Indeterminado

```html
<ds-checkbox label="Selecionar todos" [indeterminate]="someSelected" [(ngModel)]="selectAll">
</ds-checkbox>
```

### Checkbox com Texto de Ajuda

```html
<ds-checkbox
  label="Receber newsletters"
  helperText="Você pode cancelar a qualquer momento"
  [(ngModel)]="newsletter"
>
</ds-checkbox>
```

### Com Reactive Forms

```typescript
// Component
myForm = this.fb.group({
  acceptTerms: [false, Validators.requiredTrue],
});
```

```html
<!-- Template -->
<form [formGroup]="myForm">
  <ds-checkbox
    label="Aceito os termos"
    formControlName="acceptTerms"
    [invalid]="myForm.get('acceptTerms')?.invalid && myForm.get('acceptTerms')?.touched"
    errorMessage="Você precisa aceitar os termos"
  >
  </ds-checkbox>
</form>
```

## Acessibilidade

- Suporta navegação por teclado
- Usa atributos ARIA apropriados (`aria-invalid`, `aria-required`)
- Mensagens de erro com `role="alert"`
- Label associado corretamente ao input via `id` único

## Estilos (BEM)

- `.checkbox-container` - Container principal
- `.checkbox-label` - Label do checkbox
- `.checkbox-field` - Input checkbox
- `.checkbox-label-text` - Texto do label
- `.error-message` - Mensagem de erro
- `.helper-text` - Texto de ajuda

## Estados

- **Normal**: Estado padrão
- **Checked**: Checkbox marcado (✓)
- **Indeterminate**: Estado indeterminado (-)
- **Disabled**: Desabilitado e opaco
- **Invalid**: Com borda vermelha
- **Focus**: Com outline azul

## Integração com Formulários

O componente implementa `ControlValueAccessor`, permitindo uso com:

- `ngModel` (Template-driven forms)
- `formControlName` (Reactive forms)
