import { Component, inject } from '@angular/core';
import { KanbanCard, ModalService, SolicitationStatusUtil } from '../../../../shared';

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

  statusUtil = SolicitationStatusUtil;

  constructor() {
    this.cardData = this.modalService.modals().find(m => m.id === 'solicitation-details')?.config.data;
  }

  getStatusLabel(): string {
    return this.cardData?.status
      ? SolicitationStatusUtil.getLabel(this.cardData.status)
      : 'Status desconhecido';
  }
}
