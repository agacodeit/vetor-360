import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-risk-classification',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './risk-classification.component.html',
    styleUrls: ['./risk-classification.component.scss']
})
export class RiskClassificationComponent {
    @Input() cardData: KanbanCard | null = null;

    // Risco atual: Baixo (aponta para a zona verde)
    // Valores possíveis: -90 (Alto/Vermelho), 0 (Médio/Amarelo), 90 (Baixo/Verde)
    needleRotation = 60; // Aponta para zona verde (Baixo risco)

    /**
     * Define a rotação da agulha baseado no nível de risco
     * @param riskLevel 'high' | 'medium' | 'low'
     */
    setRiskLevel(riskLevel: 'high' | 'medium' | 'low'): void {
        switch (riskLevel) {
            case 'high':
                this.needleRotation = -60; // Zona vermelha
                break;
            case 'medium':
                this.needleRotation = 0; // Zona amarela
                break;
            case 'low':
                this.needleRotation = 60; // Zona verde
                break;
        }
    }
}

