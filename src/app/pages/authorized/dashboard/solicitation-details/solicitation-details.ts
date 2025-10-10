import { Component, inject } from '@angular/core';
import { KanbanCard, ModalService } from '../../../../shared';

@Component({
  selector: 'app-solicitation-details',
  imports: [

  ],
  templateUrl: './solicitation-details.html',
  styleUrl: './solicitation-details.scss'
})
export class SolicitationDetails {

  private modalService = inject(ModalService);
  cardData: KanbanCard | null = null;

  constructor() {
    this.cardData = this.modalService.modals().find(m => m.id === 'solicitation-details')?.config.data;
  }
}
