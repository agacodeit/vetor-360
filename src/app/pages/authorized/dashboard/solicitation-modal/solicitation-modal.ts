import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, TextareaComponent, InputComponent, SelectComponent } from '../../../../shared';

@Component({
  selector: 'app-solicitation-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextareaComponent,
    InputComponent,
    SelectComponent
  ],
  standalone: true,
  templateUrl: './solicitation-modal.html',
  styleUrl: './solicitation-modal.scss'
})
export class SolicitationModal {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  solicitationForm: FormGroup;
  isLoading = false;
  showSolicitationForm: boolean = false;

  constructor(private fb: FormBuilder) {
    this.solicitationForm = this.fb.group({
      operationType: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      currency: ['', [Validators.required]],
      purpose: ['', [Validators.required, Validators.maxLength(500)]],
      businessActivity: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      city: ['', [Validators.required]],
      term: ['', [Validators.required, Validators.min(1)]],
      paymentMethod: ['', [Validators.required]],
      gracePeriod: ['', [Validators.required, Validators.min(0)]]
    });
  }

  get operationType() {
    return this.solicitationForm.get('operationType');
  }

  get amount() {
    return this.solicitationForm.get('amount');
  }

  get currency() {
    return this.solicitationForm.get('currency');
  }

  get purpose() {
    return this.solicitationForm.get('purpose');
  }

  get businessActivity() {
    return this.solicitationForm.get('businessActivity');
  }

  get country() {
    return this.solicitationForm.get('country');
  }

  get state() {
    return this.solicitationForm.get('state');
  }

  get city() {
    return this.solicitationForm.get('city');
  }

  get term() {
    return this.solicitationForm.get('term');
  }

  get paymentMethod() {
    return this.solicitationForm.get('paymentMethod');
  }

  get gracePeriod() {
    return this.solicitationForm.get('gracePeriod');
  }

  // Opções para os selects
  operationTypeOptions = [
    { value: 'capital-giro', label: 'Capital de Giro' },
    { value: 'financiamento-internacional', label: 'Financiamento Internacional' }
  ];

  currencyOptions = [
    { value: 'BRL', label: 'Real' },
    { value: 'EUR', label: 'Euro' },
    { value: 'USD', label: 'Dólar' }
  ];

  businessActivityOptions = [
    { value: 'padeiro', label: 'Padeiro' },
    { value: 'empreiteiro', label: 'Empreiteiro' },
    { value: 'desenvolvedor', label: 'Desenvolvedor' },
    { value: 'banqueiro', label: 'Banqueiro' }
  ];

  countryOptions = [
    { value: 'brasil', label: 'Brasil' },
    { value: 'portugal', label: 'Portugal' },
    { value: 'argentina', label: 'Argentina' }
  ];

  stateOptions = [
    { value: 'sp', label: 'São Paulo' },
    { value: 'rj', label: 'Rio de Janeiro' },
    { value: 'mg', label: 'Minas Gerais' },
    { value: 'rs', label: 'Rio Grande do Sul' },
    { value: 'pr', label: 'Paraná' },
    { value: 'sc', label: 'Santa Catarina' }
  ];

  cityOptions = [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'rio-de-janeiro', label: 'Rio de Janeiro' },
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
    { value: 'porto-alegre', label: 'Porto Alegre' },
    { value: 'curitiba', label: 'Curitiba' },
    { value: 'florianopolis', label: 'Florianópolis' }
  ];

  paymentMethodOptions = [
    { value: 'mensal', label: 'Mensal' },
    { value: 'trimestral', label: 'Trimestral' },
    { value: 'semestral', label: 'Semestral' },
    { value: 'anual', label: 'Anual' }
  ];

  handleSubmit() {
    if (this.solicitationForm.valid) {
      this.isLoading = true;
      this.onSubmit.emit(this.solicitationForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  handleIdentifyBestOperation() {
    // Lógica para identificar melhor operação
    this.showSolicitationForm = true;
    console.log('Identificando melhor operação...');
  }

  private markFormGroupTouched() {
    Object.keys(this.solicitationForm.controls).forEach(key => {
      const control = this.solicitationForm.get(key);
      control?.markAsTouched();
    });
  }

}
