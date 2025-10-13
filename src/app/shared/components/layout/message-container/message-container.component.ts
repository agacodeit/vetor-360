import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessagesComponent, Message } from '../messages/messages.component';
import { IconComponent } from '../../atoms/icon/icon.component';

@Component({
    selector: 'app-message-container',
    standalone: true,
    imports: [CommonModule, MessagesComponent, IconComponent],
    templateUrl: './message-container.component.html',
    styleUrl: './message-container.component.scss'
})
export class MessageContainerComponent {
    isOpen = false;
    hasNewMessages = false;

    messages: Message[] = [
        {
            id: '1',
            author: 'Suporte - Ana',
            text: 'Olá! Como posso ajudá-lo hoje?',
            timestamp: 'Hoje às 14:30',
            isOwn: false
        }
    ];

    /**
     * Toggle para abrir/fechar o chat
     */
    toggleChat(): void {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.hasNewMessages = false;
        }
    }

    /**
     * Envia uma nova mensagem
     */
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

    /**
     * Fecha o chat
     */
    onClosed(): void {
        this.isOpen = false;
    }

    /**
     * Minimiza o chat
     */
    onMinimized(isMinimized: boolean): void {
        if (isMinimized) {
            this.isOpen = false;
        }
    }
}

