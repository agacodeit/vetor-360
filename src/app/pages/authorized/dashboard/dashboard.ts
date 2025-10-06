import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ModalComponent, ModalService, SelectComponent, SelectOption } from '../../../shared';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ModalComponent,
    SelectComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  
  constructor(private modalService: ModalService) {}

  statusOptions: SelectOption[] = [
    { value: 'active', label: 'Ativo' },
    { value: 'inactive', label: 'Inativo' },
    { value: 'pending', label: 'Pendente' }
  ];
  
  categoryOptions: SelectOption[] = [
    { value: 'premium', label: 'Premium', group: 'Pagos' },
    { value: 'basic', label: 'Básico', group: 'Pagos' },
    { value: 'free', label: 'Gratuito', group: 'Gratuitos' }
  ];
  
  openCreateSolicitationModal() {
    this.modalService.open({
      id: "create-solicitation",
      title: "Nova Solicitação",
      subtitle: "Informe os dados do produto e do cliente",
      size: "md",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
    });

  }

  onModalClosed($event: any){

  }
}
