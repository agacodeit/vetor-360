import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KanbanCard, ModalService, ProfileService, TabConfig, TabsComponent } from '../../../../shared';
import { UserProfile } from '../../../../shared/types/profile.types';
import {
  CreditOperationComponent,
  FollowUpComponent,
  SolicitationDataComponent,
  SolicitationMatchingComponent
} from './components';

@Component({
  selector: 'app-solicitation-details',
  standalone: true,
  imports: [
    CommonModule,
    TabsComponent,
    SolicitationDataComponent,
    FollowUpComponent,
    SolicitationMatchingComponent,
    CreditOperationComponent
  ],
  templateUrl: './solicitation-details.html',
  styleUrl: './solicitation-details.scss'
})
export class SolicitationDetails {

  private modalService = inject(ModalService);
  private profileService = inject(ProfileService);

  cardData: KanbanCard | null = null;
  tabs: TabConfig[] = [
    { id: 'general', label: 'Informações Gerais' },
    { id: 'matching', label: 'Matching' }
  ];
  activeTabId = 'general';

  constructor() {
    this.cardData = this.modalService.modals().find(m => m.id === 'solicitation-details')?.config.data;
  }

  /**
   * Verifica se o usuário é Gestor
   */
  get isGestor(): boolean {
    return this.profileService.getCurrentUser()?.userTypeEnum === UserProfile.GESTOR_ACESSEBANK;
  }

  /**
   * Verifica se o usuário é Partner
   */
  get isPartner(): boolean {
    return this.profileService.getCurrentUser()?.userTypeEnum === UserProfile.PARCEIRO_ACESSEBANK;
  }

  onTabChange(tabId: string): void {
    this.activeTabId = tabId;
  }
}
