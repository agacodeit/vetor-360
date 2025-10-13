import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-cash-flow-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cash-flow-chart.component.html',
    styleUrl: './cash-flow-chart.component.scss'
})
export class CashFlowChartComponent {
    @Input() cardData: KanbanCard | null = null;
}

