import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanCard } from '../../../../../../shared';

@Component({
    selector: 'app-client-data',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './client-data.component.html',
    styleUrl: './client-data.component.scss'
})
export class ClientDataComponent {
    @Input() cardData: KanbanCard | null = null;
}

