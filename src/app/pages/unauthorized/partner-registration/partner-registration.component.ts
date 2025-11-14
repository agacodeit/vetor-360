import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MaskDirective, MaskDirectiveService } from "mask-directive";
import { lastValueFrom } from 'rxjs';
import { ACCEPTED_DOCUMENT_FORMATS, ButtonComponent, CepService, DocumentItem, DocumentsConfig, PartnerRegistrationRequest, PartnerRegistrationService, StepperComponent, StepperStep, ToastService, ErrorHandlerService} from '../../../shared';
import { PersonTypeStepComponent } from './steps/person-type-step/person-type-step.component';
import { BasicInfoStepComponent } from './steps/basic-info-step/basic-info-step.component';
import { AddressStepComponent } from './steps/address-step/address-step.component';
import { DocumentsStepComponent } from './steps/documents-step/documents-step.component';
import { PasswordStepComponent } from './steps/password-step/password-step.component';


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
        PersonTypeStepComponent,
        BasicInfoStepComponent,
        AddressStepComponent,
        DocumentsStepComponent,
        PasswordStepComponent,
        FormsModule
    ],
    providers: [NgModel],
    templateUrl: './partner-registration.component.html',
    styleUrls: ['./partner-registration.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PartnerRegistrationComponent implements OnInit {
    @ViewChild('documentsStepComponent') documentsStepComponent!: DocumentsStepComponent;
    cpfCnpj: string = '';
    currentStep = 0;
    isLoading = false;
    isUploadingDocument = false;
    documentFileCodes: Map<string, string> = new Map(); // Armazena fileCode por documentType

    registrationForm: FormGroup;
    documentsConfig: DocumentsConfig = {
        title: 'Documentos Obrigatórios',
        showAccordion: true,
        allowMultiple: true,
        documents: []
    };

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
        @Inject(ErrorHandlerService) private errorHandler: ErrorHandlerService
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

        // Documentos fixos baseados no tipo de pessoa
        const fixedDocuments = this.getFixedDocuments(personType);
        
        const documentItems: DocumentItem[] = fixedDocuments.map((docType, index) => ({
            id: docType, // Usa o documentType como id
            documentType: docType,
            opportunityId: undefined,
            label: this.getDocumentLabel(docType),
            required: true,
            initialDocument: false,
            files: [],
            dateHourIncluded: undefined,
            dateHourUpdated: undefined,
            userIncludedId: undefined,
            documentStatusEnum: undefined,
            responsibleUserId: undefined,
            comments: [],
            playerIdWhoRequestedDocument: undefined,
            fileCode: null,
            uploaded: false,
            acceptedFormats: ACCEPTED_DOCUMENT_FORMATS
        }));

        this.documentsConfig = {
            title: 'Documentos Obrigatórios',
            showAccordion: true,
            allowMultiple: true,
            documents: documentItems
        };
    }

    /**
     * Retorna os tipos de documento fixos baseados no tipo de pessoa
     */
    private getFixedDocuments(personType: 'F' | 'J'): string[] {
        if (personType === 'F') {
            // Pessoa Física: COMPROVANTE_ENDERECO, RG_OU_CNH
            return ['COMPROVANTE_ENDERECO', 'RG_OU_CNH'];
        } else {
            // Pessoa Jurídica: CONTRATO_SOCIAL, COMPROVANTE_ENDERECO, RG_OU_CNH
            return ['CONTRATO_SOCIAL', 'COMPROVANTE_ENDERECO', 'RG_OU_CNH'];
        }
    }

    /**
     * Retorna o label amigável para o tipo de documento
     */
    private getDocumentLabel(documentType: string): string {
        const labels: { [key: string]: string } = {
            'CONTRATO_SOCIAL': 'Contrato Social',
            'COMPROVANTE_ENDERECO': 'Comprovante de Endereço',
            'RG_OU_CNH': 'RG ou CNH'
        };
        return labels[documentType] || documentType;
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
                // Validação será feita pelo componente DocumentsStepComponent
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

            this.registrationForm.get('cpfCnpj')?.
                setValidators([
                    Validators.required,
                    MaskDirectiveService.maskPatternValidator('000.000.000-00')]
                );
            this.registrationForm.get('cpfCnpj')?.updateValueAndValidity();
        } else {
            this.registrationForm.get('cpfCnpj')?.
                setValidators([
                    Validators.required,
                    MaskDirectiveService.maskPatternValidator('00.000.000/0000-00')]
                );
            this.registrationForm.get('cpfCnpj')?.updateValueAndValidity();
        }


    }

    async onSubmit(): Promise<void> {
        const isFormValid = this.validateCurrentStep();
        if (!isFormValid) return;

        this.isLoading = true;

        try {
            const formData = this.registrationForm.value;

            // Formatar dados para API incluindo os documentos com fileCodes
            const registrationData: PartnerRegistrationRequest =
                this.partnerRegistrationService.formatDataForApi(formData, this.documentFileCodes);

            await lastValueFrom(this.partnerRegistrationService.createPartner(registrationData));
            this.toastService.success('Cadastro realizado com sucesso!');
            this.router.navigate(['/unauthorized/login']);

        } catch (error: any) {
            console.error('Erro no cadastro:', error);
            const errorMessage = this.errorHandler.getErrorMessage(error);
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
                    const errorMessage = this.errorHandler.getErrorMessage(error);
                    this.toastService.error(errorMessage);
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
        
        // Captura o fileCode do evento
        let fileCode = event.fileCode;
        
        // Se não veio direto, tenta pegar da resposta do upload
        if (!fileCode && event.uploadResponse) {
            fileCode = event.uploadResponse.fileCode ||
                event.uploadResponse.id ||
                event.uploadResponse.code ||
                event.uploadResponse.fileId;
        }
        
        // Armazena o fileCode usando o documentType como chave
        if (fileCode && event.documentId) {
            const document = this.documentsConfig.documents.find(doc => doc.id === event.documentId);
            if (document && document.documentType) {
                this.documentFileCodes.set(document.documentType, fileCode);
                console.log(`Armazenando fileCode ${fileCode} para documento ${document.documentType}`);
            }
        }
    }

    onDocumentRemoved(documentId: string): void {
        console.log('Documento removido:', documentId);
        
        // Remove o fileCode do mapa quando o documento é removido
        const document = this.documentsConfig.documents.find(doc => doc.id === documentId);
        if (document && document.documentType) {
            this.documentFileCodes.delete(document.documentType);
        }
    }

    onFormValid(isValid: boolean): void {
        console.log('Formulário de documentos válido:', isValid);
        // Aqui você pode adicionar lógica baseada na validade do formulário
    }
}
