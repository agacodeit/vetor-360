import { Component, EventEmitter, Input, OnInit, OnChanges, SimpleChanges, Output, ViewEncapsulation, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ToastService, ModalService, DocumentsComponent, ButtonComponent, DocumentsConfig, DocumentItem, IconComponent } from '../../../../../shared';
import { SolicitationStatusUtil } from '../../../../../shared/utils/solicitation-status';

@Component({
    selector: 'app-documents-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DocumentsComponent,
        ButtonComponent,
        IconComponent
    ],
    templateUrl: './documents-modal.component.html',
    styleUrls: ['./documents-modal.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsModalComponent implements OnInit, OnChanges {
    @Input() solicitationData: any = null;
    @Output() onClose = new EventEmitter<void>();
    @Output() onSubmit = new EventEmitter<any>();

    private toastService = inject(ToastService);
    private modalService = inject(ModalService);

    documentsForm: FormGroup;
    isLoading = false;
    documentsData: any = {};
    isDocumentsValid = true;
    documentsConfig: DocumentsConfig = {
        title: 'Documentos da Solicitação',
        showAccordion: true,
        allowMultiple: true,
        documents: []
    };

    // Mapeamento de tipos de documentos para labels legíveis
    private documentTypeLabels: { [key: string]: string } = {
        'CURVA_ABC_CLIENTES': 'Curva ABC de Clientes',
        'PRAZO_MEDIO_RECEBIVEIS': 'Prazo Médio de Recebíveis',
        'INFORMACAO_TRAVA_RECEBIVEIS': 'Informação de Trava de Recebíveis',
        'TRAVA_PERFEITA': 'Trava Perfeita',
        'COMISSARIA': 'Comissária',
        'SEM_TRAVA': 'Sem Trava',
        'GARANTIA_IMOVEIS': 'Garantia de Imóveis',
        'MATRICULA_IMOVEL': 'Matrícula do Imóvel',
        'AVALIACAO_IMOVEL': 'Avaliação do Imóvel',
        'RG_CNH': 'RG ou CNH - Documento de identidade'
    };

    // Mapeamento de tipos de operação para labels legíveis
    private operationTypeLabels: { [key: string]: string } = {
        'WORKING_CAPITAL_LONG_TERM': 'FGI',
        'WORKING_CAPITAL_SHORT_TERM': 'Capital de Giro',
        'INVOICE_DISCOUNTING': 'Desconto de Duplicatas',
        'ANTICIPATION_RECEIVABLES': 'Antecipação de Recebíveis'
    };

    constructor(private fb: FormBuilder) {
        this.documentsForm = this.fb.group({});
    }

    ngOnInit(): void {
        this.loadDocumentsFromSolicitation();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['solicitationData'] && changes['solicitationData'].currentValue) {
            this.loadDocumentsFromSolicitation();
        }
    }

    /**
     * Carrega os documentos da solicitação e converte para o formato esperado pelo componente
     */
    private loadDocumentsFromSolicitation(): void {
        if (!this.solicitationData || !this.solicitationData.documents || !Array.isArray(this.solicitationData.documents)) {
            this.documentsConfig.documents = [];
            return;
        }

        // Converte os documentos da API para o formato DocumentItem
        this.documentsConfig.documents = this.solicitationData.documents.map((doc: any) => {
            const documentItem: DocumentItem = {
                id: doc.id,
                label: this.getDocumentLabel(doc.documentType),
                required: doc.required || false,
                uploaded: doc.documentStatusEnum !== 'PENDING', // Se não está PENDING, já foi enviado
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            };

            return documentItem;
        });

        // Re-inicializa o formulário com os novos documentos
        this.initializeForm();
    }

    /**
     * Obtém o label legível para um tipo de documento
     */
    private getDocumentLabel(documentType: string): string {
        return this.documentTypeLabels[documentType] || documentType;
    }

    /**
     * Inicializa o formulário com os documentos atuais
     */
    private initializeForm(): void {
        const formControls: { [key: string]: any } = {};
        this.documentsConfig.documents.forEach(doc => {
            formControls[doc.id] = [doc.uploaded || false];
        });
        this.documentsForm = this.fb.group(formControls);
    }



    onDocumentUploaded(event: any): void {
        console.log('Documento carregado:', event);
        // Atualizar o documento como carregado
        const document = this.documentsConfig.documents.find(doc => doc.id === event.documentId);
        if (document) {
            document.uploaded = true;
            document.file = event.file;
        }
    }

    onDocumentRemoved(documentId: string): void {
        console.log('Documento removido:', documentId);
        // Atualizar o documento como não carregado
        const document = this.documentsConfig.documents.find(doc => doc.id === documentId);
        if (document) {
            document.uploaded = false;
            document.file = undefined;
        }
    }

    onFormValid(isValid: boolean): void {
        console.log('Formulário de documentos válido:', isValid);
        // Aqui você pode adicionar lógica baseada na validade do formulário
    }

    handleClose(): void {
        this.onClose.emit();
    }

    handleSubmit(): void {
        if (this.isDocumentsValid) {
            this.isLoading = true;

            // Simular envio (substituir por chamada real da API)
            setTimeout(() => {
                this.isLoading = false;
                this.toastService.success('Documentos enviados com sucesso!', 'Sucesso');
                this.onSubmit.emit({
                    success: true,
                    solicitationId: this.solicitationData?.id,
                    documents: this.documentsData
                });
                this.handleClose();
            }, 2000);
        } else {
            this.toastService.error('Por favor, envie pelo menos um documento.', 'Documentos obrigatórios');
        }
    }

    onDocumentsChange(data: any): void {
        this.documentsData = data;
    }

    onDocumentsValidChange(isValid: boolean): void {
        this.isDocumentsValid = isValid;
    }

    /**
     * Obtém o label do tipo de operação
     */
    getOperationLabel(): string {
        if (!this.solicitationData?.operation) {
            return '';
        }
        return this.operationTypeLabels[this.solicitationData.operation] || this.solicitationData.operation;
    }

    /**
     * Obtém o nome do cliente
     */
    getCustomerName(): string {
        return this.solicitationData?.customerName || 'XPTO';
    }

    /**
     * Obtém o label do status atual
     */
    getStatusLabel(): string {
        if (!this.solicitationData?.status) {
            return 'Pendente de documentos';
        }
        // Converte o status para o formato esperado (ex: PENDING_DOCUMENTS -> pending-documents)
        const statusKey = this.solicitationData.status.toLowerCase().replace(/_/g, '-');
        return SolicitationStatusUtil.getLabel(statusKey) || 'Pendente de documentos';
    }
}
