import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentationComponent } from './documentation.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('DocumentationComponent', () => {
    let component: DocumentationComponent;
    let fixture: ComponentFixture<DocumentationComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DocumentationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DocumentationComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize cardData as null', () => {
            expect(component.cardData).toBeNull();
        });
    });

    describe('Input Properties', () => {
        it('should accept cardData input', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            expect(component.cardData).toEqual(MOCK_KANBAN_CARD);
        });

        it('should handle null cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            expect(component.cardData).toBeNull();
        });

        it('should update when cardData changes', () => {
            const newData = { ...MOCK_KANBAN_CARD, id: '2' };

            component.cardData = newData;
            fixture.detectChanges();

            expect(component.cardData?.id).toBe('2');
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.documentation');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.documentation');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Documentação e regularidade" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Documentação e regularidade');
        });

        it('should display contract status', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Contrato social');
            expect(content).toContain('OK');
        });

        it('should display CNPJ card status', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Cartão CNPJ');
        });

        it('should display federal certificate', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Certidão Federal (Receita/PGFN)');
            expect(content).toContain('Negativa');
        });

        it('should display state certificate', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Certidão Estadual (ICMS)');
        });

        it('should display municipal certificate', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Certidão Municipal (ISS)');
        });

        it('should display FGTS/INSS status', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Regularidade FGTS/INSS:');
            expect(content).toContain('Regular');
        });

        it('should display balance sheet years', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Balanço Patrimonial/DRE');
            expect(content).toContain('2022 e 2023');
        });

        it('should have 2-column grid for data', () => {
            const dataGrid = compiled.querySelector('.documentation__data');
            expect(dataGrid?.classList.contains('d-grid')).toBe(true);
            expect(dataGrid?.classList.contains('columns-2')).toBe(true);
        });

        it('should have labels section with correct structure', () => {
            const labels = compiled.querySelector('.documentation__labels');
            expect(labels).toBeTruthy();
            expect(labels?.classList.contains('d-flex')).toBe(true);
            expect(labels?.classList.contains('flex-column')).toBe(true);
        });

        it('should have values section with correct structure', () => {
            const values = compiled.querySelector('.documentation__values');
            expect(values).toBeTruthy();
            expect(values?.classList.contains('d-flex')).toBe(true);
            expect(values?.classList.contains('flex-column')).toBe(true);
        });
    });

    describe('Data Fields', () => {
        it('should display all documentation labels', () => {
            const labelBlocks = compiled.querySelectorAll('.documentation__labels .documentation__block');
            expect(labelBlocks.length).toBe(7);
        });

        it('should display all documentation values', () => {
            const valueBlocks = compiled.querySelectorAll('.documentation__values .documentation__block');
            expect(valueBlocks.length).toBe(7);
        });

        it('should have matching number of labels and values', () => {
            const labelBlocks = compiled.querySelectorAll('.documentation__labels .documentation__block');
            const valueBlocks = compiled.querySelectorAll('.documentation__values .documentation__block');
            expect(labelBlocks.length).toBe(valueBlocks.length);
        });
    });

    describe('Integration Tests', () => {
        it('should display complete documentation information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Documentação e regularidade');
            expect(content).toContain('Contrato social');
            expect(content).toContain('Cartão CNPJ');
            expect(content).toContain('Certidão Federal');
            expect(content).toContain('Certidão Estadual');
            expect(content).toContain('Certidão Municipal');
            expect(content).toContain('Regularidade FGTS/INSS');
            expect(content).toContain('Balanço Patrimonial/DRE');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.documentation');
            const data = compiled.querySelector('.documentation__data');
            const labels = compiled.querySelector('.documentation__labels');
            const values = compiled.querySelector('.documentation__values');

            expect(section).toBeTruthy();
            expect(data).toBeTruthy();
            expect(labels).toBeTruthy();
            expect(values).toBeTruthy();
        });

        it('should display all status values correctly', () => {
            const allValues = [
                'OK',
                'Negativa',
                'Regular',
                '2022 e 2023'
            ];

            const content = compiled.textContent || '';
            allValues.forEach(value => {
                expect(content).toContain(value);
            });
        });
    });
});

