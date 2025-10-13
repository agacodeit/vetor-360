import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-financial-summary',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './financial-summary.component.html',
    styleUrl: './financial-summary.component.scss'
})
export class FinancialSummaryComponent {
    @Input() cardData: KanbanCard | null = null;
}

