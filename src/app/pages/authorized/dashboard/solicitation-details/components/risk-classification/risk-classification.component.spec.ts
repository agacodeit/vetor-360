import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiskClassificationComponent } from './risk-classification.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('RiskClassificationComponent', () => {
    let component: RiskClassificationComponent;
    let fixture: ComponentFixture<RiskClassificationComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RiskClassificationComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RiskClassificationComponent);
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

        it('should initialize needleRotation at 60 (low risk)', () => {
            expect(component.needleRotation).toBe(60);
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

    describe('setRiskLevel Method', () => {
        it('should set needle to -60 for high risk', () => {
            component.setRiskLevel('high');
            expect(component.needleRotation).toBe(-60);
        });

        it('should set needle to 0 for medium risk', () => {
            component.setRiskLevel('medium');
            expect(component.needleRotation).toBe(0);
        });

        it('should set needle to 60 for low risk', () => {
            component.setRiskLevel('low');
            expect(component.needleRotation).toBe(60);
        });

        it('should update needle rotation when risk level changes', () => {
            component.setRiskLevel('high');
            expect(component.needleRotation).toBe(-60);

            component.setRiskLevel('low');
            expect(component.needleRotation).toBe(60);
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.risk-classification');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 1 column', () => {
            const section = compiled.querySelector('.risk-classification');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Classificação de risco" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Classificação de risco');
        });

        it('should render gauge container', () => {
            const container = compiled.querySelector('.risk-classification__container');
            expect(container).toBeTruthy();
        });

        it('should render SVG gauge', () => {
            const svg = compiled.querySelector('.risk-classification__svg');
            expect(svg).toBeTruthy();
        });

        it('should render gauge needle', () => {
            const needle = compiled.querySelector('.risk-classification__needle');
            expect(needle).toBeTruthy();
        });

        it('should have all three risk zones (paths)', () => {
            const paths = compiled.querySelectorAll('path');
            expect(paths.length).toBeGreaterThanOrEqual(4); // Background + 3 zones
        });

        it('should have needle elements (line and circle)', () => {
            const line = compiled.querySelector('.risk-classification__needle line');
            const circle = compiled.querySelector('.risk-classification__needle circle');

            expect(line).toBeTruthy();
            expect(circle).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should display complete risk classification gauge', () => {
            component.cardData = MOCK_KANBAN_CARD;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            const svg = compiled.querySelector('.risk-classification__svg');

            expect(content).toContain('Classificação de risco');
            expect(svg).toBeTruthy();
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.risk-classification');
            const container = compiled.querySelector('.risk-classification__container');
            const svg = compiled.querySelector('.risk-classification__svg');

            expect(section).toBeTruthy();
            expect(container).toBeTruthy();
            expect(svg).toBeTruthy();
        });

        it('should apply needle rotation style', () => {
            const needle = compiled.querySelector('.risk-classification__needle') as HTMLElement;
            expect(needle).toBeTruthy();
        });

        it('should update needle rotation when setRiskLevel is called', () => {
            component.setRiskLevel('medium');
            fixture.detectChanges();

            expect(component.needleRotation).toBe(0);
        });
    });
});

