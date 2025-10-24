import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FollowUpComponent } from './follow-up.component';

describe('FollowUpComponent', () => {
    let component: FollowUpComponent;
    let fixture: ComponentFixture<FollowUpComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [FollowUpComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(FollowUpComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });
    });

    describe('onOpenVisualization Method', () => {
        it('should toggle isVisualizationOpen when onOpenVisualization is invoked', () => {
            expect(component.isVisualizationOpen).toBe(false);

            component.onOpenVisualization();
            expect(component.isVisualizationOpen).toBe(true);

            component.onOpenVisualization();
            expect(component.isVisualizationOpen).toBe(false);
        });

        it('should not throw error when called', () => {
            expect(() => component.onOpenVisualization()).not.toThrow();
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.follow-up');
            expect(section).toBeTruthy();
        });

        it('should have grid layout', () => {
            const section = compiled.querySelector('.follow-up');
            expect(section?.classList.contains('d-grid')).toBe(true);
            expect(section?.classList.contains('columns-1')).toBe(true);
        });

        it('should render "Follow-up" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent).toContain('Follow-up');
        });

        it('should render "Abrir visualização" button', () => {
            const button = compiled.querySelector('.follow-up__link');
            expect(button).toBeTruthy();
            expect(button?.textContent?.trim()).toBe('Abrir visualização');
        });

        it('should display messages count', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('2 mensagens');
        });

        it('should display documents count', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('6/7 documentos');
        });

        it('should render comment icon', () => {
            const icon = compiled.querySelector('ds-icon[icon="fa-regular fa-comment-dots"]');
            expect(icon).toBeTruthy();
        });

        it('should render folder icon', () => {
            const icon = compiled.querySelector('ds-icon[icon="fa-regular fa-folder"]');
            expect(icon).toBeTruthy();
        });

        it('should have correct CSS classes', () => {
            const content = compiled.querySelector('.follow-up__content');
            const stats = compiled.querySelector('.follow-up__stats');

            expect(content).toBeTruthy();
            expect(stats).toBeTruthy();
        });
    });

    describe('Button Click Event', () => {
        it('should call onOpenVisualization when button is clicked', () => {
            spyOn(component, 'onOpenVisualization');

            const button = compiled.querySelector('.follow-up__link') as HTMLButtonElement;
            button?.click();

            expect(component.onOpenVisualization).toHaveBeenCalled();
        });

        it('should toggle visualization state on button click', () => {
            expect(component.isVisualizationOpen).toBe(false);

            const button = compiled.querySelector('.follow-up__link') as HTMLButtonElement;
            button?.click();

            expect(component.isVisualizationOpen).toBe(true);
        });
    });

    describe('Integration Tests', () => {
        it('should have stats section with proper layout', () => {
            const stats = compiled.querySelector('.follow-up__stats');

            expect(stats?.classList.contains('d-flex')).toBe(true);
            expect(stats?.classList.contains('align-items-center')).toBe(true);
        });

        it('should display both statistics with icons', () => {
            const stats = compiled.querySelectorAll('.follow-up__stats p');

            expect(stats.length).toBe(2);
        });
    });
});

