import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DocumentsConfig } from '../../../../../shared';

import { DocumentsStepComponent } from './documents-step.component';

describe('DocumentsStepComponent', () => {
    let component: DocumentsStepComponent;
    let fixture: ComponentFixture<DocumentsStepComponent>;

    const mockDocumentsConfig: DocumentsConfig = {
        documents: [
            {
                id: 'doc1',
                documentType: 'RG_CNH',
                label: 'Documento 1',
                required: true,
                uploaded: false,
                acceptedFormats: '.pdf,.jpg'
            }
        ]
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentsStepComponent, HttpClientTestingModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentsStepComponent);
        component = fixture.componentInstance;
        component.documentsConfig = mockDocumentsConfig;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with required inputs', () => {
            expect(component.documentsConfig).toBeDefined();
            expect(component.documentsConfig).toEqual(mockDocumentsConfig);
        });

        it('should have all required output EventEmitters', () => {
            expect(component.documentsChange).toBeDefined();
            expect(component.documentUploaded).toBeDefined();
            expect(component.documentRemoved).toBeDefined();
            expect(component.formValid).toBeDefined();
        });
    });

    describe('Event Handling Methods', () => {
        describe('onDocumentsChange', () => {
            it('should emit documentsChange event with the provided data', () => {
                spyOn(component.documentsChange, 'emit');
                const mockEvent = { documents: [], isValid: true };

                component.onDocumentsChange(mockEvent);

                expect(component.documentsChange.emit).toHaveBeenCalledWith(mockEvent);
            });

            it('should emit documentsChange event with different data types', () => {
                spyOn(component.documentsChange, 'emit');
                const mockEvent = { documents: ['doc1', 'doc2'], isValid: false };

                component.onDocumentsChange(mockEvent);

                expect(component.documentsChange.emit).toHaveBeenCalledWith(mockEvent);
            });

            it('should emit documentsChange event with null data', () => {
                spyOn(component.documentsChange, 'emit');

                component.onDocumentsChange(null);

                expect(component.documentsChange.emit).toHaveBeenCalledWith(null);
            });

            it('should emit documentsChange event with undefined data', () => {
                spyOn(component.documentsChange, 'emit');

                component.onDocumentsChange(undefined);

                expect(component.documentsChange.emit).toHaveBeenCalledWith(undefined);
            });
        });

        describe('onDocumentUploaded', () => {
            it('should emit documentUploaded event with the provided data', () => {
                spyOn(component.documentUploaded, 'emit');
                const mockEvent = { documentId: 'doc1', file: new File([''], 'test.pdf') };

                component.onDocumentUploaded(mockEvent);

                expect(component.documentUploaded.emit).toHaveBeenCalledWith(mockEvent);
            });

            it('should emit documentUploaded event with different data types', () => {
                spyOn(component.documentUploaded, 'emit');
                const mockEvent = { documentId: 'doc2', fileName: 'document.jpg', size: 1024 };

                component.onDocumentUploaded(mockEvent);

                expect(component.documentUploaded.emit).toHaveBeenCalledWith(mockEvent);
            });

            it('should emit documentUploaded event with null data', () => {
                spyOn(component.documentUploaded, 'emit');

                component.onDocumentUploaded(null);

                expect(component.documentUploaded.emit).toHaveBeenCalledWith(null);
            });
        });

        describe('onDocumentRemoved', () => {
            it('should emit documentRemoved event with the provided documentId', () => {
                spyOn(component.documentRemoved, 'emit');
                const documentId = 'doc1';

                component.onDocumentRemoved(documentId);

                expect(component.documentRemoved.emit).toHaveBeenCalledWith(documentId);
            });

            it('should emit documentRemoved event with different documentId', () => {
                spyOn(component.documentRemoved, 'emit');
                const documentId = 'doc2';

                component.onDocumentRemoved(documentId);

                expect(component.documentRemoved.emit).toHaveBeenCalledWith(documentId);
            });

            it('should emit documentRemoved event with empty string', () => {
                spyOn(component.documentRemoved, 'emit');

                component.onDocumentRemoved('');

                expect(component.documentRemoved.emit).toHaveBeenCalledWith('');
            });

            it('should emit documentRemoved event with null', () => {
                spyOn(component.documentRemoved, 'emit');

                component.onDocumentRemoved(null as any);

                expect(component.documentRemoved.emit).toHaveBeenCalledWith(null as any);
            });
        });

        describe('onFormValid', () => {
            it('should emit formValid event with true', () => {
                spyOn(component.formValid, 'emit');

                component.onFormValid(true);

                expect(component.formValid.emit).toHaveBeenCalledWith(true);
            });

            it('should emit formValid event with false', () => {
                spyOn(component.formValid, 'emit');

                component.onFormValid(false);

                expect(component.formValid.emit).toHaveBeenCalledWith(false);
            });

            it('should emit formValid event multiple times', () => {
                spyOn(component.formValid, 'emit');

                component.onFormValid(true);
                component.onFormValid(false);
                component.onFormValid(true);

                expect(component.formValid.emit).toHaveBeenCalledTimes(3);
                expect(component.formValid.emit).toHaveBeenCalledWith(true);
                expect(component.formValid.emit).toHaveBeenCalledWith(false);
                expect(component.formValid.emit).toHaveBeenCalledWith(true);
            });
        });
    });

    describe('EventEmitter Properties', () => {
        it('should have documentsChange as EventEmitter', () => {
            expect(component.documentsChange).toBeDefined();
            expect(typeof component.documentsChange.emit).toBe('function');
        });

        it('should have documentUploaded as EventEmitter', () => {
            expect(component.documentUploaded).toBeDefined();
            expect(typeof component.documentUploaded.emit).toBe('function');
        });

        it('should have documentRemoved as EventEmitter', () => {
            expect(component.documentRemoved).toBeDefined();
            expect(typeof component.documentRemoved.emit).toBe('function');
        });

        it('should have formValid as EventEmitter', () => {
            expect(component.formValid).toBeDefined();
            expect(typeof component.formValid.emit).toBe('function');
        });
    });

    describe('Input Properties', () => {

        it('should handle documentsConfig with empty documents array', () => {
            const emptyConfig: DocumentsConfig = {
                documents: []
            };

            component.documentsConfig = emptyConfig;

            expect(component.documentsConfig).toEqual(emptyConfig);
            expect(component.documentsConfig.documents).toEqual([]);
        });

        it('should handle documentsConfig with multiple documents', () => {
            const multiDocConfig: DocumentsConfig = {
                documents: [
                    { id: 'doc1', documentType: 'DOC1', label: 'Doc 1', required: true, uploaded: false, acceptedFormats: '.pdf' },
                    { id: 'doc2', documentType: 'DOC2', label: 'Doc 2', required: false, uploaded: false, acceptedFormats: '.jpg' },
                    { id: 'doc3', documentType: 'DOC3', label: 'Doc 3', required: true, uploaded: false, acceptedFormats: '.png' }
                ]
            };

            component.documentsConfig = multiDocConfig;

            expect(component.documentsConfig.documents.length).toBe(3);
            expect(component.documentsConfig.documents[0].id).toBe('doc1');
            expect(component.documentsConfig.documents[1].id).toBe('doc2');
            expect(component.documentsConfig.documents[2].id).toBe('doc3');
        });
    });

    describe('Method Integration', () => {
        it('should handle multiple event emissions in sequence', () => {
            spyOn(component.documentsChange, 'emit');
            spyOn(component.documentUploaded, 'emit');
            spyOn(component.documentRemoved, 'emit');
            spyOn(component.formValid, 'emit');

            const documentsEvent = { documents: ['doc1'], isValid: true };
            const uploadEvent = { documentId: 'doc1', file: new File([''], 'test.pdf') };
            const documentId = 'doc1';

            component.onDocumentsChange(documentsEvent);
            component.onDocumentUploaded(uploadEvent);
            component.onDocumentRemoved(documentId);
            component.onFormValid(true);

            expect(component.documentsChange.emit).toHaveBeenCalledWith(documentsEvent);
            expect(component.documentUploaded.emit).toHaveBeenCalledWith(uploadEvent);
            expect(component.documentRemoved.emit).toHaveBeenCalledWith(documentId);
            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });

        it('should maintain event emitter state across multiple calls', () => {
            spyOn(component.formValid, 'emit');

            component.onFormValid(true);
            component.onFormValid(false);
            component.onFormValid(true);

            expect(component.formValid.emit).toHaveBeenCalledTimes(3);
        });
    });

    describe('Edge Cases', () => {
        it('should handle undefined documentsConfig', () => {
            component.documentsConfig = undefined as any;

            expect(component.documentsConfig).toBeUndefined();
        });

        it('should handle null documentsConfig', () => {
            component.documentsConfig = null as any;

            expect(component.documentsConfig).toBeNull();
        });

        it('should handle complex event data structures', () => {
            spyOn(component.documentsChange, 'emit');
            const complexEvent = {
                documents: [
                    { id: 'doc1', name: 'Document 1', uploaded: true },
                    { id: 'doc2', name: 'Document 2', uploaded: false }
                ],
                isValid: true,
                metadata: { timestamp: Date.now(), userId: 'user123' }
            };

            component.onDocumentsChange(complexEvent);

            expect(component.documentsChange.emit).toHaveBeenCalledWith(complexEvent);
        });

        it('should handle boolean edge cases in onFormValid', () => {
            spyOn(component.formValid, 'emit');

            component.onFormValid(true);
            component.onFormValid(false);
            component.onFormValid(true);

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
            expect(component.formValid.emit).toHaveBeenCalledWith(false);
            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });
    });
});
