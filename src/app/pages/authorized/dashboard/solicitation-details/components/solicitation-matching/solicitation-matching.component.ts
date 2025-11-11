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

    get analysisParagraphs(): string[] {
        const latestAnalysis = this.getLatestAnalysisText();

        if (latestAnalysis) {
            return latestAnalysis
                .split(/\n{2,}/)
                .map(paragraph => paragraph.replace(/\s*\n\s*/g, ' ').trim())
                .filter(Boolean);
        }

        return this.buildFallbackAnalysis();
    }

    private getLatestAnalysisText(): string | null {
        const opportunity = this.getOpportunity();
        const analyses = opportunity?.matchingAnalyses;

        if (Array.isArray(analyses) && analyses.length > 0) {
            const latest = analyses[analyses.length - 1];
            return latest?.analysisText ?? null;
        }

        return null;
    }

    private buildFallbackAnalysis(): string[] {
        const opportunity = this.getOpportunity();
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

    private getOpportunity(): any {
        return this.cardData?.data?.opportunity ?? this.cardData?.data ?? null;
    }
}

