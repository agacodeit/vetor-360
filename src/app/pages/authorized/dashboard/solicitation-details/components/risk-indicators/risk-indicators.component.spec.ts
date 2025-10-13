import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskIndicatorsComponent } from './risk-indicators.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('RiskIndicatorsComponent', () => {
    let component: RiskIndicatorsComponent;
    let fixture: ComponentFixture<RiskIndicatorsComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RiskIndicatorsComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RiskIndicatorsComponent);
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
            const section = compiled.querySelector('.risk-indicators');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.risk-indicators');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Indicadores de risco" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Indicadores de risco');
        });

        it('should display credit score', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Pontuação de Crédito (Serasa/Sci)');
            expect(content).toContain('830/1000');
        });

        it('should display credit risk', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Risco de Crédito');
            expect(content).toContain('Baixo');
        });

        it('should display default history', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Histórico de Inadimplência');
            expect(content).toContain('Nenhum registro nos últimos 5 anos');
        });

        it('should display banking relationship', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Relacionamento Bancário:');
            expect(content).toContain('Cliente há 7 anos, sem atrasos relevantes');
        });

        it('should have 2-column grid for data', () => {
            const dataGrid = compiled.querySelector('.risk-indicators__data');
            expect(dataGrid?.classList.contains('d-grid')).toBe(true);
            expect(dataGrid?.classList.contains('columns-2')).toBe(true);
        });

        it('should have labels section with correct structure', () => {
            const labels = compiled.querySelector('.risk-indicators__labels');
            expect(labels).toBeTruthy();
            expect(labels?.classList.contains('d-flex')).toBe(true);
            expect(labels?.classList.contains('flex-column')).toBe(true);
        });

        it('should have values section with correct structure', () => {
            const values = compiled.querySelector('.risk-indicators__values');
            expect(values).toBeTruthy();
            expect(values?.classList.contains('d-flex')).toBe(true);
            expect(values?.classList.contains('flex-column')).toBe(true);
        });
    });

    describe('Data Fields', () => {
        it('should display all risk indicator labels', () => {
            const labelBlocks = compiled.querySelectorAll('.risk-indicators__labels .risk-indicators__block');
            expect(labelBlocks.length).toBe(4);
        });

        it('should display all risk indicator values', () => {
            const valueBlocks = compiled.querySelectorAll('.risk-indicators__values .risk-indicators__block');
            expect(valueBlocks.length).toBe(4);
        });

        it('should have matching number of labels and values', () => {
            const labelBlocks = compiled.querySelectorAll('.risk-indicators__labels .risk-indicators__block');
            const valueBlocks = compiled.querySelectorAll('.risk-indicators__values .risk-indicators__block');
            expect(labelBlocks.length).toBe(valueBlocks.length);
        });
    });

    describe('Integration Tests', () => {
        it('should display complete risk indicators information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Indicadores de risco');
            expect(content).toContain('Pontuação de Crédito');
            expect(content).toContain('830/1000');
            expect(content).toContain('Risco de Crédito');
            expect(content).toContain('Baixo');
            expect(content).toContain('Histórico de Inadimplência');
            expect(content).toContain('Nenhum registro nos últimos 5 anos');
            expect(content).toContain('Relacionamento Bancário');
            expect(content).toContain('Cliente há 7 anos');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.risk-indicators');
            const data = compiled.querySelector('.risk-indicators__data');
            const labels = compiled.querySelector('.risk-indicators__labels');
            const values = compiled.querySelector('.risk-indicators__values');

            expect(section).toBeTruthy();
            expect(data).toBeTruthy();
            expect(labels).toBeTruthy();
            expect(values).toBeTruthy();
        });

        it('should display all indicator values correctly', () => {
            const allValues = [
                '830/1000',
                'Baixo',
                'Nenhum registro nos últimos 5 anos',
                'Cliente há 7 anos'
            ];

            const content = compiled.textContent || '';
            allValues.forEach(value => {
                expect(content).toContain(value);
            });
        });
    });
});

