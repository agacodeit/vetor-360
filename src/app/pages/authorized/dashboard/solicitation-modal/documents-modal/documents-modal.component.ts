import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, DocumentItem, DocumentService, DocumentsComponent, DocumentsConfig, LinkMultipleFilesRequest, ModalService, OperationRegistryService, ToastService, ACCEPTED_DOCUMENT_FORMATS } from '../../../../../shared';
import { SolicitationStatusUtil } from '../../../../../shared/utils/solicitation-status';

@Component({
    selector: 'app-documents-modal',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DocumentsComponent,
        ButtonComponent
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
    private documentService = inject(DocumentService);
    private operationRegistry = inject(OperationRegistryService);

    documentsForm: FormGroup;
    isLoading = false;
    documentsData: any = {};
    isDocumentsValid = true;

    private documentFileCodes: Map<string, string> = new Map();
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
                documentType: doc.documentType,
                opportunityId: doc.opportunityId,
                label: this.getDocumentLabel(doc.documentType),
                required: doc.required ?? false,
                initialDocument: doc.initialDocument ?? false,
                files: doc.files ?? null,
                dateHourIncluded: doc.dateHourIncluded,
                dateHourUpdated: doc.dateHourUpdated,
                userIncludedId: doc.userIncludedId,
                documentStatusEnum: doc.documentStatusEnum,
                responsibleUserId: doc.responsibleUserId,
                comments: doc.comments ?? [],
                playerIdWhoRequestedDocument: doc.playerIdWhoRequestedDocument,
                fileCode: doc.fileCode ?? null,
                uploaded: doc.documentStatusEnum === 'COMPLETED',
                acceptedFormats: ACCEPTED_DOCUMENT_FORMATS
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
        console.log('FileCode recebido:', event.fileCode);
        console.log('UploadResponse completo:', event.uploadResponse);

        // Captura o fileCode do evento (pode vir direto ou dentro de uploadResponse)
        let fileCode = event.fileCode;

        // Se não veio direto, tenta pegar da resposta do upload
        if (!fileCode && event.uploadResponse) {
            fileCode = event.uploadResponse.fileCode ||
                event.uploadResponse.id ||
                event.uploadResponse.code ||
                event.uploadResponse.fileId;
        }

        // Armazena o fileCode se encontrado
        if (fileCode) {
            console.log(`Armazenando fileCode ${fileCode} para documento ${event.documentId}`);
            this.documentFileCodes.set(event.documentId, fileCode);
        } else {
            console.warn(`FileCode não encontrado para documento ${event.documentId}`, event);
        }

        // Atualizar o documento como carregado
        const document = this.documentsConfig.documents.find(doc => doc.id === event.documentId);
        if (document) {
            document.uploaded = true;
            document.file = event.file;
        }
    }

    onDocumentRemoved(documentId: string): void {
        console.log('Documento removido:', documentId);

        // Remove o fileCode do mapa
        this.documentFileCodes.delete(documentId);

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
        if (!this.isDocumentsValid) {
            this.toastService.error('Por favor, envie pelo menos um documento.', 'Documentos obrigatórios');
            return;
        }

        // Verifica documentos que têm arquivo selecionado
        const documentsWithFile = this.documentsConfig.documents.filter(doc =>
            doc.uploaded && doc.file
        );

        if (documentsWithFile.length === 0) {
            this.toastService.error('Por favor, selecione pelo menos um documento para enviar.', 'Documentos obrigatórios');
            return;
        }

        // Log para debug
        console.log('Documentos com arquivo:', documentsWithFile.length);
        console.log('FileCodes armazenados:', Array.from(this.documentFileCodes.entries()));

        // Verifica quais documentos têm fileCode
        const documentsWithoutFileCode = documentsWithFile.filter(doc =>
            !this.documentFileCodes.has(doc.id)
        );

        if (documentsWithoutFileCode.length > 0) {
            console.warn('Documentos sem fileCode:', documentsWithoutFileCode.map(d => ({ id: d.id, label: d.label })));
            this.toastService.error(
                `Alguns documentos ainda não foram processados. Aguarde o upload concluir antes de enviar.`,
                'Aguarde o upload'
            );
            return;
        }

        // Todos os documentos têm fileCode, pode fazer o link
        this.linkDocuments();
    }

    /**
     * Faz o link dos documentos usando os fileCodes já capturados
     */
    private linkDocuments(): void {
        this.isLoading = true;

        const linkRequest = this.buildLinkRequest();

        console.log('Requisição para linkMultipleFiles:', JSON.stringify(linkRequest, null, 2));

        if (linkRequest.length === 0) {
            this.isLoading = false;
            this.toastService.error('Nenhum documento válido para enviar. Verifique se os arquivos foram carregados corretamente.', 'Erro');
            return;
        }

        this.documentService.linkMultipleFiles(linkRequest).subscribe({
            next: (response) => {
                console.log('Resposta do linkMultipleFiles:', response);
                this.isLoading = false;
                this.toastService.success('Documentos enviados com sucesso!', 'Sucesso');
                this.onSubmit.emit({
                    success: true,
                    solicitationId: this.solicitationData?.id,
                    documents: this.documentsData
                });
                this.handleClose();
            },
            error: (error) => {
                console.error('Erro ao linkar documentos:', error);
                console.error('Erro completo:', JSON.stringify(error, null, 2));
                this.isLoading = false;
                this.toastService.error(
                    error.error?.message || 'Erro ao enviar documentos. Tente novamente.',
                    'Erro'
                );
            }
        });
    }

    /**
     * Constrói o array de requisição para linkMultipleFiles
     */
    private buildLinkRequest(): LinkMultipleFilesRequest[] {
        const opportunityId = this.solicitationData?.id;

        if (!opportunityId) {
            console.error('Opportunity ID não encontrado no solicitationData:', this.solicitationData);
            return [];
        }

        console.log('Building link request para opportunityId:', opportunityId);
        console.log('Documentos config:', this.documentsConfig.documents);
        console.log('FileCodes armazenados:', Array.from(this.documentFileCodes.entries()));

        // Filtra apenas documentos que têm arquivo e fileCode
        const documentsWithFileCode = this.documentsConfig.documents.filter(doc => {
            const hasFile = doc.uploaded && doc.file;
            const hasFileCode = this.documentFileCodes.has(doc.id);

            console.log(`Documento ${doc.id} (${doc.label}):`, {
                hasFile,
                hasFileCode,
                fileCode: this.documentFileCodes.get(doc.id)
            });

            return hasFile && hasFileCode;
        });

        console.log('Documentos com fileCode encontrados:', documentsWithFileCode.length);

        // Constrói o array de requisição
        const request = documentsWithFileCode.map(doc => {
            const fileCode = this.documentFileCodes.get(doc.id);

            if (!fileCode) {
                console.warn(`FileCode não encontrado para o documento ${doc.id}`, doc);
                return null;
            }

            const linkItem: LinkMultipleFilesRequest = {
                fileCode: fileCode,
                opportunityId: opportunityId,
                opportunityDocumentId: doc.id
            };

            console.log(`Item adicionado ao link request:`, linkItem);
            return linkItem;
        }).filter((item): item is LinkMultipleFilesRequest => item !== null);

        console.log('Link request final:', request);
        return request;
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
        return this.operationRegistry.getOperationLabel(this.solicitationData?.operation);
    }

    /**
     * Obtém o nome do cliente
     */
    getCustomerName(): string {
        return this.solicitationData?.customerName || 'XPTO';
    }

    getStatusLabel(): string {
        return SolicitationStatusUtil.getLabel(this.solicitationData.status);
    }
}
