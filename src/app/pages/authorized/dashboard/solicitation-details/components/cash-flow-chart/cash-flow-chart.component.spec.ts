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

        it('should initialize chartData with 12 months', () => {
            expect(component.chartData).toBeDefined();
            expect(component.chartData.length).toBe(12);
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

    describe('Chart Data', () => {
        it('should have data for all 12 months', () => {
            const monthNames = component.chartData.map(m => m.name);
            expect(monthNames).toEqual(['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']);
        });

        it('should have entry and exit values for each month', () => {
            component.chartData.forEach(month => {
                expect(month.entry).toBeGreaterThan(0);
                expect(month.exit).toBeGreaterThan(0);
            });
        });

        it('should have Y axis values defined', () => {
            expect(component.yAxisValues).toBeDefined();
            expect(component.yAxisValues.length).toBe(6);
        });

        it('should have correct Y axis values', () => {
            expect(component.yAxisValues).toEqual([25000, 20000, 15000, 10000, 5000, 0]);
        });
    });

    describe('getBarHeight Method', () => {
        it('should calculate correct percentage for bar height', () => {
            const height = component.getBarHeight(12500);
            expect(height).toBe(50); // 12500 / 25000 * 100 = 50%
        });

        it('should return 100% for maximum value', () => {
            const height = component.getBarHeight(25000);
            expect(height).toBe(100);
        });

        it('should return 0% for zero value', () => {
            const height = component.getBarHeight(0);
            expect(height).toBe(0);
        });

        it('should handle small values correctly', () => {
            const height = component.getBarHeight(2500);
            expect(height).toBe(10); // 2500 / 25000 * 100 = 10%
        });
    });

    describe('formatYAxisValue Method', () => {
        it('should format values in pt-BR locale', () => {
            const formatted = component.formatYAxisValue(25000);
            expect(formatted).toBe('25.000');
        });

        it('should format zero correctly', () => {
            const formatted = component.formatYAxisValue(0);
            expect(formatted).toBe('0');
        });

        it('should format intermediate values correctly', () => {
            const formatted = component.formatYAxisValue(15000);
            expect(formatted).toBe('15.000');
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

        it('should render Y axis', () => {
            const yAxis = compiled.querySelector('.cash-flow-chart__y-axis');
            expect(yAxis).toBeTruthy();
        });

        it('should render 6 Y axis labels', () => {
            const yLabels = compiled.querySelectorAll('.cash-flow-chart__y-label');
            expect(yLabels.length).toBe(6);
        });

        it('should display formatted Y axis values', () => {
            const yLabels = compiled.querySelectorAll('.cash-flow-chart__y-label');
            expect(yLabels[0].textContent).toBe('25.000');
            expect(yLabels[5].textContent).toBe('0');
        });

        it('should render 12 bar groups (one for each month)', () => {
            const barGroups = compiled.querySelectorAll('.cash-flow-chart__bar-group');
            expect(barGroups.length).toBe(12);
        });

        it('should render month labels', () => {
            const labels = compiled.querySelectorAll('.cash-flow-chart__label');
            expect(labels.length).toBe(12);
            expect(labels[0].textContent).toBe('Jan');
            expect(labels[11].textContent).toBe('Dez');
        });

        it('should render entry and exit bars for each month', () => {
            const entryBars = compiled.querySelectorAll('.cash-flow-chart__bar--entry');
            const exitBars = compiled.querySelectorAll('.cash-flow-chart__bar--exit');

            expect(entryBars.length).toBe(12);
            expect(exitBars.length).toBe(12);
        });

        it('should have correct CSS classes for bars', () => {
            const bars = compiled.querySelectorAll('.cash-flow-chart__bar');
            expect(bars.length).toBe(24); // 12 months * 2 bars each
        });
    });

    describe('Integration Tests', () => {
        it('should display complete cash flow chart', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            expect(content).toContain('Fluxo de caixa mensal');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.cash-flow-chart');
            const container = compiled.querySelector('.cash-flow-chart__container');
            const barGroups = compiled.querySelectorAll('.cash-flow-chart__bar-group');

            expect(section).toBeTruthy();
            expect(container).toBeTruthy();
            expect(barGroups.length).toBe(12);
        });

        it('should display all month names', () => {
            const content = compiled.textContent || '';
            const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

            months.forEach(month => {
                expect(content).toContain(month);
            });
        });

        it('should apply dynamic heights to bars', () => {
            const entryBars = compiled.querySelectorAll('.cash-flow-chart__bar--entry');
            const firstBar = entryBars[0] as HTMLElement;

            expect(firstBar.style.height).toBeTruthy();
        });
    });
});

