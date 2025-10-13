import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-credit-operation',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './credit-operation.component.html',
    styleUrl: './credit-operation.component.scss'
})
export class CreditOperationComponent {
    @Input() cardData: KanbanCard | null = null;
}

