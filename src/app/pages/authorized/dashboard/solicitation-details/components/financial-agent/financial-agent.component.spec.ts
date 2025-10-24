import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinancialAgentComponent } from './financial-agent.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('FinancialAgentComponent', () => {
    let component: FinancialAgentComponent;
    let fixture: ComponentFixture<FinancialAgentComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FinancialAgentComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FinancialAgentComponent);
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
            const section = compiled.querySelector('.financial-agent');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.financial-agent');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Agentes Financeiros" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Agentes Financeiros');
        });

        it('should display bank names in table', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Banco Inter');
            expect(content).toContain('Banco do Brasil');
            expect(content).toContain('Itaú');
        });

        it('should display operation values in table', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('R$ 500.000,00');
            expect(content).toContain('R$ 750.000,00');
            expect(content).toContain('R$ 300.000,00');
        });

        it('should display matching dates in table', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('01/02/2021 17:56');
            expect(content).toContain('02/02/2021 14:30');
            expect(content).toContain('03/02/2021 09:15');
        });

        it('should have table structure', () => {
            const table = compiled.querySelector('ds-table');
            expect(table).toBeTruthy();
        });

        it('should have table header with correct columns', () => {
            const headerCells = compiled.querySelectorAll('ds-table-cell');
            expect(headerCells.length).toBeGreaterThanOrEqual(3);
        });

        it('should have table rows for each financial agent', () => {
            const dataRows = compiled.querySelectorAll('ds-table-row');
            expect(dataRows.length).toBeGreaterThanOrEqual(3);
        });
    });

    describe('Data Fields', () => {
        it('should display all financial agent data in table', () => {
            const tableCells = compiled.querySelectorAll('ds-table-cell');
            expect(tableCells.length).toBeGreaterThanOrEqual(9); // 3 agents × 3 columns each
        });

        it('should display all financial agent values in table', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Banco Inter');
            expect(content).toContain('Banco do Brasil');
            expect(content).toContain('Itaú');
        });

    });

    describe('Integration Tests', () => {
        it('should display complete financial agent information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Agentes Financeiros');
            expect(content).toContain('Banco Inter');
            expect(content).toContain('Banco do Brasil');
            expect(content).toContain('Itaú');
            expect(content).toContain('R$ 500.000,00');
            expect(content).toContain('R$ 750.000,00');
            expect(content).toContain('R$ 300.000,00');
            expect(content).toContain('01/02/2021 17:56');
            expect(content).toContain('02/02/2021 14:30');
            expect(content).toContain('03/02/2021 09:15');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.financial-agent');
            const table = compiled.querySelector('ds-table');
            const title = compiled.querySelector('.title-semibold');

            expect(section).toBeTruthy();
            expect(table).toBeTruthy();
            expect(title).toBeTruthy();
        });
    });
});

