import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

interface MonthData {
    name: string;
    entry: number;
    exit: number;
}

@Component({
    selector: 'app-cash-flow-chart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cash-flow-chart.component.html',
    styleUrl: './cash-flow-chart.component.scss'
})
export class CashFlowChartComponent {
    @Input() cardData: KanbanCard | null = null;

    // Dados de exemplo para o gráfico (baseado no print)
    chartData: MonthData[] = [
        { name: 'Jan', entry: 19000, exit: 9000 },
        { name: 'Fev', entry: 15000, exit: 12000 },
        { name: 'Mar', entry: 16000, exit: 6000 },
        { name: 'Abr', entry: 18000, exit: 7000 },
        { name: 'Mai', entry: 16000, exit: 9000 },
        { name: 'Jun', entry: 17000, exit: 5000 },
        { name: 'Jul', entry: 15000, exit: 7000 },
        { name: 'Ago', entry: 18000, exit: 8000 },
        { name: 'Set', entry: 17000, exit: 11000 },
        { name: 'Out', entry: 22000, exit: 10000 },
        { name: 'Nov', entry: 17000, exit: 6000 },
        { name: 'Dez', entry: 18000, exit: 11000 }
    ];

    private maxValue = 25000; // Valor máximo para escala do gráfico

    // Valores do eixo Y (de cima para baixo)
    yAxisValues = [25000, 20000, 15000, 10000, 5000, 0];

    /**
     * Calcula a altura da barra em porcentagem baseado no valor
     */
    getBarHeight(value: number): number {
        return (value / this.maxValue) * 100;
    }

    /**
     * Formata os valores do eixo Y
     */
    formatYAxisValue(value: number): string {
        return value.toLocaleString('pt-BR');
    }
}

