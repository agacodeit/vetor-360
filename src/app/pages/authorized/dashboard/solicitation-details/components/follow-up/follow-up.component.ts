import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard, IconComponent, MessagesComponent, Message, DocumentsComponent, DocumentsConfig, DocumentItem, CommentService, CommentDTO, ToastService, AuthService } from '../../../../../../shared';
import { finalize } from 'rxjs/operators';

@Component({
    selector: 'app-follow-up',
    standalone: true,
    imports: [CommonModule, IconComponent, MessagesComponent, DocumentsComponent],
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent {
    private commentService = inject(CommentService);
    private toastService = inject(ToastService);
    private authService = inject(AuthService);

    private _cardData: KanbanCard | null = null;
    private currentOpportunityId: string | null = null;
    private isSendingMessage = false;
    isLoadingMessages = false;

    @Input() set cardData(value: KanbanCard | null) {
        this._cardData = value;
        this.updateDocumentsFromOpportunity();
        this.handleOpportunityChange(value);
    }

    get cardData(): KanbanCard | null {
        return this._cardData;
    }

    // Configuração dos documentos
    documentsConfig: DocumentsConfig = {
        title: 'Documentos da Solicitação',
        showAccordion: true,
        allowMultiple: true,
        documents: []
    };

    messages: Message[] = [];

    onMessageSent(text: string): void {
        if (this.isSendingMessage) {
            return;
        }

        const opportunityId = this.currentOpportunityId;
        if (!opportunityId) {
            this.toastService.error('Não foi possível identificar a oportunidade.');
            return;
        }

        const payload = {
            text: text.trim(),
            opportunityId,
            responseMail: false
        };

        if (!payload.text) {
            return;
        }

        this.isSendingMessage = true;

        this.commentService.addComment(payload).pipe(
            finalize(() => {
                this.isSendingMessage = false;
            })
        ).subscribe({
            next: comment => {
                const message = this.mapCommentToMessage(comment);
                this.messages = [...this.messages, message];
            },
            error: error => {
                console.error('Erro ao enviar comentário:', error);
                this.toastService.error('Não foi possível enviar a mensagem. Tente novamente.');
            }
        });
    }

    onMinimized(isMinimized: boolean): void {
        console.log('Chat minimizado:', isMinimized);
    }

    // Métodos para lidar com eventos dos documentos
    onDocumentsChange(event: any): void {
        console.log('Documentos alterados:', event);
        // Aqui você pode adicionar lógica para salvar ou processar as mudanças
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

    // Método para calcular documentos carregados
    get uploadedDocumentsCount(): number {
        return this.documentsConfig.documents.filter(doc => doc.uploaded).length;
    }

    // Método para obter total de documentos
    get totalDocumentsCount(): number {
        return this.documentsConfig.documents.length;
    }

    private updateDocumentsFromOpportunity(): void {
        const opportunityDocs = this.cardData?.data?.opportunity?.documents ?? [];
        const mappedDocuments: DocumentItem[] = opportunityDocs.map((doc: DocumentItem) => ({
            id: doc.id,
            documentType: doc.documentType,
            opportunityId: doc.opportunityId,
            label: this.formatDocumentLabel(doc.documentType),
            required: !!doc.required,
            initialDocument: !!doc.initialDocument,
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
            acceptedFormats: '.pdf,.jpg,.jpeg,.png'
        }));

        this.documentsConfig = {
            ...this.documentsConfig,
            documents: mappedDocuments
        };
    }

    private handleOpportunityChange(card: KanbanCard | null): void {
        const opportunityId = this.extractOpportunityId(card);

        if (!opportunityId) {
            this.currentOpportunityId = null;
            this.messages = [];
            return;
        }

        if (opportunityId === this.currentOpportunityId && this.messages.length > 0) {
            return;
        }

        this.currentOpportunityId = opportunityId;
        this.loadMessages(opportunityId);
    }

    private extractOpportunityId(card: KanbanCard | null): string | null {
        if (!card) {
            return null;
        }

        return card.data?.opportunity?.id ?? card.id ?? null;
    }

    private loadMessages(opportunityId: string): void {
        this.isLoadingMessages = true;

        this.commentService.listComments(opportunityId).pipe(
            finalize(() => {
                this.isLoadingMessages = false;
            })
        ).subscribe({
            next: comments => {
                const sorted = [...comments].sort((a, b) => this.getCommentTime(a) - this.getCommentTime(b));
                this.messages = sorted.map(comment => this.mapCommentToMessage(comment));
            },
            error: error => {
                console.error('Erro ao carregar comentários:', error);
                this.toastService.error('Não foi possível carregar as mensagens.');
                this.messages = [];
            }
        });
    }

    private mapCommentToMessage(comment: CommentDTO): Message {
        const currentUserId = this.authService.getCurrentUser()?.id ?? null;

        return {
            id: comment.id ?? this.generateTempId(),
            author: comment.userNameIncluded || 'Usuário',
            text: comment.text,
            timestamp: this.formatTimestamp(comment.dateHourIncluded),
            isOwn: comment.userIncludedId === currentUserId
        };
    }

    private getCommentTime(comment: CommentDTO): number {
        const dateString = comment.dateHourIncluded;
        if (!dateString) {
            return 0;
        }

        const normalized = dateString.replace(' ', 'T');
        const date = new Date(normalized);
        if (!isNaN(date.getTime())) {
            return date.getTime();
        }

        const fallback = new Date(dateString);
        return fallback.getTime() || 0;
    }

    private formatTimestamp(dateString?: string): string {
        if (!dateString) {
            return '';
        }

        const normalized = dateString.replace(' ', 'T');
        const date = new Date(normalized);
        if (isNaN(date.getTime())) {
            return dateString;
        }

        return date.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    private generateTempId(): string {
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    }

    private formatDocumentLabel(documentType: string): string {
        if (!documentType) {
            return 'Documento';
        }
        return documentType
            .toLowerCase()
            .replace(/_/g, ' ')
            .replace(/\b\w/g, char => char.toUpperCase());
    }
}

