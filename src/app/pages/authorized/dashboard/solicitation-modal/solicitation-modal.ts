import { Component, EventEmitter, Output, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../../shared';
import { StepperComponent, StepperStep } from '../../../../shared/components/atoms/stepper/stepper.component';
import { DocumentsStepComponent } from './steps/documents/documents-step.component';
import { BasicInfoStepComponent } from './steps/basic-info/basic-info-step.component';
import { GuaranteesStepComponent } from './steps/garantees/guarantees-step.component';
import { ToastService } from '../../../../shared/services/toast/toast.service';

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
  private toastService = inject(ToastService);

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  // ViewChild para acessar os componentes dos steps
  @ViewChild(BasicInfoStepComponent) basicInfoStepComponent!: BasicInfoStepComponent;
  @ViewChild(GuaranteesStepComponent) guaranteesStepComponent!: GuaranteesStepComponent;
  @ViewChild(DocumentsStepComponent) documentsStepComponent!: DocumentsStepComponent;

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
    // Marcar o step atual como touched antes de tentar avançar
    this.markCurrentStepAsTouched();

    if (this.canGoNext() && this.currentStep < 2) {
      this.currentStep++;
    } else if (!this.canGoNext()) {
      this.toastService.error('Por favor, preencha todos os campos obrigatórios antes de continuar.');
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
    // Verificar se todos os steps são válidos
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
    } else {
      // Se não pode finalizar, encontrar o primeiro step inválido e navegar para ele
      const firstInvalidStepIndex = this.stepValidStates.findIndex(valid => !valid);
      if (firstInvalidStepIndex !== -1 && firstInvalidStepIndex !== this.currentStep) {
        // Mostrar mensagem de erro
        const stepNames = ['Informações Básicas', 'Garantias', 'Documentos'];
        this.toastService.error(
          `Por favor, preencha todos os campos obrigatórios na etapa "${stepNames[firstInvalidStepIndex]}".`,
          'Formulário incompleto'
        );

        // Navegar para o primeiro step inválido
        this.currentStep = firstInvalidStepIndex;
        // Marcar como touched após a navegação (usar setTimeout para garantir que o componente foi renderizado)
        setTimeout(() => {
          this.markCurrentStepAsTouched();
        }, 0);
      } else {
        // Se o step atual é o inválido, apenas marcar como touched e mostrar toast
        this.markCurrentStepAsTouched();
        this.toastService.error(
          'Por favor, preencha todos os campos obrigatórios antes de enviar.',
          'Formulário incompleto'
        );
      }
    }
  }

  markCurrentStepAsTouched(): void {
    switch (this.currentStep) {
      case 0:
        if (this.basicInfoStepComponent?.basicInfoForm) {
          this.basicInfoStepComponent.basicInfoForm.markAllAsTouched();
        }
        break;
      case 1:
        if (this.guaranteesStepComponent?.guaranteesForm) {
          this.guaranteesStepComponent.guaranteesForm.markAllAsTouched();
        }
        break;
      case 2:
        if (this.documentsStepComponent?.documentsForm) {
          this.documentsStepComponent.documentsForm.markAllAsTouched();
        }
        break;
    }
  }

  markAllStepsAsTouched(): void {
    if (this.basicInfoStepComponent?.basicInfoForm) {
      this.basicInfoStepComponent.basicInfoForm.markAllAsTouched();
    }
    if (this.guaranteesStepComponent?.guaranteesForm) {
      this.guaranteesStepComponent.guaranteesForm.markAllAsTouched();
    }
    if (this.documentsStepComponent?.documentsForm) {
      this.documentsStepComponent.documentsForm.markAllAsTouched();
    }
  }
}