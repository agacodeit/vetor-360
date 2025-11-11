import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent, KanbanCard, ModalService, ToastService } from '../../../../../../shared';
import { MatchingAnalysis, MatchingService } from '../../../../../../shared/services/matching/matching.service';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-solicitation-matching',
    standalone: true,
    imports: [CommonModule, ButtonComponent],
    templateUrl: './solicitation-matching.component.html',
    styleUrl: './solicitation-matching.component.scss'
})
export class SolicitationMatchingComponent {
    @Input() cardData: KanbanCard | null = null;
    @Output() analysisRequested = new EventEmitter<MatchingAnalysis>();

    private matchingService = inject(MatchingService);
    private toastService = inject(ToastService);
    private modalService = inject(ModalService);
    isRequestingAnalysis = false;
    private latestAnalysisOverride: MatchingAnalysis | null = null;

    get matchAnalysis(): MatchingAnalysis | null {
        if (this.latestAnalysisOverride) {
            return this.latestAnalysisOverride;
        }

        const opportunity = this.getOpportunity();
        const analyses = opportunity?.matchingAnalyses as MatchingAnalysis[] | undefined;

        if (Array.isArray(analyses) && analyses.length > 0) {
            return analyses[analyses.length - 1] ?? null;
        }

        return null;
    }

    get analysisParagraphs(): MatchingAnalysis | null {
        const latestAnalysis = this.matchAnalysis;

        return latestAnalysis;
    }

    triggerAnalysis(): void {
        const opportunityId = this.getOpportunity()?.id || this.cardData?.id;

        if (!opportunityId) {
            this.toastService.error('Não foi possível identificar a solicitação.', 'Erro ao analisar');
            return;
        }

        if (this.isRequestingAnalysis) {
            return;
        }

        this.isRequestingAnalysis = true;

        this.matchingService.executeAnalysis(opportunityId)
            .pipe(finalize(() => (this.isRequestingAnalysis = false)))
            .subscribe({
                next: (analysis) => {
                    this.latestAnalysisOverride = analysis;
                    this.modalService.close('solicitation-details', { reload: true });
                    this.toastService.success('Análise solicitada com sucesso!', 'Matching');
                },
                error: (error) => {
                    const message = error?.error?.message || 'Não foi possível solicitar uma nova análise.';
                    this.toastService.error(message, 'Erro ao analisar');
                }
            });
    }

    private getOpportunity(): any {
        return this.cardData?.data?.opportunity ?? this.cardData?.data ?? null;
    }
}

