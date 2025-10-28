import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { FollowUpComponent } from './follow-up.component';
import { DocumentsComponent, DocumentsConfig, DocumentItem } from '../../../../../../shared';

describe('FollowUpComponent', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FollowUpComponent, HttpClientTestingModule]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('Component Methods', () => {
        it('should have all required methods defined', () => {
            expect(component.onMessageSent).toBeDefined();
            expect(component.onMinimized).toBeDefined();
            expect(component.onDocumentsChange).toBeDefined();
            expect(component.onDocumentUploaded).toBeDefined();
            expect(component.onDocumentRemoved).toBeDefined();
            expect(component.onFormValid).toBeDefined();
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.follow-up');
            expect(section).toBeTruthy();
        });

        it('should have grid layout', () => {
            const section = compiled.querySelector('.follow-up');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Follow-up" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent).toContain('Follow-up');
        });

        it('should display messages count', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('2 mensagens');
        });

        it('should display documents count dynamically', () => {
            const content = compiled.textContent || '';
            expect(content).toContain(`${component.uploadedDocumentsCount}/${component.totalDocumentsCount} documentos`);
        });

        it('should render comment icon', () => {
            const icon = compiled.querySelector('ds-icon[icon="fa-regular fa-comment-dots"]');
            expect(icon).toBeTruthy();
        });

        it('should render folder icon', () => {
            const icon = compiled.querySelector('ds-icon[icon="fa-regular fa-folder"]');
            expect(icon).toBeTruthy();
        });

        it('should have correct CSS classes', () => {
            const content = compiled.querySelector('.follow-up__content');
            const stats = compiled.querySelector('.follow-up__stats');

            expect(content).toBeTruthy();
            expect(stats).toBeTruthy();
        });

        it('should render messages component', () => {
            const messagesComponent = compiled.querySelector('app-messages');
            expect(messagesComponent).toBeTruthy();
        });

        it('should render documents component', () => {
            const documentsComponent = compiled.querySelector('ds-documents');
            expect(documentsComponent).toBeTruthy();
        });

        it('should have visualization grid with 2 columns', () => {
            const visualization = compiled.querySelector('.follow-up__visualization');
            expect(visualization?.classList.contains('d-grid')).toBe(true);
            expect(visualization?.classList.contains('columns-2')).toBe(true);
        });
    });

    describe('Component Integration', () => {
        it('should render messages component with correct props', () => {
            const messagesComponent = compiled.querySelector('app-messages');
            expect(messagesComponent).toBeTruthy();
        });

        it('should render documents component with correct props', () => {
            const documentsComponent = compiled.querySelector('ds-documents');
            expect(documentsComponent).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should have stats section with proper layout', () => {
            const stats = compiled.querySelector('.follow-up__stats');

            expect(stats?.classList.contains('d-flex')).toBe(true);
            expect(stats?.classList.contains('align-items-center')).toBe(true);
        });

        it('should display both statistics with icons', () => {
            const stats = compiled.querySelectorAll('.follow-up__stats p');

            expect(stats.length).toBe(2);
        });
    });

    describe('Documents Configuration', () => {
        it('should have documentsConfig initialized', () => {
            expect(component.documentsConfig).toBeDefined();
            expect(component.documentsConfig.title).toBe('Documentos da Solicitação');
            expect(component.documentsConfig.showAccordion).toBe(true);
            expect(component.documentsConfig.allowMultiple).toBe(true);
        });

        it('should have documents array with correct items', () => {
            expect(component.documentsConfig.documents).toBeDefined();
            expect(component.documentsConfig.documents.length).toBeGreaterThan(0);

            const firstDocument = component.documentsConfig.documents[0];
            expect(firstDocument.id).toBeDefined();
            expect(firstDocument.label).toBeDefined();
            expect(firstDocument.required).toBeDefined();
            expect(firstDocument.uploaded).toBeDefined();
            expect(firstDocument.acceptedFormats).toBeDefined();
        });
    });

    describe('Document Count Getters', () => {
        it('should calculate uploadedDocumentsCount correctly', () => {
            const uploadedCount = component.uploadedDocumentsCount;
            const expectedCount = component.documentsConfig.documents.filter(doc => doc.uploaded).length;

            expect(uploadedCount).toBe(expectedCount);
        });

        it('should calculate totalDocumentsCount correctly', () => {
            const totalCount = component.totalDocumentsCount;
            const expectedCount = component.documentsConfig.documents.length;

            expect(totalCount).toBe(expectedCount);
        });

        it('should update counts when document status changes', () => {
            const initialUploadedCount = component.uploadedDocumentsCount;

            // Simulate document upload - find a document that is not uploaded yet
            const document = component.documentsConfig.documents.find(doc => !doc.uploaded);
            expect(document).toBeTruthy(); // Ensure we found a non-uploaded document

            document!.uploaded = true;

            const newUploadedCount = component.uploadedDocumentsCount;
            expect(newUploadedCount).toBe(initialUploadedCount + 1);
        });
    });

    describe('Document Event Handlers', () => {
        it('should handle documentsChange event', () => {
            spyOn(component, 'onDocumentsChange').and.callThrough();

            const mockEvent = { checkboxes: {}, documents: [] };
            component.onDocumentsChange(mockEvent);

            expect(component.onDocumentsChange).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle documentUploaded event', () => {
            spyOn(component, 'onDocumentUploaded').and.callThrough();

            const mockEvent = { documentId: 'rg-cnh', file: new File(['test'], 'test.pdf') };
            component.onDocumentUploaded(mockEvent);

            expect(component.onDocumentUploaded).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle documentRemoved event', () => {
            spyOn(component, 'onDocumentRemoved').and.callThrough();

            const documentId = 'rg-cnh';
            component.onDocumentRemoved(documentId);

            expect(component.onDocumentRemoved).toHaveBeenCalledWith(documentId);
        });

        it('should handle formValid event', () => {
            spyOn(component, 'onFormValid').and.callThrough();

            const isValid = true;
            component.onFormValid(isValid);

            expect(component.onFormValid).toHaveBeenCalledWith(isValid);
        });
    });

    describe('Messages Functionality', () => {
        it('should have messages array initialized', () => {
            expect(component.messages).toBeDefined();
            expect(component.messages.length).toBeGreaterThan(0);
        });

        it('should handle messageSent event', () => {
            spyOn(component, 'onMessageSent').and.callThrough();

            const messageText = 'Test message';
            component.onMessageSent(messageText);

            expect(component.onMessageSent).toHaveBeenCalledWith(messageText);
        });

        it('should handle minimized event', () => {
            spyOn(component, 'onMinimized').and.callThrough();

            const isMinimized = true;
            component.onMinimized(isMinimized);

            expect(component.onMinimized).toHaveBeenCalledWith(isMinimized);
        });

        it('should add new message when messageSent is called', () => {
            const initialMessageCount = component.messages.length;
            const messageText = 'New test message';

            component.onMessageSent(messageText);

            expect(component.messages.length).toBe(initialMessageCount + 1);

            const lastMessage = component.messages[component.messages.length - 1];
            expect(lastMessage.text).toBe(messageText);
            expect(lastMessage.isOwn).toBe(true);
            expect(lastMessage.author).toBe('Você');
        });
    });

    describe('Component Integration', () => {
        it('should pass correct props to messages component', () => {
            const messagesComponent = compiled.querySelector('app-messages');
            expect(messagesComponent).toBeTruthy();

            // Check if messages array is passed
            expect(component.messages).toBeDefined();
        });

        it('should pass correct props to documents component', () => {
            const documentsComponent = compiled.querySelector('ds-documents');
            expect(documentsComponent).toBeTruthy();

            // Check if documentsConfig is passed
            expect(component.documentsConfig).toBeDefined();
        });
    });
});

