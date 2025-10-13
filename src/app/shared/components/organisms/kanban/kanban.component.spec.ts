import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KanbanComponent, KanbanCard, KanbanColumn } from './kanban.component';
import { CdkDragDrop } from '@angular/cdk/drag-drop';

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

    it('should initialize with default columns if none provided', () => {
        expect(component.columns.length).toBe(3);
        expect(component.columns[0].title).toBe('To Do');
        expect(component.columns[1].title).toBe('In Progress');
        expect(component.columns[2].title).toBe('Done');
    });

    it('should add a new card to a column', () => {
        const initialCardCount = component.columns[0].cards.length;
        component.addCard(component.columns[0].id);

        expect(component.columns[0].cards.length).toBe(initialCardCount + 1);
        expect(component.columns[0].cards[0].title).toBe('New Card');
    });

    it('should remove a card from a column', () => {
        const testCard: KanbanCard = {
            id: '1',
            title: 'Test Card',
            description: 'Test Description',
            status: 'todo'
        };

        component.columns[0].cards.push(testCard);
        const initialCardCount = component.columns[0].cards.length;

        component.removeCard(testCard, component.columns[0].id);

        expect(component.columns[0].cards.length).toBe(initialCardCount - 1);
    });

    it('should add a new column', () => {
        const initialColumnCount = component.columns.length;
        component.newColumnTitle = 'New Column';
        component.addColumn();

        expect(component.columns.length).toBe(initialColumnCount + 1);
        expect(component.columns[component.columns.length - 1].title).toBe('New Column');
    });

    it('should remove a column', () => {
        const initialColumnCount = component.columns.length;
        const columnToRemove = component.columns[0].id;

        component.removeColumn(columnToRemove);

        expect(component.columns.length).toBe(initialColumnCount - 1);
        expect(component.columns.find(col => col.id === columnToRemove)).toBeUndefined();
    });

    it('should not add column if title is empty', () => {
        const initialColumnCount = component.columns.length;
        component.newColumnTitle = '';
        component.addColumn();

        expect(component.columns.length).toBe(initialColumnCount);
    });

    it('should not add column if max columns reached', () => {
        component.maxColumns = 3;
        component.newColumnTitle = 'New Column';
        component.addColumn();

        expect(component.columns.length).toBe(3);
    });

    it('should get correct card count for column', () => {
        component.columns[0].cards = [
            { id: '1', title: 'Card 1', status: 'todo' },
            { id: '2', title: 'Card 2', status: 'todo' }
        ];

        expect(component.getColumnCardCount(component.columns[0])).toBe(2);
    });

    it('should check if column is at max capacity', () => {
        component.columns[0].maxCards = 2;
        component.columns[0].cards = [
            { id: '1', title: 'Card 1', status: 'todo' },
            { id: '2', title: 'Card 2', status: 'todo' }
        ];

        expect(component.isColumnAtMaxCapacity(component.columns[0])).toBe(true);

        component.columns[0].cards.pop();
        expect(component.isColumnAtMaxCapacity(component.columns[0])).toBe(false);
    });

    it('should get correct priority color', () => {
        expect(component.getPriorityColor('high')).toBe('var(--primary-green)');
        expect(component.getPriorityColor('medium')).toBe('var(--primary-blue)');
        expect(component.getPriorityColor('low')).toBe('var(--stroke)');
        expect(component.getPriorityColor('unknown')).toBe('var(--stroke)');
    });
});
