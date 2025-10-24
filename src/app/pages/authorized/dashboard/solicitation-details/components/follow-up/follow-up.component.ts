import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, MessagesComponent, Message, DocumentsComponent, DocumentsConfig, DocumentItem } from '../../../../../../shared';

@Component({
    selector: 'app-follow-up',
    standalone: true,
    imports: [CommonModule, IconComponent, MessagesComponent, DocumentsComponent],
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent {
    // Configuração dos documentos
    documentsConfig: DocumentsConfig = {
        title: 'Documentos da Solicitação',
        showAccordion: true,
        allowMultiple: true,
        documents: [
            {
                id: 'rg-cnh',
                label: 'RG ou CNH - Documento de identidade',
                required: true,
                uploaded: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'cpf',
                label: 'CPF - Cadastro de Pessoa Física',
                required: true,
                uploaded: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'comprovante-residencia',
                label: 'Comprovante de Residência (últimos 3 meses)',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'comprovante-renda',
                label: 'Comprovante de Renda',
                required: true,
                uploaded: true,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'extrato-bancario',
                label: 'Extrato Bancário (últimos 3 meses)',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            },
            {
                id: 'contrato-social',
                label: 'Contrato Social (se PJ)',
                required: false,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg,.jpeg,.png'
            }
        ]
    };

    messages: Message[] = [
        {
            id: '1',
            author: 'João da Silva - Advisor',
            text: 'Bom dia, equipe. Alguma atualização sobre a solicitação?',
            timestamp: 'Hoje às 09:32',
            isOwn: false
        },
        {
            id: '2',
            author: 'Gestor - João',
            text: 'Bom dia, @João da Silva! A solicitação está em revisão final pelo @Ávila. Anexei a versão preliminar para consulta.',
            timestamp: 'Hoje às 09:35',
            isOwn: true,
            attachment: {
                name: 'analise_solicitacao_1234.pdf',
                url: '/files/analise_solicitacao_1234.pdf'
            }
        },
        {
            id: '3',
            author: 'João da Silva - Advisor',
            text: 'Certo, vou dar uma olhada. Obrigado.',
            timestamp: 'Hoje às 09:32',
            isOwn: false
        }
    ];

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
}

