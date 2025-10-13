import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../../../../../shared';

@Component({
    selector: 'app-follow-up',
    standalone: true,
    imports: [CommonModule, IconComponent],
    templateUrl: './follow-up.component.html',
    styleUrl: './follow-up.component.scss'
})
export class FollowUpComponent {

    onOpenVisualization(): void {
        // Implementar lógica para abrir visualização
        console.log('Abrir visualização de follow-up');
    }
}

