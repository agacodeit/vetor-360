import { Component, inject } from '@angular/core';
import { KanbanCard, ModalService, SolicitationStatusUtil, IconComponent } from '../../../../shared';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-solicitation-details',
  imports: [
    IconComponent,
    DatePipe
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
