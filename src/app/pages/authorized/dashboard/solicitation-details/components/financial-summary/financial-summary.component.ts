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

    get opportunity(): any {
        return this.cardData?.data?.opportunity || null;
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

    get valueLabel(): string {
        return this.cardData?.data?.valueLabel || '-';
    }

    get documentsSummary(): string {
        const summary = this.cardData?.data?.documentsSummary;
        if (!summary || summary.total === 0) {
            return '0/0';
        }
        return `${summary.completed}/${summary.total}`;
    }

    get createdAt(): string {
        return this.cardData?.data?.createdAt || '-';
    }
}

