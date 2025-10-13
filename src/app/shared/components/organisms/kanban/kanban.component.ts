import { Component, Input, Output, EventEmitter, ViewEncapsulation, OnInit, TrackByFunction, ViewChild, ElementRef, HostListener, ContentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray, transferArrayItem, CdkDragMove } from '@angular/cdk/drag-drop';
import { CardComponent } from '../../organisms/card/card.component';
import { ButtonComponent } from '../../atoms/button/button.component';
import { IconComponent } from '../../atoms/icon/icon.component';

export interface KanbanCard {
    id: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    client?: string;
    dueDate?: Date;
    cnpj?: string;
    tags?: string[];
    status: string;
    data?: any;
}

export interface KanbanColumn {
    id: string;
    title: string;
    cards: KanbanCard[];
    color?: string;
    maxCards?: number;
}

@Component({
    selector: 'ds-kanban',
    standalone: true,
    imports: [CommonModule, FormsModule, CdkDrag, CdkDropList, CardComponent, ButtonComponent, IconComponent],
    templateUrl: './kanban.component.html',
    encapsulation: ViewEncapsulation.None
})
export class KanbanComponent implements OnInit {
    @ViewChild('kanbanBoard', { static: false }) kanbanBoard!: ElementRef<HTMLElement>;
    @ContentChild('cardTemplate', { static: false }) cardTemplate!: TemplateRef<any>;

    @Input() columns: KanbanColumn[] = [];
    @Input() allowAddCards: boolean = false;
    @Input() allowAddColumns: boolean = false;
    @Input() allowDeleteColumns: boolean = false;
    @Input() allowEditColumns: boolean = false;
    @Input() showCardCount: boolean = true;
    @Input() maxColumns: number = 10;

    @Output() cardMoved = new EventEmitter<{
        card: KanbanCard;
        fromColumn: string;
        toColumn: string;
        fromIndex: number;
        toIndex: number;
    }>();

    @Output() cardAdded = new EventEmitter<{
        card: KanbanCard;
        columnId: string;
    }>();

    @Output() cardRemoved = new EventEmitter<{
        card: KanbanCard;
        columnId: string;
    }>();

    @Output() columnAdded = new EventEmitter<KanbanColumn>();
    @Output() columnRemoved = new EventEmitter<string>();
    @Output() columnRenamed = new EventEmitter<{ columnId: string; newTitle: string }>();
    @Output() cardClicked = new EventEmitter<{ card: KanbanCard; column: KanbanColumn }>();

    newColumnTitle: string = '';
    isAddingColumn: boolean = false;
    editingColumnId: string | null = null;
    editingColumnTitle: string = '';


    private isDragging: boolean = false;


    private scrollSpeed = 50;
    private scrollZone = 200; // pixels from edge to start scrolling
    private scrollInterval: any = null;

    ngOnInit() {

        if (this.columns.length === 0) {
            this.columns = [
                { id: 'todo', title: 'To Do', cards: [] },
                { id: 'in-progress', title: 'In Progress', cards: [] },
                { id: 'done', title: 'Done', cards: [] }
            ];
        }
    }

    onCardDrop(event: CdkDragDrop<KanbanCard[]>) {

        if (event.previousContainer === event.container) {

            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );


            const card = event.item.data;
            const fromColumn = event.previousContainer.id;
            const toColumn = event.container.id;


            this.cardMoved.emit({
                card,
                fromColumn,
                toColumn,
                fromIndex: event.previousIndex,
                toIndex: event.currentIndex
            });
        }
    }

    addCard(columnId: string) {
        const newCard: KanbanCard = {
            id: this.generateId(),
            title: 'New Card',
            description: 'Click to edit description',
            priority: 'medium',
            status: 'pending-documents'
        };

        const column = this.columns.find(col => col.id === columnId);
        if (column) {
            column.cards.push(newCard);
            this.cardAdded.emit({ card: newCard, columnId });
        }
    }

    removeCard(card: KanbanCard, columnId: string) {
        const column = this.columns.find(col => col.id === columnId);
        if (column) {
            const index = column.cards.findIndex(c => c.id === card.id);
            if (index > -1) {
                column.cards.splice(index, 1);
                this.cardRemoved.emit({ card, columnId });
            }
        }
    }

    addColumn() {
        if (this.newColumnTitle.trim() && this.columns.length < this.maxColumns) {
            const newColumn: KanbanColumn = {
                id: this.generateId(),
                title: this.newColumnTitle.trim(),
                cards: []
            };

            this.columns.push(newColumn);
            this.columnAdded.emit(newColumn);
            this.newColumnTitle = '';
            this.isAddingColumn = false;
        }
    }

    removeColumn(columnId: string) {
        const index = this.columns.findIndex(col => col.id === columnId);
        if (index > -1) {
            this.columns.splice(index, 1);
            this.columnRemoved.emit(columnId);
        }
    }

    startEditingColumn(column: KanbanColumn) {
        this.editingColumnId = column.id;
        this.editingColumnTitle = column.title;
    }

    saveColumnEdit() {
        if (this.editingColumnId && this.editingColumnTitle.trim()) {
            const column = this.columns.find(col => col.id === this.editingColumnId);
            if (column) {
                column.title = this.editingColumnTitle.trim();
                this.columnRenamed.emit({
                    columnId: this.editingColumnId,
                    newTitle: this.editingColumnTitle.trim()
                });
            }
            this.cancelEditingColumn();
        }
    }

    cancelEditingColumn() {
        this.editingColumnId = null;
        this.editingColumnTitle = '';
    }

    getColumnCardCount(column: KanbanColumn): number {
        return column.cards.length;
    }

    isColumnAtMaxCapacity(column: KanbanColumn): boolean {
        return column.maxCards ? column.cards.length >= column.maxCards : false;
    }

    getPriorityColor(priority: string): string {
        switch (priority) {
            case 'high': return 'var(--primary-green)';
            case 'medium': return 'var(--primary-blue)';
            case 'low': return 'var(--stroke)';
            default: return 'var(--stroke)';
        }
    }

    trackByColumnId(index: number, column: KanbanColumn): string {
        return column.id;
    }

    trackByCardId(index: number, card: KanbanCard): string {
        return card.id;
    }

    getConnectedDropLists(): string[] {
        return this.columns.map(column => column.id);
    }

    onDragStarted() {
        this.isDragging = true;
    }

    onDragMoved(event: CdkDragMove) {
        this.isDragging = true;

        if (!this.kanbanBoard) return;

        const boardElement = this.kanbanBoard.nativeElement;
        const boardRect = boardElement.getBoundingClientRect();
        const mouseX = event.pointerPosition.x;


        const distanceFromLeft = mouseX - boardRect.left;
        const distanceFromRight = boardRect.right - mouseX;


        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }


        if (distanceFromLeft < this.scrollZone) {

            this.scrollInterval = setInterval(() => {
                boardElement.scrollLeft -= this.scrollSpeed;
            }, 16); // ~60fps
        } else if (distanceFromRight < this.scrollZone) {

            this.scrollInterval = setInterval(() => {
                boardElement.scrollLeft += this.scrollSpeed;
            }, 16); // ~60fps
        }
    }

    onDragEnded() {

        if (this.scrollInterval) {
            clearInterval(this.scrollInterval);
            this.scrollInterval = null;
        }


        setTimeout(() => {
            this.isDragging = false;
        }, 100);
    }

    onCardClick(card: KanbanCard, column: KanbanColumn, event: Event) {

        if (this.isDragging) {
            event.preventDefault();
            event.stopPropagation();
            return;
        }

        this.cardClicked.emit({ card, column });
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }
}
