import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-conclusion',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './conclusion.component.html',
    styleUrls: ['./conclusion.component.scss']
})
export class ConclusionComponent {
    @Input() cardData: KanbanCard | null = null;
}

