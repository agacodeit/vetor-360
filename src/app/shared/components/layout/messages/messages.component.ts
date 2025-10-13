import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Message {
    id: string;
    author: string;
    text: string;
    timestamp: string;
    isOwn: boolean;
    attachment?: {
        name: string;
        url: string;
    };
}

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent {
    @Input() messages: Message[] = [];
    @Input() showHeader = true;
    @Output() messageSent = new EventEmitter<string>();
    @Output() closed = new EventEmitter<void>();
    @Output() minimized = new EventEmitter<boolean>();

    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    messageText = '';
    isMinimized = false;

    /**
     * Envia uma nova mensagem
     */
    sendMessage(): void {
        if (this.messageText.trim()) {
            this.messageSent.emit(this.messageText);
            this.messageText = '';
            this.scrollToBottom();
        }
    }

    /**
     * Fecha o chat
     */
    close(): void {
        this.closed.emit();
    }

    /**
     * Toggle minimizar/maximizar
     */
    toggleMinimize(): void {
        this.isMinimized = !this.isMinimized;
        this.minimized.emit(this.isMinimized);
    }

    /**
     * Abre seletor de menções
     */
    openMentions(): void {
        // Implementar lógica de menções
        console.log('Open mentions');
    }

    /**
     * Abre seletor de anexos
     */
    openAttachment(): void {
        // Implementar lógica de anexos
        console.log('Open attachment');
    }

    /**
     * Formata mensagem com menções
     */
    formatMessage(text: string): string {
        // Regex que suporta caracteres acentuados e espaços
        return text.replace(/@([\wÀ-ÿ]+(?:\s+[\wÀ-ÿ]+)*)/g, '<span class="mention">@$1</span>');
    }

    /**
     * Scroll para o final da lista de mensagens
     */
    private scrollToBottom(): void {
        setTimeout(() => {
            if (this.messagesContainer) {
                this.messagesContainer.nativeElement.scrollTop =
                    this.messagesContainer.nativeElement.scrollHeight;
            }
        }, 100);
    }
}

