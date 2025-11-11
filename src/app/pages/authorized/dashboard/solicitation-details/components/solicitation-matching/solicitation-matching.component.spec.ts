import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SolicitationMatchingComponent } from './solicitation-matching.component';
import { MOCK_KANBAN_CARD } from '../../../../../../shared/__mocks__';

describe('SolicitationMatchingComponent', () => {
    let component: SolicitationMatchingComponent;
    let fixture: ComponentFixture<SolicitationMatchingComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [SolicitationMatchingComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(SolicitationMatchingComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should render matching title', () => {
        const title = compiled.querySelector('.title-semibold');
        expect(title?.textContent?.trim()).toBe('Matching');
    });

    it('should render four analysis lines by default', () => {
        const paragraphs = compiled.querySelectorAll('.solicitation-matching__content p');
        expect(paragraphs.length).toBe(4);
    });

    it('should adapt analysis when cardData is provided', () => {
        component.cardData = MOCK_KANBAN_CARD;
        fixture.detectChanges();

        const content = compiled.textContent || '';
        expect(content).toContain(MOCK_KANBAN_CARD.title);
        expect(content.toLowerCase()).toContain('está atualmente');
    });
});

