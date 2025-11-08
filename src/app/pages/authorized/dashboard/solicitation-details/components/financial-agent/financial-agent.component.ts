import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard, TableComponent, TableRowComponent, TableCellComponent } from '../../../../../../shared';

export interface FinancialAgent {
    nome: string;
    dataMatching: string;
    operacao: string;
}

@Component({
    selector: 'app-financial-agent',
    standalone: true,
    imports: [CommonModule, TableComponent, TableRowComponent, TableCellComponent],
    templateUrl: './financial-agent.component.html',
    styleUrl: './financial-agent.component.scss'
})
export class FinancialAgentComponent {
    @Input() cardData: KanbanCard | null = null;

    get financialAgents(): FinancialAgent[] {
        // Ainda não há agentes financeiros retornados pelo serviço
        return [];
    }
}

