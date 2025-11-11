import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-solicitation-matching',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './solicitation-matching.component.html',
    styleUrl: './solicitation-matching.component.scss'
})
export class SolicitationMatchingComponent {
    @Input() cardData: KanbanCard | null = null;

    get analysisLines(): string[] {
        const opportunity = this.cardData?.data?.opportunity;
        const customerName = opportunity?.customerName || this.cardData?.title || 'O cliente';
        const statusLabel = this.cardData?.data?.statusLabel || this.cardData?.status || 'em análise';
        const operationLabel = this.cardData?.data?.operationLabel || opportunity?.operation || 'operação não informada';
        const valueLabel = this.cardData?.data?.valueLabel || '-';
        const documentsSummary = this.cardData?.data?.documentsSummary;
        const completedDocs = documentsSummary?.completed ?? 0;
        const totalDocs = documentsSummary?.total ?? 0;
        const documentProgress = totalDocs > 0
            ? `${completedDocs}/${totalDocs} documentos entregues`
            : 'nenhum documento entregue até o momento';

        return [
            `${customerName} está atualmente na etapa ${statusLabel.toString().toLowerCase()}.`,
            `A análise indica maior afinidade com operações do tipo ${operationLabel.toLowerCase()}.`,
            `O valor pleiteado gira em torno de ${valueLabel}, com ${documentProgress}.`,
            `Recomenda-se priorizar agentes alinhados ao perfil e comunicar pendências para acelerar o avanço.`
        ];
    }
}

