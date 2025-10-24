import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessagesComponent, Message } from './messages.component';
import { FormsModule } from '@angular/forms';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('MessagesComponent', () => {
    let component: MessagesComponent;
    let fixture: ComponentFixture<MessagesComponent>;
    let compiled: HTMLElement;

    const mockMessages: Message[] = [
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

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessagesComponent, FormsModule]
        }).compileComponents();

        fixture = TestBed.createComponent(MessagesComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement as HTMLElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Initialization', () => {
        it('should initialize with empty messages array', () => {
            expect(component.messages).toEqual([]);
        });

        it('should initialize with empty messageText', () => {
            expect(component.messageText).toBe('');
        });

        it('should initialize with isMinimized as false', () => {
            expect(component.isMinimized).toBe(false);
        });
    });

    describe('Input Properties', () => {
        it('should accept messages input', () => {
            component.messages = mockMessages;
            fixture.detectChanges();

            expect(component.messages.length).toBe(3);
            expect(component.messages).toEqual(mockMessages);
        });

        it('should handle empty messages array', () => {
            component.messages = [];
            fixture.detectChanges();

            const messagesList = compiled.querySelector('.messages__list');
            expect(messagesList?.children.length).toBe(0);
        });

        it('should have showHeader as true by default', () => {
            expect(component.showHeader).toBe(true);
        });

        it('should accept showHeader input', () => {
            component.showHeader = false;
            fixture.detectChanges();

            expect(component.showHeader).toBe(false);
        });
    });

    describe('Template Rendering', () => {
        it('should render header with title when showHeader is true', () => {
            component.showHeader = true;
            fixture.detectChanges();

            const title = compiled.querySelector('.messages__title');
            expect(title?.textContent?.trim()).toBe('Chat');
        });

        it('should not render header when showHeader is false', () => {
            component.showHeader = false;
            fixture.detectChanges();

            const header = compiled.querySelector('.messages__header');
            expect(header).toBeFalsy();
        });

        it('should render minimize and close buttons when showHeader is true', () => {
            component.showHeader = true;
            fixture.detectChanges();

            const buttons = compiled.querySelectorAll('.messages__action-btn');
            expect(buttons.length).toBe(2);
        });

        it('should not render minimize and close buttons when showHeader is false', () => {
            component.showHeader = false;
            fixture.detectChanges();

            const buttons = compiled.querySelectorAll('.messages__action-btn');
            expect(buttons.length).toBe(0);
        });

        it('should render messages container', () => {
            const container = compiled.querySelector('.messages__container');
            expect(container).toBeTruthy();
        });

        it('should render input container with input field', () => {
            const input = compiled.querySelector('.messages__input') as HTMLInputElement;
            expect(input).toBeTruthy();
            expect(input.placeholder).toBe('Digite sua mensagem... use @ para mencionar');
        });

        it('should render send button', () => {
            const sendBtn = compiled.querySelector('.messages__send-btn');
            expect(sendBtn?.textContent).toContain('Enviar');
        });

        it('should render action buttons (mention and attach)', () => {
            const inputBtns = compiled.querySelectorAll('.messages__input-btn');
            expect(inputBtns.length).toBe(2);
        });
    });

    describe('Messages Rendering', () => {
        beforeEach(() => {
            component.messages = mockMessages;
            fixture.detectChanges();
        });

        it('should render all messages', () => {
            const messages = compiled.querySelectorAll('.messages__message');
            expect(messages.length).toBe(3);
        });

        it('should render message with author name', () => {
            const author = compiled.querySelector('.messages__author');
            expect(author?.textContent).toBe('João da Silva - Advisor');
        });

        it('should render message with timestamp', () => {
            const timestamp = compiled.querySelector('.messages__timestamp');
            expect(timestamp?.textContent).toBe('Hoje às 09:32');
        });

        it('should render message text', () => {
            const text = compiled.querySelector('.messages__text');
            expect(text?.textContent).toContain('Bom dia, equipe');
        });

        it('should render avatar for each message', () => {
            const avatars = compiled.querySelectorAll('.messages__avatar');
            expect(avatars.length).toBe(3);
        });

        it('should apply "own message" class correctly', () => {
            const ownMessage = compiled.querySelectorAll('.messages__message--own');
            expect(ownMessage.length).toBe(1); // Only message with isOwn: true
        });

        it('should render attachment when present', () => {
            const attachment = compiled.querySelector('.messages__attachment');
            expect(attachment).toBeTruthy();
        });

        it('should render attachment name', () => {
            const attachmentName = compiled.querySelector('.messages__attachment-name');
            expect(attachmentName?.textContent).toBe('analise_solicitacao_1234.pdf');
        });

        it('should render download button for attachment', () => {
            const downloadBtn = compiled.querySelector('.messages__attachment-download');
            expect(downloadBtn).toBeTruthy();
        });
    });

    describe('formatMessage Method', () => {
        it('should format mentions with @ symbol', () => {
            const text = 'Olá @João da Silva, tudo bem?';
            const formatted = component.formatMessage(text);
            expect(formatted).toContain('<span class="mention">@João da Silva</span>');
        });

        it('should format multiple mentions', () => {
            const text = 'Olá @João, @Maria, tudo bem?';
            const formatted = component.formatMessage(text);
            expect(formatted).toContain('<span class="mention">@João</span>');
            expect(formatted).toContain('<span class="mention">@Maria</span>');
        });

        it('should not format text without mentions', () => {
            const text = 'Mensagem sem menção';
            const formatted = component.formatMessage(text);
            expect(formatted).toBe(text);
        });
    });

    describe('sendMessage Method', () => {
        it('should emit messageSent event when message is sent', () => {
            spyOn(component.messageSent, 'emit');
            component.messageText = 'Test message';
            component.sendMessage();

            expect(component.messageSent.emit).toHaveBeenCalledWith('Test message');
        });

        it('should clear messageText after sending', () => {
            component.messageText = 'Test message';
            component.sendMessage();

            expect(component.messageText).toBe('');
        });

        it('should not emit event when message is empty', () => {
            spyOn(component.messageSent, 'emit');
            component.messageText = '';
            component.sendMessage();

            expect(component.messageSent.emit).not.toHaveBeenCalled();
        });

        it('should not emit event when message is only whitespace', () => {
            spyOn(component.messageSent, 'emit');
            component.messageText = '   ';
            component.sendMessage();

            expect(component.messageSent.emit).not.toHaveBeenCalled();
        });
    });

    describe('toggleMinimize Method', () => {
        it('should toggle isMinimized state', () => {
            expect(component.isMinimized).toBe(false);
            component.toggleMinimize();
            expect(component.isMinimized).toBe(true);
            component.toggleMinimize();
            expect(component.isMinimized).toBe(false);
        });

        it('should emit minimized event with current state', () => {
            spyOn(component.minimized, 'emit');
            component.toggleMinimize();

            expect(component.minimized.emit).toHaveBeenCalledWith(true);
        });

        it('should apply minimized class when minimized', () => {
            component.isMinimized = true;
            fixture.detectChanges();

            const messagesDiv = compiled.querySelector('.messages');
            expect(messagesDiv?.classList.contains('messages--minimized')).toBe(true);
        });
    });

    describe('Component Methods', () => {
        it('should have all required methods defined', () => {
            expect(component.sendMessage).toBeDefined();
            expect(component.toggleMinimize).toBeDefined();
            expect(component.openMentions).toBeDefined();
            expect(component.openAttachment).toBeDefined();
            expect(component.formatMessage).toBeDefined();
        });
    });

    describe('openMentions Method', () => {
        it('should be defined', () => {
            expect(component.openMentions).toBeDefined();
        });

        it('should call openMentions when clicking mention button', () => {
            spyOn(component, 'openMentions');
            const mentionBtn = compiled.querySelectorAll('.messages__input-btn')[0] as HTMLButtonElement;
            mentionBtn.click();

            expect(component.openMentions).toHaveBeenCalled();
        });
    });

    describe('openAttachment Method', () => {
        it('should be defined', () => {
            expect(component.openAttachment).toBeDefined();
        });

        it('should call openAttachment when clicking attach button', () => {
            spyOn(component, 'openAttachment');
            const attachBtn = compiled.querySelectorAll('.messages__input-btn')[1] as HTMLButtonElement;
            attachBtn.click();

            expect(component.openAttachment).toHaveBeenCalled();
        });
    });

    describe('User Interactions', () => {
        it('should update messageText when typing in input', () => {
            const input = compiled.querySelector('.messages__input') as HTMLInputElement;
            input.value = 'Nova mensagem';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            expect(component.messageText).toBe('Nova mensagem');
        });

        it('should call sendMessage when clicking send button', () => {
            spyOn(component, 'sendMessage');
            component.messageText = 'Test';
            fixture.detectChanges();

            const sendBtn = compiled.querySelector('.messages__send-btn') as HTMLButtonElement;
            sendBtn.click();

            expect(component.sendMessage).toHaveBeenCalled();
        });

        it('should call sendMessage when pressing Enter', () => {
            spyOn(component, 'sendMessage');
            const input = compiled.querySelector('.messages__input') as HTMLInputElement;

            const event = new KeyboardEvent('keydown', { key: 'Enter' });
            input.dispatchEvent(event);

            expect(component.sendMessage).toHaveBeenCalled();
        });

        it('should disable send button when messageText is empty', () => {
            component.messageText = '';
            fixture.detectChanges();

            const sendBtn = compiled.querySelector('.messages__send-btn') as HTMLButtonElement;
            expect(sendBtn.disabled).toBe(true);
        });

        it('should enable send button when messageText has content', () => {
            component.messageText = 'Test message';
            fixture.detectChanges();

            const sendBtn = compiled.querySelector('.messages__send-btn') as HTMLButtonElement;
            expect(sendBtn.disabled).toBe(false);
        });

        it('should call toggleMinimize when clicking minimize button', () => {
            spyOn(component, 'toggleMinimize');
            const minimizeBtn = compiled.querySelectorAll('.messages__action-btn')[0] as HTMLButtonElement;
            minimizeBtn.click();

            expect(component.toggleMinimize).toHaveBeenCalled();
        });
    });

    describe('Integration Tests', () => {
        it('should render complete chat interface', () => {
            component.messages = mockMessages;
            fixture.detectChanges();

            expect(compiled.querySelector('.messages__header')).toBeTruthy();
            expect(compiled.querySelector('.messages__container')).toBeTruthy();
            expect(compiled.querySelector('.messages__input-container')).toBeTruthy();
        });

        it('should handle full message sending workflow', () => {
            spyOn(component.messageSent, 'emit');

            const input = compiled.querySelector('.messages__input') as HTMLInputElement;
            input.value = 'Nova mensagem de teste';
            input.dispatchEvent(new Event('input'));
            fixture.detectChanges();

            const sendBtn = compiled.querySelector('.messages__send-btn') as HTMLButtonElement;
            sendBtn.click();

            expect(component.messageSent.emit).toHaveBeenCalledWith('Nova mensagem de teste');
            expect(component.messageText).toBe('');
        });

        it('should have minimized class when isMinimized is true', () => {
            component.isMinimized = true;
            fixture.detectChanges();

            const messagesDiv = compiled.querySelector('.messages');
            expect(messagesDiv?.classList.contains('messages--minimized')).toBe(true);
        });

        it('should format mentions in message display', () => {
            component.messages = [mockMessages[1]]; // Message with mentions
            fixture.detectChanges();

            const messageText = compiled.querySelector('.messages__text');
            expect(messageText?.innerHTML).toContain('mention');
        });
    });

    describe('CSS Classes', () => {
        it('should have correct base class', () => {
            const messages = compiled.querySelector('.messages');
            expect(messages).toBeTruthy();
        });

        it('should apply minimized class when isMinimized is true', () => {
            component.isMinimized = false;
            fixture.detectChanges();
            let messagesDiv = compiled.querySelector('.messages');
            expect(messagesDiv?.classList.contains('messages--minimized')).toBe(false);

            component.isMinimized = true;
            fixture.detectChanges();
            messagesDiv = compiled.querySelector('.messages');
            expect(messagesDiv?.classList.contains('messages--minimized')).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle messages without attachments', () => {
            component.messages = [mockMessages[0]]; // Message without attachment
            fixture.detectChanges();

            const attachment = compiled.querySelector('.messages__attachment');
            expect(attachment).toBeFalsy();
        });

        it('should handle very long message text', () => {
            const longText = 'A'.repeat(500);
            component.messages = [{
                id: '99',
                author: 'Test User',
                text: longText,
                timestamp: 'Now',
                isOwn: false
            }];
            fixture.detectChanges();

            const messageText = compiled.querySelector('.messages__text');
            expect(messageText?.textContent).toContain('AAA');
        });

        it('should handle message with special characters', () => {
            const specialText = 'Test <script>alert("xss")</script> @User';
            const formatted = component.formatMessage(specialText);
            expect(formatted).toContain('@User');
        });
    });
});

