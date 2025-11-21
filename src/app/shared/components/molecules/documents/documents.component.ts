import { Component, EventEmitter, Input, OnInit, OnChanges, Output, SimpleChanges, ViewEncapsulation, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AccordionComponent, AccordionItem, AccordionItemDirective, IconComponent } from '../../index';
import { DocumentService, ToastService, ErrorHandlerService } from '../../../services';
import { DocumentFile } from '../../../types/profile.types';

export interface DocumentItem {
    id: string;
    documentType: string;
    opportunityId?: string;
    label: string;
    required: boolean;
    file?: File;
    uploaded: boolean;
    acceptedFormats: string;
    isValidating?: boolean;
    isRemoving?: boolean;
    initialDocument?: boolean;
    files?: DocumentFile[] | null;
    dateHourIncluded?: string;
    dateHourUpdated?: string;
    userIncludedId?: string;
    documentStatusEnum?: string;
    responsibleUserId?: string;
    comments?: any[];
    playerIdWhoRequestedDocument?: string;
    fileCode?: string | null;
}

export interface DocumentsConfig {
    title?: string;
    description?: string;
    showAccordion?: boolean;
    allowMultiple?: boolean;
    documents: DocumentItem[];
}

@Component({
    selector: 'ds-documents',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormsModule,
        AccordionComponent,
        AccordionItemDirective,
        IconComponent
    ],
    templateUrl: './documents.component.html',
    styleUrls: ['./documents.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DocumentsComponent implements OnInit, OnChanges {
    @Input() requireVerification: boolean = false;
    @Input() config: DocumentsConfig = {
        title: 'Documentos Obrigatórios',
        showAccordion: true,
        allowMultiple: true,
        documents: []
    };

    @Input() initialData: any = {};

    @Output() documentsChange = new EventEmitter<{
        documents: DocumentItem[];
    }>();

    @Output() documentUploaded = new EventEmitter<{
        documentId: string;
        file: File;
        fileCode?: string | null;
        uploadResponse?: any;
    }>();

    @Output() documentRemoved = new EventEmitter<string>();

    @Output() formValid = new EventEmitter<boolean>();

    documentsForm: FormGroup;
    accordionItems: AccordionItem[] = [];

    constructor(
        private fb: FormBuilder,
        @Inject(DocumentService) private documentService: DocumentService,
        @Inject(ToastService) private toastService: ToastService,
        @Inject(ErrorHandlerService) private errorHandler: ErrorHandlerService
    ) {
        this.documentsForm = this.fb.group({});
    }

    ngOnInit(): void {
        this.initializeForm();
        this.setupAccordion();
        this.loadInitialData();
        this.setupFormSubscriptions();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['config'] && changes['config'].currentValue) {
            this.initializeForm();
            this.setupAccordion();
            this.loadInitialData();
        }
    }

    private initializeForm(): void {
        // Formulário não é mais necessário para checkboxes, mas mantido para compatibilidade
        this.documentsForm = this.fb.group({});
    }

    private setupAccordion(): void {
        if (this.config.showAccordion) {
            this.accordionItems = [
                {
                    id: 'documents-section',
                    title: this.config.title || 'Documentos',
                    expanded: true
                }
            ];
        } else {
            this.accordionItems = [];
        }
    }

    private loadInitialData(): void {
        if (this.initialData && Object.keys(this.initialData).length > 0) {
            if (this.initialData.documents) {
                this.initialData.documents.forEach((savedDoc: DocumentItem) => {
                    const doc = this.config.documents.find(d => d.id === savedDoc.id);
                    if (doc) {
                        doc.file = savedDoc.file;
                        doc.uploaded = savedDoc.uploaded;
                    }
                });
            }
        }
    }

    private setupFormSubscriptions(): void {
        // Emit initial validity
        this.formValid.emit(true);
    }

    onAccordionItemToggled(item: AccordionItem): void {
        // Handle accordion toggle if needed
    }


    /**
     * Manipula o upload de arquivo
     */
    onFileSelected(event: Event, documentId: string): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const document = this.config.documents.find(doc => doc.id === documentId);

            if (document) {
                // Define o documento como validando
                document.isValidating = true;

                // Verifica se deve fazer validação
                if (this.requireVerification) {
                    this.validateAndUploadFile(file, documentId);
                } else {
                    // Se não requer verificação, faz upload direto
                    this.uploadFileDirectly(file, documentId);
                }
            }
        }
    }

    /**
     * Valida e faz upload do arquivo
     */
    private validateAndUploadFile(file: File, documentId: string): void {
        // Primeiro valida o arquivo
        this.documentService.validateFile(file, documentId).subscribe({
            next: (validationResponse) => {
                if (validationResponse.success) {
                    // Se validação passou, faz o upload
                    this.uploadFileDirectly(file, documentId);
                } else {
                    // Se validação falhou, exibe a mensagem de erro e limpa o documento
                    this.toastService.error(validationResponse.message);
                    this.clearDocumentFile(documentId);
                }
            },
            error: (error) => {
                console.error('Erro na validação:', error);
                const errorMessage = this.errorHandler.getErrorMessage(error);
                this.toastService.error(errorMessage);
                this.clearDocumentFile(documentId);
            }
        });
    }

    /**
     * Faz upload direto do arquivo
     */
    private uploadFileDirectly(file: File, documentId: string): void {
        this.documentService.uploadFile(file).subscribe({
            next: (uploadResponse) => {
                console.log('Upload realizado com sucesso:', uploadResponse);
                this.toastService.success('Documento carregado com sucesso!');

                // Atualiza o documento
                const document = this.config.documents.find(doc => doc.id === documentId);
                if (document) {
                    document.file = file;
                    document.uploaded = true;
                    document.isValidating = false;

                    // Emite mudança nos documentos
                    this.documentsChange.emit({
                        documents: this.config.documents
                    });

                    this.documentUploaded.emit({
                        documentId,
                        file,
                        fileCode: uploadResponse?.fileCode || uploadResponse?.id || null,
                        uploadResponse: uploadResponse
                    });
                }
            },
            error: (error) => {
                console.error('Erro no upload:', error);
                const errorMessage = this.errorHandler.getErrorMessage(error);
                this.toastService.error(errorMessage);
                this.clearDocumentFile(documentId);
            }
        });
    }

    /**
     * Limpa o arquivo do documento
     */
    private clearDocumentFile(documentId: string): void {
        const document = this.config.documents.find(doc => doc.id === documentId);
        if (document) {
            document.file = undefined;
            document.uploaded = false;
            document.isValidating = false;

            // Emite mudança nos documentos
            this.documentsChange.emit({
                documents: this.config.documents
            });

            // Emite evento para limpar o input file
            this.documentRemoved.emit(documentId);
        }
    }

    /**
     * Retorna o nome do arquivo ou texto padrão
     */
    getFileName(documentId: string): string {
        const document = this.config.documents.find(doc => doc.id === documentId);
        return document?.file?.name || 'Selecionar';
    }

    /**
     * Remove o arquivo do documento
     */
    removeDocument(documentId: string): void {
        const document = this.config.documents.find(doc => doc.id === documentId);

        if (document) {
            document.file = undefined;
            document.uploaded = false;

            // Emite mudança nos documentos
            this.documentsChange.emit({
                documents: this.config.documents
            });

            this.documentRemoved.emit(documentId);
        }
    }

    /**
     * Limpa apenas o arquivo selecionado (sem emitir evento de remoção)
     */
    clearSelectedFile(documentId: string): void {
        const document = this.config.documents.find(doc => doc.id === documentId);

        if (document) {
            document.file = undefined;
            document.uploaded = false;
            document.isValidating = false;

            // Emite mudança nos documentos
            this.documentsChange.emit({
                documents: this.config.documents
            });
        }
    }

    /**
     * Define o estado de validação de um documento
     */
    setDocumentValidating(documentId: string, isValidating: boolean): void {
        const document = this.config.documents.find(doc => doc.id === documentId);
        if (document) {
            document.isValidating = isValidating;
        }
    }


    /**
     * Obtém o valor atual do formulário
     */
    getFormValue(): any {
        return {
            documents: this.config.documents
        };
    }

    /**
     * Define dados do formulário
     */
    setFormValue(data: any): void {
        if (data.documents) {
            data.documents.forEach((savedDoc: DocumentItem) => {
                const doc = this.config.documents.find(d => d.id === savedDoc.id);
                if (doc) {
                    doc.file = savedDoc.file;
                    doc.uploaded = savedDoc.uploaded;
                }
            });

            // Emite mudança nos documentos
            this.documentsChange.emit({
                documents: this.config.documents
            });
        }
    }
}
