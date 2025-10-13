import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent, MessagesComponent, Message } from '../../../../../../shared';

@Component({
    selector: 'app-follow-up',
    standalone: true,
    imports: [CommonModule, IconComponent, MessagesComponent],
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent {
    isVisualizationOpen = false;

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

    onOpenVisualization(): void {
        this.isVisualizationOpen = !this.isVisualizationOpen;
    }

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

    onClosed(): void {
        this.isVisualizationOpen = false;
    }

    onMinimized(isMinimized: boolean): void {
        console.log('Chat minimizado:', isMinimized);
    }
}

