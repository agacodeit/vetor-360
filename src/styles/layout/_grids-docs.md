# Sistema de Grid - CSS Grid + Flexbox

## Como Usar

### 1. Sistema Flexbox (Global)

```html
<div class="container">
  <div class="row">
    <div class="col-6">Conteúdo 50%</div>
    <div class="col-6">Conteúdo 50%</div>
  </div>
</div>
```

### 2. Sistema CSS Grid (Componentes Específicos)

#### Exemplo: Modal de Solicitação

```html
<div class="solicitation-modal__row">
  <div class="solicitation-modal__col solicitation-modal__col--operation-type">
    <ds-select label="Tipo de Operação" />
  </div>
  <div class="solicitation-modal__col solicitation-modal__col--value-currency">
    <ds-input label="Valor" />
    <ds-select label="Moeda" />
  </div>
</div>
```

### 3. Classes Disponíveis

#### Container (Flexbox)

- `.container` - Container com largura máxima de 1280px
- `.row` - Linha flexível com wrap
- `.col-1` até `.col-12` - Colunas específicas

#### CSS Grid (Componentes)

- `display: grid` - Para layouts complexos
- `grid-template-areas` - Para posicionamento por nome
- `grid-template-columns` - Para definir colunas

### 4. Exemplos de CSS Grid

#### Grid 50% + 50% (Valor + Moeda)

```scss
.meu-componente {
  &__row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'operation-type value-currency';
    gap: 1rem;
  }

  &__col {
    &--operation-type {
      grid-area: operation-type;
    }

    &--value-currency {
      grid-area: value-currency;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
  }
}
```

#### Grid 100% (Campo Full Width)

```scss
.meu-componente {
  &__row-full {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  &__col {
    &--business-activity {
      grid-area: business-activity;
    }
  }
}
```

#### Grid 3-4-4 Colunas (Localização)

```scss
.meu-componente {
  &__row-location {
    display: grid;
    grid-template-columns: 1fr 1.33fr 1.33fr;
    grid-template-areas: 'country state city';
    gap: 1rem;
  }

  &__col {
    &--country {
      grid-area: country;
    }
    &--state {
      grid-area: state;
    }
    &--city {
      grid-area: city;
    }
  }
}
```

#### Grid 50% + 50% (Pagamento)

```scss
.meu-componente {
  &__row-payment {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-areas: 'term payment-method';
    gap: 1rem;
  }

  &__col {
    &--term {
      grid-area: term;
    }
    &--payment-method {
      grid-area: payment-method;
    }
  }
}
```

### 5. Responsividade

#### Flexbox (Global)

```scss
@media (max-width: 768px) {
  .row {
    flex-direction: column;
  }
  [class*='col-'] {
    flex: 0 0 100% !important;
  }
}
```

#### CSS Grid (Componentes)

```scss
@media (max-width: 768px) {
  .meu-componente {
    &__row {
      grid-template-columns: 1fr;
      grid-template-areas:
        'operation-type'
        'value-currency';
    }

    &__col {
      &--value-currency {
        grid-template-columns: 1fr;
      }
    }
  }
}
```

### 6. Quando Usar Cada Sistema

#### Use Flexbox (Global) para:

- Layouts simples e lineares
- Componentes que precisam de flexibilidade
- Sistemas de grid tradicionais

#### Use CSS Grid para:

- Layouts complexos com áreas nomeadas
- Componentes específicos com layout único
- Quando precisa de controle preciso sobre posicionamento
