import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-rating',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rating.component.html',
    styleUrl: './rating.component.scss'
})
export class RatingComponent {
    @Input() cardData: KanbanCard | null = null;

    get documentsSummary() {
        return this.cardData?.data?.documentsSummary || { completed: 0, total: 0 };
    }

    get ratingLetter(): string {
        const { completed, total } = this.documentsSummary;
        if (!total) {
            return '–';
        }
        const ratio = completed / total;
        if (ratio >= 0.8) return 'A';
        if (ratio >= 0.6) return 'B';
        if (ratio >= 0.4) return 'C';
        return 'D';
    }

    get ratingDescription(): string {
        const { completed, total } = this.documentsSummary;
        if (!total) {
            return 'Documentação ainda não iniciada';
        }
        const ratio = completed / total;
        if (ratio >= 0.8) {
            return 'Documentação praticamente completa.';
        }
        if (ratio >= 0.6) {
            return 'Boa evolução da documentação.';
        }
        if (ratio >= 0.4) {
            return 'Documentação em andamento.';
        }
        return 'Documentação pendente.';
    }
}

