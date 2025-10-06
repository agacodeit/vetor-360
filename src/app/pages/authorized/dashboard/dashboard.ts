import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent, InputComponent, ModalComponent, ModalService, SelectComponent, SelectOption, TextareaComponent } from '../../../shared';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, NgModel, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    ModalComponent,
    SelectComponent,
    InputComponent,
    TextareaComponent
  ],
  providers: [
    NgModel
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {
  
  constructor(private modalService: ModalService) {}

  form: FormGroup = new FormGroup({
    purpose: new FormControl('', Validators.required)
  })
  
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
