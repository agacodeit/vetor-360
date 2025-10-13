import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDataComponent } from './client-data.component';
import { KanbanCard } from '../../../../../../shared';

describe('ClientDataComponent', () => {
    let component: ClientDataComponent;
    let fixture: ComponentFixture<ClientDataComponent>;
    let compiled: HTMLElement;

    const mockCardData: KanbanCard = {
        id: '1',
        title: 'Test Solicitation',
        status: 'in-progress',
        client: 'Tech Company LTDA',
        cnpj: '12.345.678/0001-90',
        dueDate: new Date('2024-12-31T00:00:00')
    };

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ClientDataComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(ClientDataComponent);
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
            component.cardData = mockCardData;
            fixture.detectChanges();

            expect(component.cardData).toEqual(mockCardData);
        });

        it('should handle null cardData', () => {
            component.cardData = null;
            fixture.detectChanges();

            expect(component.cardData).toBeNull();
        });

        it('should update when cardData changes', () => {
            const newData = { ...mockCardData, client: 'New Client' };

            component.cardData = newData;
            fixture.detectChanges();

            expect(component.cardData?.client).toBe('New Client');
        });
    });

    describe('Template Rendering', () => {
        it('should render section element', () => {
            const section = compiled.querySelector('.client-data');
            expect(section).toBeTruthy();
        });

        it('should have grid layout with 2 columns', () => {
            const section = compiled.querySelector('.client-data');
            expect(section?.classList.contains('columns-2')).toBe(true);
        });

        it('should render "Cliente" title', () => {
            const title = compiled.querySelector('.title-semibold');
            expect(title?.textContent?.trim()).toBe('Cliente');
        });

        it('should display client name when cardData is provided', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            expect(content).toContain('Tech Company LTDA');
        });

        it('should display CNPJ when cardData is provided', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            expect(content).toContain('12.345.678/0001-90');
        });

        it('should display formatted date when cardData is provided', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            expect(content).toContain('Aberta em');
        });

        it('should render address section', () => {
            const address = compiled.querySelector('.client-data__address');
            expect(address).toBeTruthy();
        });

        it('should display address text', () => {
            const address = compiled.querySelector('.client-data__address');
            expect(address?.textContent).toContain('Alameda Afonso Schmidt');
        });

        it('should render "Rating" section', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Rating');
        });

        it('should display rating value "B"', () => {
            const rating = compiled.querySelector('.client-data__rating');
            expect(rating?.textContent?.trim()).toBe('B');
        });

        it('should display rating description', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Cliente com alguns pontos de atenção');
        });

        it('should have correct CSS classes', () => {
            const info = compiled.querySelector('.client-data__info');
            const data = compiled.querySelector('.client-data__data');
            const details = compiled.querySelector('.client-data__details');
            const rating = compiled.querySelector('.client-data__rating');

            expect(info).toBeTruthy();
            expect(data).toBeTruthy();
            expect(details).toBeTruthy();
            expect(rating).toBeTruthy();
        });
    });

    describe('Date Pipe Integration', () => {
        it('should format date using Angular date pipe', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';
            // The date should be formatted as dd/MM/yyyy
            expect(content).toMatch(/Aberta em \d{2}\/\d{2}\/\d{4}/);
        });

        it('should handle null dueDate gracefully', () => {
            component.cardData = { ...mockCardData, dueDate: undefined };
            fixture.detectChanges();

            expect(() => fixture.detectChanges()).not.toThrow();
        });
    });

    describe('Integration Tests', () => {
        it('should display all client information when cardData is complete', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            const content = compiled.textContent || '';

            expect(content).toContain('Tech Company LTDA');
            expect(content).toContain('12.345.678/0001-90');
            expect(content).toContain('Aberta em');
            expect(content).toContain('Tecnologia');
            expect(content).toContain('Rating');
            expect(content).toContain('B');
        });

        it('should update display when cardData changes', () => {
            component.cardData = mockCardData;
            fixture.detectChanges();

            let content = compiled.textContent || '';
            expect(content).toContain('Tech Company LTDA');

            component.cardData = { ...mockCardData, client: 'Updated Company' };
            fixture.detectChanges();

            content = compiled.textContent || '';
            expect(content).toContain('Updated Company');
        });

        it('should have rating section with correct structure', () => {
            const ratingWrapper = compiled.querySelector('.client-data__rating-wrapper');
            const ratingText = compiled.querySelector('.client-data__rating-text');
            const rating = compiled.querySelector('.client-data__rating');

            expect(ratingWrapper).toBeTruthy();
            expect(ratingText).toBeTruthy();
            expect(rating).toBeTruthy();
        });
    });
});

