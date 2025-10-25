import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent, CepService, DocumentItem, DocumentService, DocumentsComponent, DocumentsConfig, InputComponent, PartnerRegistrationRequest, PartnerRegistrationService, RadioComponent, RadioOption, StepperComponent, StepperStep, ToastService } from '../../../shared';
import { MaskDirective } from "mask-directive";
import { lastValueFrom } from 'rxjs';


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
        RadioComponent,
        MaskDirective,
        FormsModule
    ],
    providers: [NgModel],
    templateUrl: './partner-registration.component.html',
    styleUrls: ['./partner-registration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PartnerRegistrationComponent implements OnInit {
    @ViewChild('documentsComponent') documentsComponent!: DocumentsComponent;
    cpfCnpj: string = '';
    currentStep = 0;
    isLoading = false;
    isUploadingDocument = false;

    registrationForm: FormGroup;
    documentsConfig: DocumentsConfig = {
        title: 'Documentos Obrigatórios',
        showAccordion: true,
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
        @Inject(PartnerRegistrationService) private partnerRegistrationService: PartnerRegistrationService,
        @Inject(CepService) private cepService: CepService,
        @Inject(DocumentService) private documentService: DocumentService
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
        this.documentsConfig = {
            title: 'Documentos Obrigatórios',
            showAccordion: true,
            allowMultiple: true,
            documents: []
        };
    }

    private loadDocumentsFromApi(personType: 'F' | 'J'): void {
        if (!personType) return;

        this.documentService.createDocument(personType).subscribe({
            next: (documents) => {
                // Converter resposta da API para DocumentItem
                const documentItems: DocumentItem[] = documents.map(doc => ({
                    id: doc.id,
                    label: doc.description,
                    required: true,
                    uploaded: false,
                    acceptedFormats: '.pdf,.jpg,.jpeg,.png'
                }));

                this.documentsConfig = {
                    title: 'Documentos Obrigatórios',
                    showAccordion: true,
                    allowMultiple: true,
                    documents: documentItems
                };
            },
            error: (error) => {
                console.error('Erro ao carregar documentos:', error);
                this.toastService.error('Erro ao carregar documentos. Tente novamente.');

                // Fallback para documentos mock em caso de erro
                this.setupFallbackDocuments(personType);
            }
        });
    }

    private setupFallbackDocuments(personType: 'F' | 'J'): void {
        const isPersonFisica = personType === 'F';
        this.documentsConfig = {
            title: 'Documentos Obrigatórios',
            showAccordion: true,
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
        // Sempre retorna true - validação será feita no método nextStep()
        return true;
    }

    get canGoBack(): boolean {
        return this.currentStep > 0;
    }

    // Métodos para validação visual dos campos
    isFieldInvalid(fieldName: string): boolean {
        const control = this.registrationForm.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    isAddressFieldInvalid(fieldName: string): boolean {
        const addressGroup = this.registrationForm.get('address') as FormGroup;
        const control = addressGroup?.get(fieldName);
        return !!(control && control.invalid && control.touched);
    }

    getFieldErrorMessage(fieldName: string): string {
        const control = this.registrationForm.get(fieldName);
        if (control && control.invalid && control.touched) {
            if (control.errors?.['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors?.['email']) {
                return 'E-mail inválido';
            }
            if (control.errors?.['minlength']) {
                return `Mínimo de ${control.errors?.['minlength'].requiredLength} caracteres`;
            }
            if (control.errors?.['passwordMismatch']) {
                return 'As senhas não coincidem';
            }
            if (control.errors?.['maskPatternInvalid']) {
                const maskError = control.errors?.['maskPatternInvalid'];
                const expectedPattern = maskError?.expectedPatterns?.[0];

                if (fieldName === 'cpfCnpj') {
                    const personType = this.registrationForm.get('personType')?.value;
                    if (personType === 'F') {
                        return 'CPF deve ter o formato 000.000.000-00';
                    } else if (personType === 'J') {
                        return 'CNPJ deve ter o formato 00.000.000/0000-00';
                    }
                }
                if (fieldName === 'cellphone') {
                    return 'Celular deve ter o formato (00) 00000-0000';
                }
                if (fieldName === 'comercialPhone') {
                    return 'Telefone deve ter o formato (00) 0000-0000';
                }
                if (fieldName === 'address.cep') {
                    return 'CEP deve ter o formato 00000-000';
                }

                return `Formato inválido. Esperado: ${expectedPattern || 'formato correto'}`;
            }
        }
        return '';
    }

    getAddressFieldErrorMessage(fieldName: string): string {
        const addressGroup = this.registrationForm.get('address') as FormGroup;
        const control = addressGroup?.get(fieldName);
        if (control && control.invalid && control.touched) {
            if (control.errors?.['required']) {
                return 'Este campo é obrigatório';
            }
            if (control.errors?.['maskPatternInvalid']) {
                const maskError = control.errors?.['maskPatternInvalid'];
                const expectedPattern = maskError?.expectedPatterns?.[0];

                if (fieldName === 'cep') {
                    return 'CEP deve ter o formato 00000-000';
                }

                // Mensagem genérica para outros campos de endereço
                return `Formato inválido. Esperado: ${expectedPattern || 'formato correto'}`;
            }
        }
        return '';
    }

    onStepClick(step: StepperStep): void {
        const stepIndex = this.steps.findIndex(s => s.id === step.id);
        if (stepIndex !== -1 && stepIndex <= this.currentStep) {
            // Se está indo para a etapa de documentos (índice 3), carregar documentos
            if (stepIndex === 3) {
                const personType = this.registrationForm.get('personType')?.value;
                if (personType) {
                    this.loadDocumentsFromApi(personType);
                }
            }

            this.currentStep = stepIndex;
        }
    }

    onStepChanged(stepIndex: number): void {
        this.currentStep = stepIndex;
    }

    nextStep(): void {
        if (this.currentStep < this.steps.length - 1) {
            if (this.validateCurrentStep()) {
                // Se está saindo do passo 1 (tipo de pessoa), carregar documentos
                if (this.currentStep === 0) {
                    const personType = this.registrationForm.get('personType')?.value;
                    if (personType) {
                        this.loadDocumentsFromApi(personType);
                    }
                }

                this.currentStep++;
                this.updateStepStatus();
            }
        }
    }

    private validateCurrentStep(): boolean {
        let isValid = true;
        let invalidFields: string[] = [];

        switch (this.currentStep) {
            case 0: // Tipo de pessoa
                if (!this.isPersonTypeSelected) {
                    this.toastService.error('Por favor, selecione o tipo de pessoa');
                    isValid = false;
                }
                break;

            case 1: // Dados básicos
                const basicFields = ['name', 'cpfCnpj', 'email', 'cellphone'];
                if (this.isPersonJuridica) {
                    basicFields.push('comercialPhone', 'responsibleCompanyName');
                }

                basicFields.forEach(field => {
                    const control = this.registrationForm.get(field);
                    if (control && !control.valid) {
                        invalidFields.push(field);
                        control.markAsTouched();
                    }
                });

                if (invalidFields.length > 0) {
                    this.toastService.error('Por favor, preencha todos os campos obrigatórios');
                    isValid = false;
                }
                break;

            case 2: // Endereço
                const addressGroup = this.registrationForm.get('address') as FormGroup;
                if (addressGroup && !addressGroup.valid) {
                    Object.keys(addressGroup.controls).forEach(key => {
                        const control = addressGroup.get(key);
                        if (control && !control.valid) {
                            invalidFields.push(`address.${key}`);
                            control.markAsTouched();
                        }
                    });

                    this.toastService.error('Por favor, preencha todos os campos de endereço');
                    isValid = false;
                }
                break;

            case 3: // Documentos
                // TODO: Implementar validação de documentos
                break;

            case 4: // Senha
                const passwordControl = this.registrationForm.get('password');
                const confirmPasswordControl = this.registrationForm.get('confirmPassword');

                if (passwordControl && !passwordControl.valid) {
                    invalidFields.push('password');
                    passwordControl.markAsTouched();
                }

                if (confirmPasswordControl && !confirmPasswordControl.valid) {
                    invalidFields.push('confirmPassword');
                    confirmPasswordControl.markAsTouched();
                }

                if (invalidFields.length > 0) {
                    this.toastService.error('Por favor, preencha os campos de senha corretamente');
                    isValid = false;
                }
                break;
        }

        return isValid;
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

        if (personType === 'F') {
            this.registrationForm.patchValue({
                comercialPhone: '',
                responsibleCompanyName: ''
            });
        }
    }

    async onSubmit(): Promise<void> {
        if (!this.registrationForm.valid) {
            this.toastService.error('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        this.isLoading = true;

        try {
            const formData = this.registrationForm.value;

            // Formatar dados para API
            const registrationData: PartnerRegistrationRequest =
                this.partnerRegistrationService.formatDataForApi(formData);

            const response = await lastValueFrom(this.partnerRegistrationService.createPartner(registrationData));

            if (response?.success) {
                this.toastService.success('Cadastro realizado com sucesso!');
                this.router.navigate(['/unauthorized/login']);
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
        this.router.navigate(['/unauthorized/login']);
    }

    onCepChange(event: any): void {
        const cep = event?.target?.value || '';
        if (!cep) return;

        // Valida se o CEP está completo
        if (this.cepService.isValidCep(cep)) {
            this.cepService.getCepInfo(cep).subscribe({
                next: (cepData) => {
                    if (cepData) {
                        const addressGroup = this.registrationForm.get('address') as FormGroup;
                        addressGroup?.patchValue({
                            street: cepData.logradouro || '',
                            neighbourhood: cepData.bairro || '',
                            city: cepData.localidade || '',
                            state: cepData.uf || ''
                        });

                        // Mostra sucesso se encontrou o CEP
                        this.toastService.success('Endereço preenchido automaticamente');
                    } else {
                        this.toastService.error('CEP não encontrado');
                    }
                },
                error: (error) => {
                    console.error('Erro ao buscar CEP:', error);
                    this.toastService.error('Erro ao buscar informações do CEP');
                }
            });
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
        // Implementar validação e upload real para a API usando o DocumentService
        if (event.file && event.documentId) {
            this.validateAndUploadFile(event.file, event.documentId);
        }
    }

    private validateAndUploadFile(file: File, documentId: string): void {
        this.isUploadingDocument = true;

        // Define o documento como validando
        if (this.documentsComponent) {
            this.documentsComponent.setDocumentValidating(documentId, true);
        }

        // Primeiro valida o arquivo
        this.documentService.validateFile(file, documentId).subscribe({
            next: (validationResponse) => {
                if (validationResponse.success) {
                    // Se validação passou, faz o upload
                    this.documentService.uploadFile(file).subscribe({
                        next: (uploadResponse) => {
                            console.log('Upload realizado com sucesso:', uploadResponse);
                            this.toastService.success('Documento enviado com sucesso!');
                            this.isUploadingDocument = false;

                            // Remove o estado de validação
                            if (this.documentsComponent) {
                                this.documentsComponent.setDocumentValidating(documentId, false);
                            }
                        },
                        error: (error) => {
                            console.error('Erro no upload:', error);
                            this.toastService.error('Erro ao enviar documento. Tente novamente.');
                            this.isUploadingDocument = false;

                            // Remove o estado de validação
                            if (this.documentsComponent) {
                                this.documentsComponent.setDocumentValidating(documentId, false);
                            }
                        }
                    });
                } else {
                    // Se validação falhou, exibe a mensagem de erro e limpa o documento
                    this.toastService.error(validationResponse.message);
                    this.clearDocumentFile(documentId);
                    this.isUploadingDocument = false;
                }
            },
            error: (error) => {
                console.error('Erro na validação:', error);
                this.toastService.error('Erro ao validar documento. Tente novamente.');
                this.clearDocumentFile(documentId);
                this.isUploadingDocument = false;
            }
        });
    }

    private clearDocumentFile(documentId: string): void {
        if (this.documentsComponent) {
            this.documentsComponent.clearSelectedFile(documentId);
        }
    }

    onDocumentRemoved(documentId: string): void {
        console.log('Documento removido:', documentId);
        // Apenas log - não chama API de delete
    }

    onFormValid(isValid: boolean): void {
        console.log('Formulário de documentos válido:', isValid);
        // Aqui você pode adicionar lógica baseada na validade do formulário
    }
}
