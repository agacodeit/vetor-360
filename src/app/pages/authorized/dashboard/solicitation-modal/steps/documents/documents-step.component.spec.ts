import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentItem, DocumentsStepComponent } from './documents-step.component';

describe('DocumentsStepComponent', () => {
    let component: DocumentsStepComponent;
    let fixture: ComponentFixture<DocumentsStepComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentsStepComponent]
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

        it('should initialize documentsForm', () => {
            expect(component.documentsForm).toBeDefined();
        });

        it('should initialize with 3 required documents', () => {
            expect(component.requiredDocuments.length).toBe(3);
        });

        it('should have accordion items configured', () => {
            expect(component.accordionItems.length).toBe(1);
            expect(component.accordionItems[0].id).toBe('doc-required');
            expect(component.accordionItems[0].title).toBe('Documentos Obrigatórios');
            expect(component.accordionItems[0].expanded).toBe(true);
        });

        it('should emit initial form validity on ngOnInit', () => {
            spyOn(component.formValid, 'emit');

            component.ngOnInit();

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('Required Documents Configuration', () => {
        it('should have RG or CNH document', () => {
            const doc = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('RG ou CNH - Documento de identidade');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
            expect(doc?.acceptedFormats).toBe('.pdf,.jpg,.jpeg,.png');
        });

        it('should have CPF document', () => {
            const doc = component.requiredDocuments.find(d => d.id === 'cpf');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('CPF - Cadastro de Pessoa Física');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
        });

        it('should have proof of residence document', () => {
            const doc = component.requiredDocuments.find(d => d.id === 'comprovante-residencia');
            expect(doc).toBeDefined();
            expect(doc?.label).toBe('Comprovante de Residência (últimos 3 meses)');
            expect(doc?.required).toBe(true);
            expect(doc?.uploaded).toBe(false);
        });

        it('should initialize all documents as not uploaded', () => {
            component.requiredDocuments.forEach(doc => {
                expect(doc.uploaded).toBe(false);
                expect(doc.file).toBeUndefined();
            });
        });
    });

    describe('Form Controls Initialization', () => {
        it('should create form control for each required document', () => {
            expect(component.documentsForm.get('rg-cnh')).toBeDefined();
            expect(component.documentsForm.get('cpf')).toBeDefined();
            expect(component.documentsForm.get('comprovante-residencia')).toBeDefined();
        });

        it('should initialize all checkboxes as false', () => {
            expect(component.documentsForm.get('rg-cnh')?.value).toBe(false);
            expect(component.documentsForm.get('cpf')?.value).toBe(false);
            expect(component.documentsForm.get('comprovante-residencia')?.value).toBe(false);
        });
    });

    describe('File Upload', () => {
        it('should handle file selection', () => {
            const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
            const event = {
                target: {
                    files: [mockFile]
                }
            } as any;

            component.onFileSelected(event, 'rg-cnh');

            const doc = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(doc?.file).toBe(mockFile);
            expect(doc?.uploaded).toBe(true);
            expect(component.documentsForm.get('rg-cnh')?.value).toBe(true);
        });

        it('should not change document if no file is selected', () => {
            const event = {
                target: {
                    files: []
                }
            } as any;

            component.onFileSelected(event, 'rg-cnh');

            const doc = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(doc?.file).toBeUndefined();
            expect(doc?.uploaded).toBe(false);
        });

        it('should handle file selection for different documents', () => {
            const mockFile1 = new File(['content1'], 'rg.pdf', { type: 'application/pdf' });
            const mockFile2 = new File(['content2'], 'cpf.jpg', { type: 'image/jpeg' });

            const event1 = { target: { files: [mockFile1] } } as any;
            const event2 = { target: { files: [mockFile2] } } as any;

            component.onFileSelected(event1, 'rg-cnh');
            component.onFileSelected(event2, 'cpf');

            const doc1 = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            const doc2 = component.requiredDocuments.find(d => d.id === 'cpf');

            expect(doc1?.file?.name).toBe('rg.pdf');
            expect(doc2?.file?.name).toBe('cpf.jpg');
        });
    });

    describe('Get File Name', () => {
        it('should return "Selecionar" when no file is uploaded', () => {
            const fileName = component.getFileName('rg-cnh');
            expect(fileName).toBe('Selecionar');
        });

        it('should return file name when file is uploaded', () => {
            const mockFile = new File(['content'], 'my-document.pdf', { type: 'application/pdf' });
            const event = { target: { files: [mockFile] } } as any;

            component.onFileSelected(event, 'rg-cnh');

            const fileName = component.getFileName('rg-cnh');
            expect(fileName).toBe('my-document.pdf');
        });
    });

    describe('Remove Document', () => {
        it('should remove uploaded document', () => {
            const mockFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
            const event = { target: { files: [mockFile] } } as any;

            component.onFileSelected(event, 'rg-cnh');

            const docBefore = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(docBefore?.uploaded).toBe(true);

            component.removeDocument('rg-cnh');

            const docAfter = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(docAfter?.file).toBeUndefined();
            expect(docAfter?.uploaded).toBe(false);
            expect(component.documentsForm.get('rg-cnh')?.value).toBe(false);
        });

        it('should handle removing non-existent document gracefully', () => {
            expect(() => component.removeDocument('non-existent')).not.toThrow();
        });

        it('should remove multiple documents independently', () => {
            const mockFile1 = new File(['content1'], 'file1.pdf', { type: 'application/pdf' });
            const mockFile2 = new File(['content2'], 'file2.pdf', { type: 'application/pdf' });

            component.onFileSelected({ target: { files: [mockFile1] } } as any, 'rg-cnh');
            component.onFileSelected({ target: { files: [mockFile2] } } as any, 'cpf');

            component.removeDocument('rg-cnh');

            const doc1 = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            const doc2 = component.requiredDocuments.find(d => d.id === 'cpf');

            expect(doc1?.uploaded).toBe(false);
            expect(doc2?.uploaded).toBe(true);
        });
    });

    describe('Form Data Change Events', () => {
        it('should emit formDataChange when checkbox changes', (done) => {
            component.formDataChange.subscribe((data) => {
                expect(data.checkboxes['rg-cnh']).toBe(true);
                expect(data.documents).toBeDefined();
                done();
            });

            component.documentsForm.patchValue({ 'rg-cnh': true });
        });

        it('should emit formValid when form changes', () => {
            spyOn(component.formValid, 'emit');

            component.documentsForm.patchValue({ 'rg-cnh': true });

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });

        it('should update document uploaded status when form changes', () => {
            component.documentsForm.patchValue({
                'rg-cnh': true,
                'cpf': true
            });

            const doc1 = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            const doc2 = component.requiredDocuments.find(d => d.id === 'cpf');

            expect(doc1?.uploaded).toBe(true);
            expect(doc2?.uploaded).toBe(true);
        });
    });

    describe('Form Data Input', () => {
        it('should patch form with input checkboxes on ngOnInit', () => {
            component.formData = {
                checkboxes: {
                    'rg-cnh': true,
                    'cpf': true
                }
            };

            component.ngOnInit();

            expect(component.documentsForm.get('rg-cnh')?.value).toBe(true);
            expect(component.documentsForm.get('cpf')?.value).toBe(true);
        });

        it('should restore documents data on ngOnInit', () => {
            const mockFile = new File(['content'], 'saved.pdf', { type: 'application/pdf' });
            const savedDocuments: DocumentItem[] = [
                {
                    id: 'rg-cnh',
                    label: 'RG ou CNH',
                    required: true,
                    uploaded: true,
                    file: mockFile,
                    acceptedFormats: '.pdf'
                }
            ];

            component.formData = {
                documents: savedDocuments
            };

            component.ngOnInit();

            const doc = component.requiredDocuments.find(d => d.id === 'rg-cnh');
            expect(doc?.file).toBe(mockFile);
            expect(doc?.uploaded).toBe(true);
        });

        it('should handle empty formData on ngOnInit', () => {
            component.formData = {};

            expect(() => component.ngOnInit()).not.toThrow();
        });

        it('should not emit formDataChange when patching with emitEvent: false', () => {
            spyOn(component.formDataChange, 'emit');

            component.formData = {
                checkboxes: { 'rg-cnh': true }
            };

            component.ngOnInit();

            expect(component.formDataChange.emit).not.toHaveBeenCalled();
        });
    });

    describe('Accordion Integration', () => {
        it('should call onAccordionItemToggled without errors', () => {
            const item = component.accordionItems[0];

            expect(() => component.onAccordionItemToggled(item)).not.toThrow();
        });
    });

    describe('Template Rendering', () => {
        it('should render form element', () => {
            const form = compiled.querySelector('form');
            expect(form).toBeTruthy();
        });

        it('should render accordion component', () => {
            const accordion = compiled.querySelector('ds-accordion');
            expect(accordion).toBeTruthy();
        });

        it('should render checkboxes for all required documents', () => {
            const checkboxes = compiled.querySelectorAll('ds-checkbox');
            expect(checkboxes.length).toBe(3);
        });
    });

    describe('Integration Tests', () => {
        it('should complete full document upload flow', () => {
            const mockFile1 = new File(['content1'], 'rg.pdf', { type: 'application/pdf' });
            const mockFile2 = new File(['content2'], 'cpf.pdf', { type: 'application/pdf' });
            const mockFile3 = new File(['content3'], 'residencia.pdf', { type: 'application/pdf' });

            component.onFileSelected({ target: { files: [mockFile1] } } as any, 'rg-cnh');
            component.onFileSelected({ target: { files: [mockFile2] } } as any, 'cpf');
            component.onFileSelected({ target: { files: [mockFile3] } } as any, 'comprovante-residencia');

            expect(component.getFileName('rg-cnh')).toBe('rg.pdf');
            expect(component.getFileName('cpf')).toBe('cpf.pdf');
            expect(component.getFileName('comprovante-residencia')).toBe('residencia.pdf');

            const allUploaded = component.requiredDocuments.every(doc => doc.uploaded);
            expect(allUploaded).toBe(true);
        });

        it('should allow removing and re-uploading documents', () => {
            const mockFile1 = new File(['content1'], 'first.pdf', { type: 'application/pdf' });
            const mockFile2 = new File(['content2'], 'second.pdf', { type: 'application/pdf' });

            component.onFileSelected({ target: { files: [mockFile1] } } as any, 'rg-cnh');
            expect(component.getFileName('rg-cnh')).toBe('first.pdf');

            component.removeDocument('rg-cnh');
            expect(component.getFileName('rg-cnh')).toBe('Selecionar');

            component.onFileSelected({ target: { files: [mockFile2] } } as any, 'rg-cnh');
            expect(component.getFileName('rg-cnh')).toBe('second.pdf');
        });
    });
});

