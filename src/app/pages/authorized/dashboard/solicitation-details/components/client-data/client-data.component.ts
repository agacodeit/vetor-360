import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-client-data',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-data.component.html',
    styleUrl: './client-data.component.scss'
})
export class ClientDataComponent {
    @Input() cardData: KanbanCard | null = null;

    get opportunity(): any {
        return this.cardData?.data?.opportunity || null;
    }

    get createdAt(): string {
        return this.cardData?.data?.createdAt || '-';
    }

    get activity(): string {
        return this.opportunity?.activityTypeEnum || '-';
    }

    get location(): string {
        const opp = this.opportunity;
        if (!opp) {
            return 'Localização não informada';
        }
        const parts = [opp.city, opp.state, opp.country].filter(Boolean);
        return parts.length ? parts.join(', ') : 'Localização não informada';
    }
}

