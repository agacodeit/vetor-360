import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RatingComponent } from './rating.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';
import { KanbanCard } from '../../../../../../shared';

// Mock card with documentsSummary for rating "B" (completed/total >= 0.6 and < 0.8)
const mockCardWithRating: KanbanCard = {
    ...MOCK_KANBAN_CARD,
    data: {
        documentsSummary: {
            completed: 6,
            total: 10
        }
    }
};

describe('RatingComponent', () => {
    let component: RatingComponent;
    let fixture: ComponentFixture<RatingComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RatingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(RatingComponent);
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
            const section = compiled.querySelector('.rating');
            expect(section).toBeTruthy();
        });

        it('should have flex layout with gap', () => {
            const section = compiled.querySelector('.rating');
            expect(section?.classList.contains('d-flex')).toBe(true);
            expect(section?.classList.contains('gap-12')).toBe(true);
        });

        it('should render "Rating" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Rating');
        });

        it('should display rating badge with "B"', () => {
            component.cardData = mockCardWithRating;
            fixture.detectChanges();
            
            const badge = compiled.querySelector('.rating__badge');
            expect(badge?.textContent?.trim()).toBe('B');
        });

        it('should display rating description', () => {
            component.cardData = mockCardWithRating;
            fixture.detectChanges();
            
            const content = compiled.textContent || '';
            expect(content).toContain('Boa evolução da documentação.');
        });

        it('should have correct CSS classes for text section', () => {
            const text = compiled.querySelector('.rating__text');
            expect(text).toBeTruthy();
            expect(text?.classList.contains('d-flex')).toBe(true);
            expect(text?.classList.contains('flex-column')).toBe(true);
        });

        it('should have correct CSS classes for badge', () => {
            const badge = compiled.querySelector('.rating__badge');
            expect(badge).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should display complete rating information', () => {
            component.cardData = mockCardWithRating;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Rating');
            expect(content).toContain('B');
            expect(content).toContain('Boa evolução da documentação.');
        });

        it('should maintain structure without cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            const section = compiled.querySelector('.rating');
            const text = compiled.querySelector('.rating__text');
            const badge = compiled.querySelector('.rating__badge');

            expect(section).toBeTruthy();
            expect(text).toBeTruthy();
            expect(badge).toBeTruthy();
        });
    });
});

