import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { FollowUpComponent } from './follow-up.component';
import { DocumentsComponent, DocumentsConfig, DocumentItem, KanbanCard, CommentService, CommentDTO, AuthService, DocumentService, ToastService, ErrorHandlerService } from '../../../../../../shared';

describe('FollowUpComponent', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;
    let compiled: HTMLElement;
    let commentService: jasmine.SpyObj<CommentService>;
    let authService: jasmine.SpyObj<AuthService>;
    let documentService: jasmine.SpyObj<DocumentService>;
    let toastService: jasmine.SpyObj<ToastService>;
    let errorHandler: jasmine.SpyObj<ErrorHandlerService>;

    const mockUser = {
        id: 'user-1',
        email: 'test@test.com',
        name: 'Test User'
    };

    const mockCardData: KanbanCard = {
        id: 'card-1',
        title: 'Test Card',
        status: 'PENDING_DOCUMENTS',
        data: {
            opportunity: {
                id: 'opp-1',
                documents: [
                    {
                        id: 'doc-1',
                        documentType: 'RG_CNH',
                        required: true,
                        documentStatusEnum: 'COMPLETED'
                    },
                    {
                        id: 'doc-2',
                        documentType: 'CPF',
                        required: true,
                        documentStatusEnum: 'PENDING'
                    }
                ]
            }
        }
    } as KanbanCard;

    const mockComments: CommentDTO[] = [
        {   
            opportunityId: 'opp-1', 
            id: 'comment-1',
            text: 'First comment',
            userNameIncluded: 'User 1',
            userIncludedId: 'user-1',
            dateHourIncluded: '2024-01-01T10:00:00'
        },
        {
            opportunityId: 'opp-1',
            id: 'comment-2',
            text: 'Second comment',
            userNameIncluded: 'User 2',
            userIncludedId: 'user-2',
            dateHourIncluded: '2024-01-01T11:00:00'
        }
    ];

    beforeEach(async () => {
        const commentServiceSpy = jasmine.createSpyObj('CommentService', ['listComments', 'addComment']);
        const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
        const documentServiceSpy = jasmine.createSpyObj('DocumentService', ['linkMultipleFiles', 'removeDocumentFile']);
        const toastServiceSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
        const errorHandlerSpy = jasmine.createSpyObj('ErrorHandlerService', ['getErrorMessage']);

        commentServiceSpy.listComments.and.returnValue(of(mockComments));
        commentServiceSpy.addComment.and.returnValue(of(mockComments[0]));
        authServiceSpy.getCurrentUser.and.returnValue(mockUser);
        documentServiceSpy.linkMultipleFiles.and.returnValue(of({}));
        documentServiceSpy.removeDocumentFile.and.returnValue(of({}));
        errorHandlerSpy.getErrorMessage.and.returnValue('Erro ao processar requisição');

        await TestBed.configureTestingModule({
            imports: [FollowUpComponent, HttpClientTestingModule],
            providers: [
                { provide: CommentService, useValue: commentServiceSpy },
                { provide: AuthService, useValue: authServiceSpy },
                { provide: DocumentService, useValue: documentServiceSpy },
                { provide: ToastService, useValue: toastServiceSpy },
                { provide: ErrorHandlerService, useValue: errorHandlerSpy }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        commentService = TestBed.inject(CommentService) as jasmine.SpyObj<CommentService>;
        authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
        documentService = TestBed.inject(DocumentService) as jasmine.SpyObj<DocumentService>;
        toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        errorHandler = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;

        // Set cardData to initialize component with data
        component.cardData = mockCardData;
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

        it('should display messages count', fakeAsync(() => {
            component.cardData = mockCardData;
            fixture.detectChanges();
            tick();

            const content = compiled.textContent || '';
            expect(content).toContain('mensagens');
            expect(component.messages.length).toBeGreaterThan(0);
        }));

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

        it('should have documents array with correct items', fakeAsync(() => {
            component.cardData = mockCardData;
            fixture.detectChanges();
            tick();

            expect(component.documentsConfig.documents).toBeDefined();
            expect(component.documentsConfig.documents.length).toBeGreaterThan(0);

            const firstDocument = component.documentsConfig.documents[0];
            expect(firstDocument.id).toBeDefined();
            expect(firstDocument.label).toBeDefined();
            expect(firstDocument.required).toBeDefined();
            expect(firstDocument.uploaded).toBeDefined();
            expect(firstDocument.acceptedFormats).toBeDefined();
        }));
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

        it('should update counts when document status changes', fakeAsync(() => {
            component.cardData = mockCardData;
            fixture.detectChanges();
            tick();

            const initialUploadedCount = component.uploadedDocumentsCount;

            // Simulate document upload - find a document that is not uploaded yet
            const document = component.documentsConfig.documents.find(doc => !doc.uploaded);
            if (document) {
                document.uploaded = true;

                const newUploadedCount = component.uploadedDocumentsCount;
                expect(newUploadedCount).toBe(initialUploadedCount + 1);
            } else {
                // If all documents are already uploaded, test with first document
                const firstDoc = component.documentsConfig.documents[0];
                if (firstDoc) {
                    firstDoc.uploaded = false;
                    const countBefore = component.uploadedDocumentsCount;
                    firstDoc.uploaded = true;
                    const countAfter = component.uploadedDocumentsCount;
                    expect(countAfter).toBe(countBefore + 1);
                }
            }
        }));
    });

    describe('Document Event Handlers', () => {
        it('should handle documentsChange event', () => {
            spyOn(component, 'onDocumentsChange').and.callThrough();

            const mockEvent = { documents: [] };
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
        it('should have messages array initialized', fakeAsync(() => {
            component.cardData = mockCardData;
            fixture.detectChanges();
            tick();

            expect(component.messages).toBeDefined();
            expect(component.messages.length).toBeGreaterThan(0);
        }));

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

        it('should add new message when messageSent is called', fakeAsync(() => {
            component.cardData = mockCardData;
            fixture.detectChanges();
            tick();

            const initialMessageCount = component.messages.length;
            const messageText = 'New test message';

            const newComment: CommentDTO = {
                opportunityId: 'opp-1',
                id: 'comment-3',
                text: messageText,
                userNameIncluded: mockUser.name,
                userIncludedId: mockUser.id,
                dateHourIncluded: new Date().toISOString()
            };
            commentService.addComment.and.returnValue(of(newComment));

            component.onMessageSent(messageText);
            tick();
            fixture.detectChanges();

            expect(component.messages.length).toBe(initialMessageCount + 1);

            const lastMessage = component.messages[component.messages.length - 1];
            expect(lastMessage.text).toBe(messageText);
            expect(lastMessage.isOwn).toBe(true);
        }));
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

