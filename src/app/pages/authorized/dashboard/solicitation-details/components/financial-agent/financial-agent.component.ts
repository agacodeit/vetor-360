import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-financial-agent',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './financial-agent.component.html',
    styleUrl: './financial-agent.component.scss'
})
export class FinancialAgentComponent {
    @Input() cardData: KanbanCard | null = null;
}

