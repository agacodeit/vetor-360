import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared';
import { StepperComponent, StepperStep } from '../../../../shared/components/atoms/stepper/stepper.component';
import { BasicInfoStepComponent } from './steps/basic-info-step.component';
import { GuaranteesStepComponent } from './steps/guarantees-step.component';
import { DocumentsStepComponent } from './steps/documents-step.component';

@Component({
  selector: 'app-solicitation-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    StepperComponent,
    BasicInfoStepComponent,
    GuaranteesStepComponent,
    DocumentsStepComponent
  ],
  standalone: true,
  templateUrl: './solicitation-modal.html',
  styleUrl: './solicitation-modal.scss'
})
export class SolicitationModal implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  // Formulário pai que agrupa todos os steps
  mainForm: FormGroup;
  isLoading = false;
  currentStep = 0;

  // Dados dos formulários de cada step
  basicInfoData: any = {};
  guaranteesData: any = {};
  documentsData: any = {};

  // Estados de validação de cada step
  stepValidStates = [false, false, true]; // Step 3 (documentos) sempre válido por enquanto

  // Configuração dos steps do stepper
  stepperSteps: StepperStep[] = [
    {
      id: 'basic-info',
      title: 'Informações Básicas',
      description: 'Dados da solicitação'
    },
    {
      id: 'guarantees',
      title: 'Garantias',
      description: 'Garantias oferecidas'
    },
    {
      id: 'documents',
      title: 'Documentos',
      description: 'Anexos necessários'
    }
  ];

  constructor(private fb: FormBuilder) {
    // Formulário pai vazio, os dados serão gerenciados pelos componentes filhos
    this.mainForm = this.fb.group({});
  }

  ngOnInit(): void {
    // Inicialização se necessário
  }

  // Métodos para gerenciar o stepper
  onStepChanged(stepIndex: number): void {
    this.currentStep = stepIndex;
  }

  // Métodos para receber dados dos componentes filhos
  onBasicInfoDataChange(data: any): void {
    this.basicInfoData = data;
  }

  onBasicInfoValidChange(isValid: boolean): void {
    this.stepValidStates[0] = isValid;
  }

  onGuaranteesDataChange(data: any): void {
    this.guaranteesData = data;
  }

  onGuaranteesValidChange(isValid: boolean): void {
    this.stepValidStates[1] = isValid;
  }

  onDocumentsDataChange(data: any): void {
    this.documentsData = data;
  }

  onDocumentsValidChange(isValid: boolean): void {
    this.stepValidStates[2] = isValid;
  }

  // Verificar se pode avançar para o próximo step
  canGoNext(): boolean {
    return this.stepValidStates[this.currentStep];
  }

  // Verificar se pode voltar
  canGoPrevious(): boolean {
    return this.currentStep > 0;
  }

  // Verificar se pode finalizar
  canFinish(): boolean {
    return this.currentStep === 2 && this.stepValidStates.every(valid => valid);
  }

  // Navegação entre steps
  goToNextStep(): void {
    if (this.canGoNext() && this.currentStep < 2) {
      this.currentStep++;
    }
  }

  goToPreviousStep(): void {
    if (this.canGoPrevious()) {
      this.currentStep--;
    }
  }

  // Métodos principais
  handleClose(): void {
    this.onClose.emit();
  }

  handleSubmit(): void {
    if (this.canFinish()) {
      this.isLoading = true;

      // Combinar todos os dados dos steps
      const formData = {
        ...this.basicInfoData,
        ...this.guaranteesData,
        ...this.documentsData
      };

      // Simular envio
      setTimeout(() => {
        this.isLoading = false;
        this.onSubmit.emit(formData);
      }, 2000);
    }
  }
}