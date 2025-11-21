import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  ButtonComponent,
  InputComponent,
  SelectComponent,
  TextareaComponent,
} from '../../../../../../shared';
import {
  IdentifyOperationService,
  IdentifyOperationResponse,
} from '../../../../../../shared/services/identify-operation/identify-operation.service';
import { ToastService } from '../../../../../../shared/services/toast/toast.service';
import {
  OpportunityOptionsService
} from '../../../../../../shared/services/opportunity-options/opportunity-options.service';

@Component({
  selector: 'app-basic-info-step',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputComponent,
    SelectComponent,
    TextareaComponent,
    ButtonComponent,
  ],
  templateUrl: './basic-info-step.component.html',
  styleUrls: ['./basic-info-step.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BasicInfoStepComponent implements OnInit {
  @Input() formData: any = {};
  @Output() formValid = new EventEmitter<boolean>();
  @Output() formDataChange = new EventEmitter<any>();

  private identifyOperationService = inject(IdentifyOperationService);
  private toastService = inject(ToastService);
  private opportunityOptionsService = inject(OpportunityOptionsService);

  basicInfoForm: FormGroup;
  showRestOfForm: boolean = false;
  iaAnalysis: string = '';
  isLoadingAnalysis: boolean = false;
  isLoadingOptions: boolean = true;

  operationTypeOptions: { value: string; label: string }[] = [];
  businessActivityOptions: { value: string; label: string }[] = [];

  currencyOptions = [
    { value: 'BRL', label: 'Real (R$)' },
    { value: 'USD', label: 'Dólar (US$)' },
    { value: 'EUR', label: 'Euro (€)' },
  ];

  countryOptions = [
    { value: 'BR', label: 'Brasil' },
    { value: 'US', label: 'Estados Unidos' },
    { value: 'EU', label: 'Europa' },
  ];

  stateOptions = [
    { value: 'SP', label: 'São Paulo' },
    { value: 'RJ', label: 'Rio de Janeiro' },
    { value: 'MG', label: 'Minas Gerais' },
  ];

  cityOptions = [
    { value: 'sao-paulo', label: 'São Paulo' },
    { value: 'rio-janeiro', label: 'Rio de Janeiro' },
    { value: 'belo-horizonte', label: 'Belo Horizonte' },
  ];

  constructor(private fb: FormBuilder) {
    this.basicInfoForm = this.fb.group({
      customerName: ['', [Validators.required, Validators.maxLength(100)]],
      cnpj: ['', Validators.required],
      purpose: ['', [Validators.required, Validators.maxLength(500)]],
      operationType: ['', Validators.required],
      amount: ['', [Validators.required]],
      currency: ['BRL', Validators.required],
      businessActivity: ['', Validators.required],
      country: ['Brasil', Validators.required],
      state: ['SP', Validators.required],
      city: ['São Paulo', Validators.required],
      term: ['', [Validators.required, Validators.min(1)]],
    });

    this.basicInfoForm.valueChanges.subscribe((value) => {
      this.formDataChange.emit(value);
      this.formValid.emit(this.basicInfoForm.valid);
    });
  }

  ngOnInit(): void {
    this.loadOptions();

    if (this.formData && Object.keys(this.formData).length > 0) {
      this.basicInfoForm.patchValue(this.formData, { emitEvent: false });

      if (this.formData.purpose) {
        this.showRestOfForm = true;
      }
    }

    this.formValid.emit(this.basicInfoForm.valid);
  }

  private loadOptions(): void {
    this.isLoadingOptions = true;

    // Desabilitar campos durante carregamento
    this.basicInfoForm.get('operationType')?.disable();
    this.basicInfoForm.get('businessActivity')?.disable();

    // Carregar tipos de operação e atividade em paralelo
    Promise.all([
      this.opportunityOptionsService.getOperationTypes().toPromise(),
      this.opportunityOptionsService.getActivityTypes().toPromise(),
    ])
      .then(([operationTypes, activityTypes]) => {
        this.operationTypeOptions =
          operationTypes?.map((type) => ({
            value: type.key,
            label: type.description,
          })) || [];

        this.businessActivityOptions =
          activityTypes?.map((type) => ({
            value: type.key,
            label: type.description,
          })) || [];

        this.isLoadingOptions = false;

        // Reabilitar campos após carregamento
        this.basicInfoForm.get('operationType')?.enable();
        this.basicInfoForm.get('businessActivity')?.enable();
      })
      .catch((error) => {
        console.error('Erro ao carregar opções:', error);
        this.toastService.error('Erro ao carregar opções. Tente novamente.', 'Erro');
        this.isLoadingOptions = false;

        // Reabilitar campos mesmo em caso de erro
        this.basicInfoForm.get('operationType')?.enable();
        this.basicInfoForm.get('businessActivity')?.enable();
      });
  }

  get customerName() {
    return this.basicInfoForm.get('customerName');
  }
  get cnpj() {
    return this.basicInfoForm.get('cnpj');
  }
  get purpose() {
    return this.basicInfoForm.get('purpose');
  }
  get operationType() {
    return this.basicInfoForm.get('operationType');
  }
  get amount() {
    return this.basicInfoForm.get('amount');
  }
  get currency() {
    return this.basicInfoForm.get('currency');
  }
  get businessActivity() {
    return this.basicInfoForm.get('businessActivity');
  }
  get country() {
    return this.basicInfoForm.get('country');
  }
  get state() {
    return this.basicInfoForm.get('state');
  }
  get city() {
    return this.basicInfoForm.get('city');
  }
  get term() {
    return this.basicInfoForm.get('term');
  }

  identifyOperation(): void {
    if (this.purpose?.valid) {
      this.isLoadingAnalysis = true;
      this.iaAnalysis = '';

      this.identifyOperationService
        .identifyBetterOperation({
          message: this.purpose?.value,
        })
        .subscribe({
          next: (response: IdentifyOperationResponse) => {
            this.isLoadingAnalysis = false;

            // Verificar se a resposta é válida
            if (response && response.iaanalisys) {
              this.iaAnalysis = response.iaanalisys;
              this.showRestOfForm = true;

              // Preencher campos automaticamente se retornados pela API
              if (response.opportunityVetor360DTO) {
                this.fillFieldsFromResponse(response.opportunityVetor360DTO);
              }
            } else {
              console.warn('Resposta da API não contém dados válidos:', response);
              this.toastService.error('Resposta inválida da API. Tente novamente.', 'Erro');
            }
          },
          error: (error) => {
            this.isLoadingAnalysis = false;
            console.error('Erro ao identificar operação:', error);
            this.toastService.error(
              error.error?.message || 'Erro ao identificar operação. Tente novamente.',
              'Erro'
            );
          },
        });
    } else {
      this.purpose?.markAsTouched();
    }
  }

  private fillFieldsFromResponse(data: any): void {
    // Verificar se data existe e não é null/undefined
    if (!data) {
      console.warn('Dados da resposta são nulos ou indefinidos');
      return;
    }

    if (data.operation) {
      this.basicInfoForm.patchValue({ operationType: data.operation });
    }
    if (data.value !== undefined && data.value !== null) {
      this.basicInfoForm.patchValue({ amount: data.value.toString() });
    }
    if (data.valueType) {
      this.basicInfoForm.patchValue({ currency: data.valueType });
    }
    if (data.activityTypeEnum) {
      this.basicInfoForm.patchValue({ businessActivity: data.activityTypeEnum });
    }
    // Não sobrescrever campos de localização que são fixos
    if (data.term) {
      this.basicInfoForm.patchValue({ term: data.term });
    }
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.basicInfoForm.get(fieldName);
    if (control && control.invalid && control.touched) {
      if (control.errors?.['required']) {
        const requiredMessages: { [key: string]: string } = {
          customerName: 'Nome do cliente é obrigatório',
          cnpj: 'CNPJ é obrigatório',
          purpose: 'Finalidade é obrigatória',
          operationType: 'Tipo de operação é obrigatório',
          amount: 'Valor é obrigatório',
          currency: 'Moeda é obrigatória',
          businessActivity: 'Ramo de atividade é obrigatório',
          term: 'Prazo é obrigatório',
        };
        return requiredMessages[fieldName] || 'Este campo é obrigatório';
      }
      if (control.errors?.['minlength']) {
        return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['maxlength']) {
        if (fieldName === 'purpose') {
          return 'Máximo de 500 caracteres';
        }
        return `Máximo de ${control.errors?.['maxlength'].requiredLength} caracteres`;
      }
      if (control.errors?.['min']) {
        if (fieldName === 'term') {
          return 'Prazo mínimo de 1 mês';
        }
        if (fieldName === 'amount') {
          return 'Valor mínimo de R$ 1.000,00';
        }
        return `Valor mínimo de ${control.errors?.['min'].min}`;
      }
      if (control.errors?.['maskPatternInvalid']) {
        const maskError = control.errors?.['maskPatternInvalid'];
        const expectedPattern = maskError?.expectedPatterns?.[0];

        if (fieldName === 'cnpj') {
          return 'CNPJ deve ter o formato 00.000.000/0000-00';
        }

        return `Formato inválido. Esperado: ${expectedPattern || 'formato correto'}`;
      }
    }
    return '';
  }
}
