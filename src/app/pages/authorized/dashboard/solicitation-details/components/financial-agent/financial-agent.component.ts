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

    // Dados de exemplo para a tabela de Agentes Financeiros
    financialAgents: FinancialAgent[] = [
        {
            nome: 'Banco Inter',
            dataMatching: '01/02/2021 17:56',
            operacao: 'R$ 500.000,00'
        },
        {
            nome: 'Banco do Brasil',
            dataMatching: '02/02/2021 14:30',
            operacao: 'R$ 750.000,00'
        },
        {
            nome: 'Itaú',
            dataMatching: '03/02/2021 09:15',
            operacao: 'R$ 300.000,00'
        }
    ];
}

