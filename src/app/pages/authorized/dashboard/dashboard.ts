import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, ModalComponent, ModalService } from '../../../shared';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent,
    ModalComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  
  constructor(private modalService: ModalService) {}

  openCreateSolicitationModal() {
    this.modalService.open({
      id: "example-modal",
      title: "Meu Modal",
      size: "md",
      showHeader: true,
      showCloseButton: true,
      closeOnBackdropClick: true,
      closeOnEscapeKey: true,
    });

  }
}
