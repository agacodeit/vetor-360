import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputComponent, SelectComponent, TextareaComponent } from '../../../../../../shared';

@Component({
    selector: 'app-basic-info-step',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputComponent,
        SelectComponent,
        TextareaComponent,
        ButtonComponent
    ],
    templateUrl: './basic-info-step.component.html',
    styleUrls: ['./basic-info-step.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class BasicInfoStepComponent implements OnInit {
    @Input() formData: any = {};
    @Output() formValid = new EventEmitter<boolean>();
    @Output() formDataChange = new EventEmitter<any>();

    basicInfoForm: FormGroup;
    showRestOfForm: boolean = false;

    // Opções para os selects
    operationTypeOptions = [
        { value: 'financing', label: 'Financiamento' },
        { value: 'credit', label: 'Crédito' },
        { value: 'investment', label: 'Investimento' }
    ];

    currencyOptions = [
        { value: 'BRL', label: 'Real (R$)' },
        { value: 'USD', label: 'Dólar (US$)' },
        { value: 'EUR', label: 'Euro (€)' }
    ];

    businessActivityOptions = [
        { value: 'industry', label: 'Indústria' },
        { value: 'commerce', label: 'Comércio' },
        { value: 'services', label: 'Serviços' }
    ];

    countryOptions = [
        { value: 'BR', label: 'Brasil' },
        { value: 'US', label: 'Estados Unidos' },
        { value: 'EU', label: 'Europa' }
    ];

    stateOptions = [
        { value: 'SP', label: 'São Paulo' },
        { value: 'RJ', label: 'Rio de Janeiro' },
        { value: 'MG', label: 'Minas Gerais' }
    ];

    cityOptions = [
        { value: 'sao-paulo', label: 'São Paulo' },
        { value: 'rio-janeiro', label: 'Rio de Janeiro' },
        { value: 'belo-horizonte', label: 'Belo Horizonte' }
    ];

    paymentMethodOptions = [
        { value: 'installments', label: 'Parcelado' },
        { value: 'lump-sum', label: 'À vista' },
        { value: 'mixed', label: 'Misto' }
    ];

    constructor(private fb: FormBuilder) {
        this.basicInfoForm = this.fb.group({
            purpose: ['', [Validators.required, Validators.maxLength(500)]],
            operationType: ['', Validators.required],
            amount: ['', [Validators.required]],
            currency: ['BRL', Validators.required],
            businessActivity: ['', Validators.required],
            country: ['', Validators.required],
            state: ['', Validators.required],
            city: ['', Validators.required],
            term: ['', [Validators.required, Validators.min(1)]],
            paymentMethod: ['', Validators.required],
            gracePeriod: ['', [Validators.required, Validators.min(0)]]
        });

        // Emitir mudanças do formulário
        this.basicInfoForm.valueChanges.subscribe(value => {
            this.formDataChange.emit(value);
            this.formValid.emit(this.basicInfoForm.valid);
        });
    }

    ngOnInit(): void {
        // Carregar dados salvos se existirem
        if (this.formData && Object.keys(this.formData).length > 0) {
            this.basicInfoForm.patchValue(this.formData, { emitEvent: false });

            // Restaurar o estado showRestOfForm se houver dados além da finalidade
            if (this.formData.purpose) {
                this.showRestOfForm = true;
            }
        }

        // Emitir estado inicial de validade
        this.formValid.emit(this.basicInfoForm.valid);
    }

    // Getters para facilitar o acesso aos controles
    get purpose() { return this.basicInfoForm.get('purpose'); }
    get operationType() { return this.basicInfoForm.get('operationType'); }
    get amount() { return this.basicInfoForm.get('amount'); }
    get currency() { return this.basicInfoForm.get('currency'); }
    get businessActivity() { return this.basicInfoForm.get('businessActivity'); }
    get country() { return this.basicInfoForm.get('country'); }
    get state() { return this.basicInfoForm.get('state'); }
    get city() { return this.basicInfoForm.get('city'); }
    get term() { return this.basicInfoForm.get('term'); }
    get paymentMethod() { return this.basicInfoForm.get('paymentMethod'); }
    get gracePeriod() { return this.basicInfoForm.get('gracePeriod'); }

    identifyOperation(): void {
        // Validar se o campo finalidade está preenchido
        if (this.purpose?.valid) {
            this.showRestOfForm = true;
        } else {
            // Marcar o campo como touched para mostrar erro
            this.purpose?.markAsTouched();
        }
    }
}
