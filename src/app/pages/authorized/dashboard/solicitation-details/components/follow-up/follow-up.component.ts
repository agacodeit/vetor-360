import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard, IconComponent, MessagesComponent, Message, DocumentsComponent, DocumentsConfig, DocumentItem } from '../../../../../../shared';

@Component({
    selector: 'app-follow-up',
    standalone: true,
    imports: [CommonModule, IconComponent, MessagesComponent, DocumentsComponent],
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent {
    private _cardData: KanbanCard | null = null;

    @Input() set cardData(value: KanbanCard | null) {
        this._cardData = value;
        this.updateDocumentsFromOpportunity();
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
        const newMessage: Message = {
            id: Date.now().toString(),
            author: 'Você',
            text: text,
            timestamp: 'Agora',
            isOwn: true
        };
        this.messages = [...this.messages, newMessage];
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

