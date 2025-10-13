import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard, SolicitationStatusUtil } from '../../../../../../shared';

@Component({
    selector: 'app-solicitation-data',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './solicitation-data.component.html',
    styleUrl: './solicitation-data.component.scss'
})
export class SolicitationDataComponent {
    @Input() cardData: KanbanCard | null = null;

    getStatusLabel(): string {
        return this.cardData?.status
            ? SolicitationStatusUtil.getLabel(this.cardData.status)
            : 'Status desconhecido';
    }
}

