import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialSummaryComponent } from './financial-summary.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('FinancialSummaryComponent', () => {
    let component: FinancialSummaryComponent;
    let fixture: ComponentFixture<FinancialSummaryComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FinancialSummaryComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FinancialSummaryComponent);
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
            const section = compiled.querySelector('.financial-summary');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.financial-summary');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Resumo financeiro" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Resumo financeiro');
        });

        it('should display annual revenue', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Faturamento anual');
            expect(content).toContain('R$5.000.000,00');
        });

        it('should display monthly cash flow', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Fluxo de caixa mensal');
            expect(content).toContain('Entrada R$ 430.000,00');
            expect(content).toContain('Saída R$ 378.000,00');
        });

        it('should display average account balance', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Saldo médio em conta');
            expect(content).toContain('R$ 150.000,00');
        });

        it('should display commitment index', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Índice de comprometimento');
            expect(content).toContain('18%');
        });

        it('should have 2-column grid for data', () => {
            const dataGrid = compiled.querySelector('.financial-summary__data');
            expect(dataGrid?.classList.contains('d-grid')).toBe(true);
            expect(dataGrid?.classList.contains('columns-2')).toBe(true);
        });

        it('should have labels section with correct structure', () => {
            const labels = compiled.querySelector('.financial-summary__labels');
            expect(labels).toBeTruthy();
            expect(labels?.classList.contains('d-flex')).toBe(true);
            expect(labels?.classList.contains('flex-column')).toBe(true);
        });

        it('should have values section with correct structure', () => {
            const values = compiled.querySelector('.financial-summary__values');
            expect(values).toBeTruthy();
            expect(values?.classList.contains('d-flex')).toBe(true);
            expect(values?.classList.contains('flex-column')).toBe(true);
        });
    });

    describe('Data Fields', () => {
        it('should display all financial summary labels', () => {
            const labelBlocks = compiled.querySelectorAll('.financial-summary__labels .financial-summary__block');
            expect(labelBlocks.length).toBe(4);
        });

        it('should display all financial summary values', () => {
            const valueBlocks = compiled.querySelectorAll('.financial-summary__values .financial-summary__block');
            expect(valueBlocks.length).toBe(4);
        });

        it('should have matching number of labels and values', () => {
            const labelBlocks = compiled.querySelectorAll('.financial-summary__labels .financial-summary__block');
            const valueBlocks = compiled.querySelectorAll('.financial-summary__values .financial-summary__block');
            expect(labelBlocks.length).toBe(valueBlocks.length);
        });
    });

    describe('Integration Tests', () => {
        it('should display complete financial summary information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Resumo financeiro');
            expect(content).toContain('Faturamento anual');
            expect(content).toContain('R$5.000.000,00');
            expect(content).toContain('Fluxo de caixa mensal');
            expect(content).toContain('Entrada R$ 430.000,00');
            expect(content).toContain('Saída R$ 378.000,00');
            expect(content).toContain('Saldo médio em conta');
            expect(content).toContain('R$ 150.000,00');
            expect(content).toContain('Índice de comprometimento');
            expect(content).toContain('18%');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.financial-summary');
            const data = compiled.querySelector('.financial-summary__data');
            const labels = compiled.querySelector('.financial-summary__labels');
            const values = compiled.querySelector('.financial-summary__values');

            expect(section).toBeTruthy();
            expect(data).toBeTruthy();
            expect(labels).toBeTruthy();
            expect(values).toBeTruthy();
        });

        it('should display all financial values correctly', () => {
            const allValues = [
                'R$5.000.000,00',
                'R$ 430.000,00',
                'R$ 378.000,00',
                'R$ 150.000,00',
                '18%'
            ];

            const content = compiled.textContent || '';
            allValues.forEach(value => {
                expect(content).toContain(value);
            });
        });
    });
});

