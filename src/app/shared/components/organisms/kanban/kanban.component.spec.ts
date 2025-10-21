import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanComponent } from './kanban.component';

describe('KanbanComponent', () => {
    let component: KanbanComponent;
    let fixture: ComponentFixture<KanbanComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KanbanComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(KanbanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should get correct priority color', () => {
        expect(component.getPriorityColor('high')).toBe('var(--primary-green)');
        expect(component.getPriorityColor('medium')).toBe('var(--primary-blue)');
        expect(component.getPriorityColor('low')).toBe('var(--stroke)');
        expect(component.getPriorityColor('unknown')).toBe('var(--stroke)');
    });

    it('should always have exactly 5 columns', () => {
        // Arrange - Setup 5 columns with sample data
        const mockColumns = [
            {
                id: 'pending-documents',
                title: 'Pendente de documentos',
                color: '#FF9900',
                cards: []
            },
            {
                id: 'in-analysis',
                title: 'Em análise',
                color: '#FFC800',
                cards: []
            },
            {
                id: 'negotiation',
                title: 'Em negociação',
                color: '#B700FF',
                cards: []
            },
            {
                id: 'waiting-payment',
                title: 'Aguardando pagamento',
                color: '#204FFF',
                cards: []
            },
            {
                id: 'released-resources',
                title: 'Recursos liberados',
                color: '#00B7FF',
                cards: []
            }
        ];

        // Act - Set the columns
        component.columns = mockColumns;
        fixture.detectChanges();

        // Assert - Verify we have exactly 5 columns
        expect(component.columns.length).toBe(5);

        // Verify the columns are rendered in the DOM
        const columnElements = fixture.nativeElement.querySelectorAll('.kanban__column');
        expect(columnElements.length).toBe(5);

        // Verify each column has the expected structure
        mockColumns.forEach((column, index) => {
            expect(columnElements[index]).toBeTruthy();
            const titleElement = columnElements[index].querySelector('.kanban__column-title-text');
            expect(titleElement?.textContent?.trim()).toBe(column.title);
        });
    });
});
