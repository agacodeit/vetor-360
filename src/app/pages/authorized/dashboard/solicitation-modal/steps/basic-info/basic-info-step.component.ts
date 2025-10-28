import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, InputComponent, SelectComponent, TextareaComponent } from '../../../../../../shared';
import { IdentifyOperationService, IdentifyOperationResponse } from '../../../../../../shared/services/identify-operation/identify-operation.service';
import { ToastService } from '../../../../../../shared/services/toast/toast.service';
import { OpportunityOptionsService, OperationType, ActivityType } from '../../../../../../shared/services/opportunity-options/opportunity-options.service';

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
        { value: 'EUR', label: 'Euro (€)' }
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

    constructor(private fb: FormBuilder) {
        this.basicInfoForm = this.fb.group({
            customerName: ['', [Validators.required, Validators.maxLength(100)]],
            purpose: ['', [Validators.required, Validators.maxLength(500)]],
            operationType: ['', Validators.required],
            amount: ['', [Validators.required]],
            currency: ['BRL', Validators.required],
            businessActivity: ['', Validators.required],
            country: ['Brasil', Validators.required],
            state: ['SP', Validators.required],
            city: ['São Paulo', Validators.required],
            term: ['', [Validators.required, Validators.min(1)]]
        });


        this.basicInfoForm.valueChanges.subscribe(value => {
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

        // Carregar tipos de operação e atividade em paralelo
        Promise.all([
            this.opportunityOptionsService.getOperationTypes().toPromise(),
            this.opportunityOptionsService.getActivityTypes().toPromise()
        ]).then(([operationTypes, activityTypes]) => {
            this.operationTypeOptions = operationTypes?.map(type => ({
                value: type.key,
                label: type.description
            })) || [];

            this.businessActivityOptions = activityTypes?.map(type => ({
                value: type.key,
                label: type.description
            })) || [];

            this.isLoadingOptions = false;
        }).catch(error => {
            console.error('Erro ao carregar opções:', error);
            this.toastService.error('Erro ao carregar opções. Tente novamente.', 'Erro');
            this.isLoadingOptions = false;
        });
    }


    get customerName() { return this.basicInfoForm.get('customerName'); }
    get purpose() { return this.basicInfoForm.get('purpose'); }
    get operationType() { return this.basicInfoForm.get('operationType'); }
    get amount() { return this.basicInfoForm.get('amount'); }
    get currency() { return this.basicInfoForm.get('currency'); }
    get businessActivity() { return this.basicInfoForm.get('businessActivity'); }
    get country() { return this.basicInfoForm.get('country'); }
    get state() { return this.basicInfoForm.get('state'); }
    get city() { return this.basicInfoForm.get('city'); }
    get term() { return this.basicInfoForm.get('term'); }

    identifyOperation(): void {
        if (this.purpose?.valid) {
            this.isLoadingAnalysis = true;
            this.iaAnalysis = '';

            this.identifyOperationService.identifyBetterOperation({
                message: this.purpose?.value
            }).subscribe({
                next: (response: IdentifyOperationResponse) => {
                    this.isLoadingAnalysis = false;
                    this.iaAnalysis = response.iaanalisys;
                    this.showRestOfForm = true;

                    // Preencher campos automaticamente se retornados pela API
                    this.fillFieldsFromResponse(response.opportunityVetor360DTO);
                },
                error: (error) => {
                    this.isLoadingAnalysis = false;
                    console.error('Erro ao identificar operação:', error);
                    this.toastService.error(
                        error.error?.message || 'Erro ao identificar operação. Tente novamente.',
                        'Erro'
                    );
                }
            });
        } else {
            this.purpose?.markAsTouched();
        }
    }

    private fillFieldsFromResponse(data: any): void {
        if (data.operation) {
            this.basicInfoForm.patchValue({ operationType: data.operation });
        }
        if (data.value) {
            this.basicInfoForm.patchValue({ amount: data.value.toString() });
        }
        if (data.valueType) {
            this.basicInfoForm.patchValue({ currency: data.valueType });
        }
        if (data.activityTypeEnum) {
            this.basicInfoForm.patchValue({ businessActivity: data.activityTypeEnum });
        }
        if (data.country) {
            this.basicInfoForm.patchValue({ country: data.country });
        }
        /* if (data.state) {
            this.basicInfoForm.patchValue({ state: data.state });
        }
        if (data.city) {
            this.basicInfoForm.patchValue({ city: data.city });
        } */
        if (data.term) {
            this.basicInfoForm.patchValue({ term: data.term });
        }
    }
}
