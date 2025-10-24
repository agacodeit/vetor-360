import { Component, OnInit, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StepperComponent, ButtonComponent, IconComponent, DocumentsComponent, DocumentsConfig, StepperStep, ToastService, PartnerRegistrationService, DocumentItem, PartnerRegistrationRequest, InputComponent, RadioComponent, RadioOption } from '../../../shared';


export interface PartnerRegistrationData {
    personType: 'F' | 'J';
    // Dados básicos
    name: string;
    cpfCnpj: string;
    email: string;
    cellphone: string;
    comercialPhone?: string;
    responsibleCompanyName?: string;
    // Endereço
    address: {
        cep: string;
        street: string;
        complement?: string;
        neighbourhood: string;
        city: string;
        state: string;
    };
    // Senha
    password: string;
    confirmPassword: string;
    // Documentos
    documents: any[];
}

@Component({
    selector: 'app-partner-registration',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StepperComponent,
        ButtonComponent,
        DocumentsComponent,
        InputComponent,
        RadioComponent
    ],
    templateUrl: './partner-registration.component.html',
    styleUrls: ['./partner-registration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PartnerRegistrationComponent implements OnInit {
    currentStep = 0;
    isLoading = false;

    registrationForm: FormGroup;
    documentsConfig: DocumentsConfig = {
        title: 'Documentos Obrigatórios',
        showAccordion: false,
        allowMultiple: true,
        documents: []
    };

    personTypeOptions: RadioOption[] = [
        { value: 'F', label: 'Pessoa física' },
        { value: 'J', label: 'Pessoa jurídica' }
    ];

    steps: StepperStep[] = [
        {
            id: 'person-type',
            title: 'Tipo de Pessoa',
            description: 'Escolha entre pessoa física ou jurídica'
        },
        {
            id: 'basic-info',
            title: 'Dados Básicos',
            description: 'Informações pessoais ou da empresa'
        },
        {
            id: 'address',
            title: 'Endereço',
            description: 'Localização e endereço completo'
        },
        {
            id: 'documents',
            title: 'Documentos',
            description: 'Anexar documentos obrigatórios'
        },
        {
            id: 'password',
            title: 'Senha',
            description: 'Definir senha de acesso'
        }
    ];

    constructor(
        private fb: FormBuilder,
        private router: Router,
        @Inject(ToastService) private toastService: ToastService,
        @Inject(PartnerRegistrationService) private partnerRegistrationService: PartnerRegistrationService
    ) {
        this.registrationForm = this.fb.group({
            personType: ['', Validators.required],
            // Dados básicos
            name: ['', Validators.required],
            cpfCnpj: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            cellphone: ['', Validators.required],
            comercialPhone: [''],
            responsibleCompanyName: [''],
            // Endereço
            address: this.fb.group({
                cep: ['', Validators.required],
                street: ['', Validators.required],
                complement: [''],
                neighbourhood: ['', Validators.required],
                city: ['', Validators.required],
                state: ['', Validators.required]
            }),
            // Senha
            password: ['', [Validators.required, Validators.minLength(8)]],
            confirmPassword: ['', Validators.required],
            // Documentos
            documents: [[]]
        });
    }

    ngOnInit(): void {
        // Adicionar validação de confirmação de senha
        this.registrationForm.get('confirmPassword')?.setValidators([
            Validators.required,
            this.passwordMatchValidator.bind(this)
        ]);

        // Configurar documentos baseado no tipo de pessoa
        this.setupDocumentsConfig();

        // Listener para mudanças no tipo de pessoa
        this.registrationForm.get('personType')?.valueChanges.subscribe(() => {
            this.onPersonTypeChange();
        });
    }

    private setupDocumentsConfig(): void {
        const isPersonFisica = this.registrationForm.get('personType')?.value === 'F';

        this.documentsConfig = {
            title: 'Documentos Obrigatórios',
            showAccordion: false,
            allowMultiple: true,
            documents: isPersonFisica ? this.getPersonFisicaDocuments() : this.getPersonJuridicaDocuments()
        };
    }

    private getPersonFisicaDocuments(): DocumentItem[] {
        return [
            {
                id: 'rg-cnh',
                label: 'RG ou CNH - Documento de identidade',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'cpf',
                label: 'CPF - Cadastro de Pessoa Física',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'comprovante-residencia',
                label: 'Comprovante de Residência no endereço cadastrado',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            }
        ];
    }

    private getPersonJuridicaDocuments(): DocumentItem[] {
        return [
            {
                id: 'ccmei-contrato-social',
                label: 'CCMEI ou Contrato Social',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'rg-cnh-socios',
                label: 'RG ou CNH dos Sócios',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'cartao-cnpj',
                label: 'Cartão de CNPJ',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'conta-consumo-empresa',
                label: 'Conta de consumo em nome da empresa no endereço cadastrado',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'conta-consumo-socios',
                label: 'Conta de consumo em nome dos sócios',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            }
        ];
    }

    private passwordMatchValidator(control: any) {
        const password = this.registrationForm?.get('password')?.value;
        const confirmPassword = control.value;

        if (password && confirmPassword && password !== confirmPassword) {
            return { passwordMismatch: true };
        }
        return null;
    }

    get isPersonTypeSelected(): boolean {
        return !!this.registrationForm.get('personType')?.value;
    }

    get isPersonFisica(): boolean {
        return this.registrationForm.get('personType')?.value === 'F';
    }

    get isPersonJuridica(): boolean {
        return this.registrationForm.get('personType')?.value === 'J';
    }

    get currentStepData(): StepperStep {
        return this.steps[this.currentStep];
    }

    get canGoNext(): boolean {
        switch (this.currentStep) {
            case 0: // Tipo de pessoa
                return this.isPersonTypeSelected;
            case 1: // Dados básicos
                const basicFields = ['name', 'cpfCnpj', 'email', 'cellphone'];
                if (this.isPersonJuridica) {
                    basicFields.push('comercialPhone', 'responsibleCompanyName');
                }
                return basicFields.every(field =>
                    this.registrationForm.get(field)?.valid
                );
            case 2: // Endereço
                const addressGroup = this.registrationForm.get('address') as FormGroup;
                return addressGroup?.valid || false;
            case 3: // Documentos
                // TODO: Implementar validação de documentos
                return true;
            case 4: // Senha
                return !!(this.registrationForm.get('password')?.valid &&
                    this.registrationForm.get('confirmPassword')?.valid);
            default:
                return false;
        }
    }

    get canGoBack(): boolean {
        return this.currentStep > 0;
    }

    onStepClick(step: StepperStep): void {
        const stepIndex = this.steps.findIndex(s => s.id === step.id);
        if (stepIndex !== -1 && stepIndex <= this.currentStep) {
            this.currentStep = stepIndex;
        }
    }

    onStepChanged(stepIndex: number): void {
        this.currentStep = stepIndex;
    }

    nextStep(): void {
        if (this.canGoNext && this.currentStep < this.steps.length - 1) {
            this.currentStep++;
            this.updateStepStatus();
        }
    }

    previousStep(): void {
        if (this.canGoBack) {
            this.currentStep--;
            this.updateStepStatus();
        }
    }

    private updateStepStatus(): void {
        this.steps.forEach((step, index) => {
            step.completed = index < this.currentStep;
            step.error = false;
        });
    }

    onPersonTypeChange(): void {
        const personType = this.registrationForm.get('personType')?.value;

        // Limpar campos específicos quando mudar o tipo
        if (personType === 'F') {
            this.registrationForm.patchValue({
                comercialPhone: '',
                responsibleCompanyName: ''
            });
        }

        // Reconfigurar documentos baseado no tipo de pessoa
        this.setupDocumentsConfig();
    }

    async onSubmit(): Promise<void> {
        if (!this.registrationForm.valid) {
            this.toastService.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        this.isLoading = true;

        try {
            const formData = this.registrationForm.value;

            // Validar CPF/CNPJ
            const cpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
            const isValidDocument = formData.personType === 'F'
                ? this.partnerRegistrationService.validateCpf(cpfCnpj)
                : this.partnerRegistrationService.validateCnpj(cpfCnpj);

            if (!isValidDocument) {
                this.toastService.error(`CPF/CNPJ inválido`);
                this.isLoading = false;
                return;
            }

            // Formatar dados para API
            const registrationData: PartnerRegistrationRequest =
                this.partnerRegistrationService.formatDataForApi(formData);

            // Chamar API
            const response = await this.partnerRegistrationService.createPartner(registrationData).toPromise();

            if (response?.success) {
                this.toastService.success('Cadastro realizado com sucesso!');
                this.router.navigate(['/login']);
            } else {
                this.toastService.error(response?.message || 'Erro ao realizar cadastro');
            }

        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            const errorMessage = error?.error?.message || 'Erro ao realizar cadastro. Tente novamente.';
            this.toastService.error(errorMessage);
        } finally {
            this.isLoading = false;
        }
    }

    onBackToLogin(): void {
        this.router.navigate(['/login']);
    }

    async onCepChange(event: any): Promise<void> {
        const cep = event?.target?.value || '';
        if (!cep) return;
        const cleanCep = cep.replace(/\D/g, '');

        if (cleanCep.length === 8) {
            try {
                const cepData = await this.partnerRegistrationService.getCepInfo(cleanCep).toPromise();

                if (cepData && !cepData.erro) {
                    const addressGroup = this.registrationForm.get('address') as FormGroup;
                    addressGroup?.patchValue({
                        street: cepData.logradouro || '',
                        neighbourhood: cepData.bairro || '',
                        city: cepData.localidade || '',
                        state: cepData.uf || ''
                    });
                } else {
                    this.toastService.error('CEP não encontrado');
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
                this.toastService.error('Erro ao buscar informações do CEP');
            }
        }
    }

    // Métodos para lidar com eventos dos documentos
    onDocumentsChange(event: any): void {
        console.log('Documentos alterados:', event);
        // Atualizar o formulário com os documentos
        this.registrationForm.patchValue({ documents: event.documents });
    }

    onDocumentUploaded(event: any): void {
        console.log('Documento carregado:', event);
        // Aqui você pode adicionar lógica adicional se necessário
    }

    onDocumentRemoved(documentId: string): void {
        console.log('Documento removido:', documentId);
        // Aqui você pode adicionar lógica adicional se necessário
    }

    onFormValid(isValid: boolean): void {
        console.log('Formulário de documentos válido:', isValid);
        // Aqui você pode adicionar lógica baseada na validade do formulário
    }
}
