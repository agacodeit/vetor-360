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

    get opportunity(): any {
        return this.cardData?.data?.opportunity || null;
    }

    get valueLabel(): string {
        return this.cardData?.data?.valueLabel || '-';
    }

    get termLabel(): string {
        const term = this.opportunity?.term;
        if (!term) {
            return '-';
        }
        return `${term} meses`;
    }

    get guarantee(): string {
        return this.opportunity?.guarantee || '-';
    }

    get statusLabel(): string {
        return this.cardData?.data?.statusLabel || '-';
    }

    get operationLabel(): string {
        return this.cardData?.data?.operationLabel || '-';
    }
}

