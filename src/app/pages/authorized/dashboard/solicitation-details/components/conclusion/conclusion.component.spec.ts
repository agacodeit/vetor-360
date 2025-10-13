import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConclusionComponent } from './conclusion.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('ConclusionComponent', () => {
    let component: ConclusionComponent;
    let fixture: ComponentFixture<ConclusionComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ConclusionComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ConclusionComponent);
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
            const section = compiled.querySelector('.conclusion');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.conclusion');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Conclusão" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Conclusão');
        });

        it('should render "Pontos fortes" section', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Pontos fortes');
        });

        it('should render "Pontos de atenção" section', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Pontos de atenção');
        });

        it('should render "Recomendação preliminar" section', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Recomendação preliminar');
        });

        it('should display all strong points', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Faturamento recorrente e crescente');
            expect(content).toContain('Documentação regular e completa');
            expect(content).toContain('Score de crédito elevado');
            expect(content).toContain('Setor em expansão (tecnologia SaaS)');
        });

        it('should display all attention points', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Endividamento em capital de giro');
            expect(content).toContain('Dependência alta de 3 grandes clientes');
        });

        it('should display recommendation', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Cliente em Potencial (Baixo risco de crédito)');
        });

        it('should have 3 conclusion sections', () => {
            const sections = compiled.querySelectorAll('.conclusion__section');
            expect(sections.length).toBe(3);
        });

        it('should have lists for points', () => {
            const lists = compiled.querySelectorAll('.conclusion__list');
            expect(lists.length).toBe(2); // Pontos fortes e Pontos de atenção
        });
    });

    describe('Integration Tests', () => {
        it('should display complete conclusion information', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Conclusão');
            expect(content).toContain('Pontos fortes');
            expect(content).toContain('Pontos de atenção');
            expect(content).toContain('Recomendação preliminar');
            expect(content).toContain('Faturamento recorrente e crescente');
            expect(content).toContain('Cliente em Potencial');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.conclusion');
            const content = compiled.querySelector('.conclusion__content');
            const sections = compiled.querySelectorAll('.conclusion__section');

            expect(section).toBeTruthy();
            expect(content).toBeTruthy();
            expect(sections.length).toBe(3);
        });

        it('should display all items in lists', () => {
            const lists = compiled.querySelectorAll('.conclusion__list');
            const firstList = lists[0];
            const secondList = lists[1];

            const firstListItems = firstList.querySelectorAll('li');
            const secondListItems = secondList.querySelectorAll('li');

            expect(firstListItems.length).toBe(4); // Pontos fortes
            expect(secondListItems.length).toBe(2); // Pontos de atenção
        });
    });
});

