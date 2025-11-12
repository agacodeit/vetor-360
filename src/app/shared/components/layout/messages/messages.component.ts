import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../../atoms/icon/icon.component';
import { SpinnerComponent } from '../../atoms/spinner/spinner.component';

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
    imports: [CommonModule, FormsModule, IconComponent, SpinnerComponent],
    templateUrl: './messages.component.html',
    styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnChanges {
    @Input() messages: Message[] = [];
    @Input() showHeader = true;
    @Input() isLoading = false;
    @Output() messageSent = new EventEmitter<string>();
    @Output() minimized = new EventEmitter<boolean>();

    @ViewChild('messagesContainer') messagesContainer!: ElementRef;

    messageText = '';
    isMinimized = false;

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['messages'] && this.messages?.length) {
            this.scrollToBottom();
        }
    }

    /**
     * Envia uma nova mensagem
     */
    sendMessage(): void {
        if (this.isLoading || this.isMinimized) {
            return;
        }

        if (this.messageText.trim()) {
            this.messageSent.emit(this.messageText);
            this.messageText = '';
            this.scrollToBottom();
        }
    }

    /**
     * Toggle minimizar/maximizar
     */
    toggleMinimize(): void {
        this.isMinimized = !this.isMinimized;
        this.minimized.emit(this.isMinimized);
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

