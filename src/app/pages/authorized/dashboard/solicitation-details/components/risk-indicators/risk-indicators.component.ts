import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-risk-indicators',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './risk-indicators.component.html',
    styleUrl: './risk-indicators.component.scss'
})
export class RiskIndicatorsComponent {
    @Input() cardData: KanbanCard | null = null;
}

