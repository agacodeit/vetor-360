import { Component, inject } from '@angular/core';
import { KanbanCard, ModalService } from '../../../../shared';
import {
  SolicitationDataComponent,
  FollowUpComponent,
  ClientDataComponent,
  RatingComponent,
  FinancialAgentComponent,
  CreditOperationComponent,
  FinancialSummaryComponent,
  CashFlowChartComponent
} from './components';

@Component({
  selector: 'app-solicitation-details',
  standalone: true,
  imports: [
    SolicitationDataComponent,
    FollowUpComponent,
    ClientDataComponent,
    RatingComponent,
    FinancialAgentComponent,
    CreditOperationComponent,
    FinancialSummaryComponent,
    CashFlowChartComponent
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
