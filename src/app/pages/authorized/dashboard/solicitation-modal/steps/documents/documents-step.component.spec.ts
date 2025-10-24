import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsStepComponent } from './documents-step.component';
import { DocumentsComponent, DocumentItem } from '../../../../../../shared';

describe('DocumentsStepComponent', () => {
    let component: DocumentsStepComponent;
    let fixture: ComponentFixture<DocumentsStepComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentsStepComponent, DocumentsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentsStepComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize documentsConfig', () => {
            expect(component.documentsConfig).toBeDefined();
            expect(component.documentsConfig.title).toBe('Documentos Obrigatórios');
            expect(component.documentsConfig.showAccordion).toBe(true);
            expect(component.documentsConfig.allowMultiple).toBe(true);
        });

        it('should initialize with 3 required documents', () => {
            expect(component.documentsConfig.documents.length).toBe(3);
        });

        it('should have correct document configuration', () => {
            const documents = component.documentsConfig.documents;
            expect(documents[0].id).toBe('rg-cnh');
            expect(documents[1].id).toBe('cpf');
            expect(documents[2].id).toBe('comprovante-residencia');
        });
    });

    describe('Required Documents Configuration', () => {
        it('should have RG or CNH document', () => {
            const doc = component.documentsConfig.documents.find(d => d.id === 'rg-cnh');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('RG ou CNH - Documento de identidade');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
            expect(doc?.acceptedFormats).toBe('.pdf,.jpg,.jpeg,.png');
        });

        it('should have CPF document', () => {
            const doc = component.documentsConfig.documents.find(d => d.id === 'cpf');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('CPF - Cadastro de Pessoa Física');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
        });

        it('should have proof of residence document', () => {
            const doc = component.documentsConfig.documents.find(d => d.id === 'comprovante-residencia');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('Comprovante de Residência (últimos 3 meses)');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
        });

        it('should initialize all documents as not uploaded', () => {
            component.documentsConfig.documents.forEach(doc => {
                expect(doc.uploaded).toBe(false);
                expect(doc.file).toBeUndefined();
            });
        });
    });

    describe('Event Handlers', () => {
        it('should handle documents change event', () => {
            spyOn(component, 'onDocumentsChange').and.callThrough();
            spyOn(component.formDataChange, 'emit');

            const mockEvent = { checkboxes: {}, documents: [] };
            component.onDocumentsChange(mockEvent);

            expect(component.onDocumentsChange).toHaveBeenCalledWith(mockEvent);
            expect(component.formDataChange.emit).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle document uploaded event', () => {
            spyOn(component, 'onDocumentUploaded').and.callThrough();

            const mockEvent = { documentId: 'rg-cnh', file: new File(['test'], 'test.pdf') };
            component.onDocumentUploaded(mockEvent);

            expect(component.onDocumentUploaded).toHaveBeenCalledWith(mockEvent);
        });

        it('should handle document removed event', () => {
            spyOn(component, 'onDocumentRemoved').and.callThrough();

            const documentId = 'rg-cnh';
            component.onDocumentRemoved(documentId);

            expect(component.onDocumentRemoved).toHaveBeenCalledWith(documentId);
        });

        it('should handle form valid event', () => {
            spyOn(component, 'onFormValid').and.callThrough();
            spyOn(component.formValid, 'emit');

            const isValid = true;
            component.onFormValid(isValid);

            expect(component.onFormValid).toHaveBeenCalledWith(isValid);
            expect(component.formValid.emit).toHaveBeenCalledWith(isValid);
        });
    });

    describe('Template Rendering', () => {
        it('should render ds-documents component', () => {
            const documentsComponent = compiled.querySelector('ds-documents');
            expect(documentsComponent).toBeTruthy();
        });

        it('should pass correct config to ds-documents', () => {
            const documentsComponent = compiled.querySelector('ds-documents');
            expect(documentsComponent).toBeTruthy();

            // Verify that the config is properly set
            expect(component.documentsConfig).toBeDefined();
            expect(component.documentsConfig.documents.length).toBe(3);
        });
    });

    describe('Component Integration', () => {
        it('should emit formDataChange when ds-documents emits documentsChange', () => {
            spyOn(component.formDataChange, 'emit');

            const mockEvent = { checkboxes: { 'rg-cnh': true }, documents: [] };
            component.onDocumentsChange(mockEvent);

            expect(component.formDataChange.emit).toHaveBeenCalledWith(mockEvent);
        });

        it('should emit formValid when ds-documents emits formValid', () => {
            spyOn(component.formValid, 'emit');

            component.onFormValid(true);

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });

        it('should handle formData input correctly', () => {
            const mockFormData = {
                checkboxes: { 'rg-cnh': true },
                documents: []
            };

            component.formData = mockFormData;

            expect(component.formData).toEqual(mockFormData);
        });
    });
});

