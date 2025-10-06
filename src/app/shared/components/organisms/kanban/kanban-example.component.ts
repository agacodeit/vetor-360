import { Component } from '@angular/core';
import { KanbanComponent, KanbanColumn, KanbanCard } from './kanban.component';

@Component({
    selector: 'ds-kanban-example',
    standalone: true,
    imports: [KanbanComponent],
    template: `
    <div class="kanban-example">
      <h1>Kanban Board Example</h1>
      <ds-kanban
        [columns]="columns"
        [allowAddCards]="true"
        [allowAddColumns]="true"
        [allowDeleteColumns]="true"
        [allowEditColumns]="true"
        [showCardCount]="true"
        [maxColumns]="10"
        (cardMoved)="onCardMoved($event)"
        (cardAdded)="onCardAdded($event)"
        (cardRemoved)="onCardRemoved($event)"
        (columnAdded)="onColumnAdded($event)"
        (columnRemoved)="onColumnRemoved($event)"
        (columnRenamed)="onColumnRenamed($event)">
      </ds-kanban>
    </div>
  `,
    styles: [`
    .kanban-example {
      padding: 20px;
      height: 100vh;
    }
    
    h1 {
      margin-bottom: 20px;
      color: var(--primary-dark);
    }
  `]
})
export class KanbanExampleComponent {
    columns: KanbanColumn[] = [
        {
            id: 'todo',
            title: 'To Do',
            cards: [
                {
                    id: '1',
                    title: 'Design new feature',
                    description: 'Create wireframes and mockups for the new user interface',
                    priority: 'high',
                    client: 'John Doe',
                    dueDate: new Date('2024-02-15'),
                    tags: ['design', 'ui/ux']
                },
                {
                    id: '2',
                    title: 'Research competitors',
                    description: 'Analyze competitor products and market trends',
                    priority: 'medium',
                    client: 'Jane Smith',
                    dueDate: new Date('2024-02-20'),
                    tags: ['research', 'analysis']
                }
            ]
        },
        {
            id: 'in-progress',
            title: 'In Progress',
            cards: [
                {
                    id: '3',
                    title: 'Implement authentication',
                    description: 'Build login and registration functionality',
                    priority: 'high',
                    client: 'Mike Johnson',
                    dueDate: new Date('2024-02-10'),
                    tags: ['development', 'backend']
                }
            ]
        },
        {
            id: 'done',
            title: 'Done',
            cards: [
                {
                    id: '4',
                    title: 'Setup project structure',
                    description: 'Initialize Angular project with design system',
                    priority: 'low',
                    client: 'Sarah Wilson',
                    dueDate: new Date('2024-01-30'),
                    tags: ['setup', 'configuration']
                }
            ]
        }
    ];

    onCardMoved(event: any) {
        console.log('Card moved:', event);
    }

    onCardAdded(event: any) {
        console.log('Card added:', event);
    }

    onCardRemoved(event: any) {
        console.log('Card removed:', event);
    }

    onColumnAdded(event: any) {
        console.log('Column added:', event);
    }

    onColumnRemoved(event: any) {
        console.log('Column removed:', event);
    }

    onColumnRenamed(event: any) {
        console.log('Column renamed:', event);
    }
}
