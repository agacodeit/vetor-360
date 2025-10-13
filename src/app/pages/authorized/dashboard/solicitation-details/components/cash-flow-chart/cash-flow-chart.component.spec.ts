import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CashFlowChartComponent } from './cash-flow-chart.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('CashFlowChartComponent', () => {
    let component: CashFlowChartComponent;
    let fixture: ComponentFixture<CashFlowChartComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [CashFlowChartComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(CashFlowChartComponent);
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
            const section = compiled.querySelector('.cash-flow-chart');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.cash-flow-chart');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render chart title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Fluxo de caixa mensal (Entradas x Saídas)');
        });

        it('should display chart container', () => {
            const container = compiled.querySelector('.cash-flow-chart__container');
            expect(container).toBeTruthy();
        });

        it('should have placeholder text for chart', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Gráfico de fluxo de caixa mensal');
        });

        it('should have correct CSS classes for container', () => {
            const container = compiled.querySelector('.cash-flow-chart__container');
            expect(container).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should display complete cash flow chart section', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Fluxo de caixa mensal');
            expect(content).toContain('Gráfico de fluxo de caixa mensal');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.cash-flow-chart');
            const container = compiled.querySelector('.cash-flow-chart__container');

            expect(section).toBeTruthy();
            expect(container).toBeTruthy();
        });

        it('should have proper structure for future chart implementation', () => {
            const container = compiled.querySelector('.cash-flow-chart__container');
            expect(container).toBeTruthy();
        });
    });
});

