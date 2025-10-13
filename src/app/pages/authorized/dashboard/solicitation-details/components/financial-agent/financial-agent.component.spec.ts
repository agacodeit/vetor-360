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

        it('should render "Agente financeiro" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Agente financeiro');
        });

        it('should display bank name', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Banco Inter');
        });

        it('should display FGI value', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('FGI');
            expect(content).toContain('R$ 500.000,00');
        });

        it('should display interest rate', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Taxa');
            expect(content).toContain('1,3% a.m');
        });

        it('should display term period', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Prazo');
            expect(content).toContain('36 meses');
        });

        it('should display grace period', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Carência');
            expect(content).toContain('6 meses');
        });

        it('should display matching date', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Matching 01/02/2021 17:56');
        });

        it('should have 2-column grid for data', () => {
            const dataGrid = compiled.querySelector('.financial-agent__data');
            expect(dataGrid?.classList.contains('d-grid')).toBe(true);
            expect(dataGrid?.classList.contains('columns-2')).toBe(true);
        });

        it('should have info section with correct structure', () => {
            const info = compiled.querySelector('.financial-agent__info');
            expect(info).toBeTruthy();
            expect(info?.classList.contains('d-flex')).toBe(true);
            expect(info?.classList.contains('flex-column')).toBe(true);
        });

        it('should have values section with correct structure', () => {
            const values = compiled.querySelector('.financial-agent__values');
            expect(values).toBeTruthy();
            expect(values?.classList.contains('d-flex')).toBe(true);
            expect(values?.classList.contains('flex-column')).toBe(true);
        });
    });

    describe('Data Fields', () => {
        it('should display all financial agent labels', () => {
            const infoBlocks = compiled.querySelectorAll('.financial-agent__info .financial-agent__block');
            expect(infoBlocks.length).toBe(5);
        });

        it('should display all financial agent values', () => {
            const valueBlocks = compiled.querySelectorAll('.financial-agent__values .financial-agent__block');
            expect(valueBlocks.length).toBe(5);
        });

        it('should have matching number of labels and values', () => {
            const infoBlocks = compiled.querySelectorAll('.financial-agent__info .financial-agent__block');
            const valueBlocks = compiled.querySelectorAll('.financial-agent__values .financial-agent__block');
            expect(infoBlocks.length).toBe(valueBlocks.length);
        });
    });

    describe('Integration Tests', () => {
        it('should display complete financial agent information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Agente financeiro');
            expect(content).toContain('Banco Inter');
            expect(content).toContain('FGI');
            expect(content).toContain('R$ 500.000,00');
            expect(content).toContain('Taxa');
            expect(content).toContain('1,3% a.m');
            expect(content).toContain('Prazo');
            expect(content).toContain('36 meses');
            expect(content).toContain('Carência');
            expect(content).toContain('6 meses');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.financial-agent');
            const data = compiled.querySelector('.financial-agent__data');
            const info = compiled.querySelector('.financial-agent__info');
            const values = compiled.querySelector('.financial-agent__values');

            expect(section).toBeTruthy();
            expect(data).toBeTruthy();
            expect(info).toBeTruthy();
            expect(values).toBeTruthy();
        });
    });
});

