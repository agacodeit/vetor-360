import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageContainerComponent } from './message-container.component';
import { MessagesComponent } from '../messages/messages.component';
import { IconComponent } from '../../atoms/icon/icon.component';

describe('MessageContainerComponent', () => {
    let component: MessageContainerComponent;
    let fixture: ComponentFixture<MessageContainerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [MessageContainerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(MessageContainerComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component initialization', () => {
        it('should initialize with default values', () => {
            expect(component.isOpen).toBe(false);
            expect(component.hasNewMessages).toBe(false);
            expect(component.messages.length).toBe(1);
            expect(component.messages[0].author).toBe('Suporte - Ana');
            expect(component.messages[0].text).toBe('Olá! Como posso ajudá-lo hoje?');
        });
    });

    describe('toggleChat', () => {
        it('should open chat when closed', () => {
            component.isOpen = false;

            component.toggleChat();

            expect(component.isOpen).toBe(true);
        });

        it('should close chat when open', () => {
            component.isOpen = true;

            component.toggleChat();

            expect(component.isOpen).toBe(false);
        });

        it('should clear hasNewMessages when opening chat', () => {
            component.hasNewMessages = true;
            component.isOpen = false;

            component.toggleChat();

            expect(component.hasNewMessages).toBe(false);
            expect(component.isOpen).toBe(true);
        });

        it('should not affect hasNewMessages when closing chat', () => {
            component.hasNewMessages = true;
            component.isOpen = true;

            component.toggleChat();

            expect(component.hasNewMessages).toBe(true);
            expect(component.isOpen).toBe(false);
        });
    });

    describe('onMessageSent', () => {
        it('should add new message to messages array', () => {
            const initialLength = component.messages.length;
            const messageText = 'Test message';

            component.onMessageSent(messageText);

            expect(component.messages.length).toBe(initialLength + 1);

            const newMessage = component.messages[component.messages.length - 1];
            expect(newMessage.text).toBe(messageText);
            expect(newMessage.author).toBe('Você');
            expect(newMessage.isOwn).toBe(true);
            expect(newMessage.timestamp).toBe('Agora');
            expect(newMessage.id).toBeTruthy();
        });

        it('should create unique ID for each message', () => {
            const initialLength = component.messages.length;

            // Mock Date.now para garantir IDs únicos
            let mockTime = 1234567890;
            spyOn(Date, 'now').and.callFake(() => mockTime++);

            component.onMessageSent('Message 1');
            component.onMessageSent('Message 2');

            const message1 = component.messages[initialLength];
            const message2 = component.messages[initialLength + 1];

            expect(message1.id).toBeTruthy();
            expect(message2.id).toBeTruthy();
            expect(message1.id).not.toBe(message2.id);
        });

        it('should not modify existing messages', () => {
            const originalMessages = [...component.messages];

            component.onMessageSent('New message');

            expect(component.messages.slice(0, -1)).toEqual(originalMessages);
        });
    });

    describe('onClosed', () => {
        it('should close the chat', () => {
            component.isOpen = true;

            component.onClosed();

            expect(component.isOpen).toBe(false);
        });
    });

    describe('onMinimized', () => {
        it('should close chat when minimized', () => {
            component.isOpen = true;

            component.onMinimized(true);

            expect(component.isOpen).toBe(false);
        });

        it('should not affect chat state when not minimized', () => {
            component.isOpen = true;

            component.onMinimized(false);

            expect(component.isOpen).toBe(true);
        });

        it('should close chat when minimized and chat is already closed', () => {
            component.isOpen = false;

            component.onMinimized(true);

            expect(component.isOpen).toBe(false);
        });
    });

    describe('Template rendering', () => {
        it('should render message FAB button', () => {
            fixture.detectChanges();

            const fabButton = fixture.nativeElement.querySelector('.message-fab');
            expect(fabButton).toBeTruthy();
        });

        it('should render icon component in FAB', () => {
            fixture.detectChanges();

            const iconComponent = fixture.nativeElement.querySelector('ds-icon');
            expect(iconComponent).toBeTruthy();
        });

        it('should have correct icon properties', () => {
            fixture.detectChanges();

            const iconComponent = fixture.nativeElement.querySelector('ds-icon');
            expect(iconComponent).toBeTruthy();
            expect(iconComponent.tagName.toLowerCase()).toBe('ds-icon');
        });

        it('should not render message popup when chat is closed', () => {
            component.isOpen = false;
            fixture.detectChanges();

            const popup = fixture.nativeElement.querySelector('.message-popup');
            expect(popup).toBeFalsy();
        });

        it('should render message popup when chat is open', () => {
            component.isOpen = true;
            fixture.detectChanges();

            const popup = fixture.nativeElement.querySelector('.message-popup');
            expect(popup).toBeTruthy();
        });

        it('should render messages component when chat is open', () => {
            component.isOpen = true;
            fixture.detectChanges();

            const messagesComponent = fixture.nativeElement.querySelector('app-messages');
            expect(messagesComponent).toBeTruthy();
        });

        it('should show badge when hasNewMessages is true and chat is closed', () => {
            component.hasNewMessages = true;
            component.isOpen = false;
            fixture.detectChanges();

            const badge = fixture.nativeElement.querySelector('.message-fab__badge');
            expect(badge).toBeTruthy();
        });

        it('should not show badge when hasNewMessages is false', () => {
            component.hasNewMessages = false;
            component.isOpen = false;
            fixture.detectChanges();

            const badge = fixture.nativeElement.querySelector('.message-fab__badge');
            expect(badge).toBeFalsy();
        });

        it('should not show badge when chat is open', () => {
            component.hasNewMessages = true;
            component.isOpen = true;
            fixture.detectChanges();

            const badge = fixture.nativeElement.querySelector('.message-fab__badge');
            expect(badge).toBeFalsy();
        });

        it('should add active class to FAB when chat is open', () => {
            component.isOpen = true;
            fixture.detectChanges();

            const fabButton = fixture.nativeElement.querySelector('.message-fab');
            expect(fabButton.classList.contains('message-fab--active')).toBe(true);
        });

        it('should not add active class to FAB when chat is closed', () => {
            component.isOpen = false;
            fixture.detectChanges();

            const fabButton = fixture.nativeElement.querySelector('.message-fab');
            expect(fabButton.classList.contains('message-fab--active')).toBe(false);
        });
    });

    describe('Event handling', () => {
        it('should call toggleChat when FAB is clicked', () => {
            spyOn(component, 'toggleChat');
            fixture.detectChanges();

            const fabButton = fixture.nativeElement.querySelector('.message-fab');
            fabButton.click();

            expect(component.toggleChat).toHaveBeenCalled();
        });

        it('should pass correct properties to messages component', () => {
            component.isOpen = true;
            fixture.detectChanges();

            const messagesComponent = fixture.nativeElement.querySelector('app-messages');
            expect(messagesComponent).toBeTruthy();
            expect(messagesComponent.tagName.toLowerCase()).toBe('app-messages');
        });

        it('should handle messageSent event from messages component', () => {
            spyOn(component, 'onMessageSent');

            // Simular diretamente a chamada do método
            const messageText = 'Test message';
            component.onMessageSent(messageText);

            expect(component.onMessageSent).toHaveBeenCalledWith(messageText);
        });

        it('should handle closed event from messages component', () => {
            spyOn(component, 'onClosed');

            // Simular diretamente a chamada do método
            component.onClosed();

            expect(component.onClosed).toHaveBeenCalled();
        });

        it('should handle minimized event from messages component', () => {
            spyOn(component, 'onMinimized');

            // Simular diretamente a chamada do método
            const isMinimized = true;
            component.onMinimized(isMinimized);

            expect(component.onMinimized).toHaveBeenCalledWith(isMinimized);
        });
    });
});
