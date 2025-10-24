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


  @ViewChild(BasicInfoStepComponent) basicInfoStepComponent!: BasicInfoStepComponent;
  @ViewChild(GuaranteesStepComponent) guaranteesStepComponent!: GuaranteesStepComponent;
  @ViewChild(DocumentsStepComponent) documentsStepComponent!: DocumentsStepComponent;


  mainForm: FormGroup;
  isLoading = false;
  currentStep = 2;


  basicInfoData: any = {};
  guaranteesData: any = {};
  documentsData: any = {};


  stepValidStates = [false, false, true]; // Step 3 (documentos) sempre válido por enquanto


  stepperSteps: StepperStep[] = [
    {
      id: 'basic-info',
      title: 'Operação',
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

    this.mainForm = this.fb.group({});
  }

  ngOnInit(): void {

  }


  onStepChanged(stepIndex: number): void {
    this.currentStep = stepIndex;
  }


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


  canGoNext(): boolean {
    return this.stepValidStates[this.currentStep];
  }


  canGoPrevious(): boolean {
    return this.currentStep > 0;
  }


  canFinish(): boolean {
    return this.currentStep === 2 && this.stepValidStates.every(valid => valid);
  }


  goToNextStep(): void {

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


  handleClose(): void {
    this.onClose.emit();
  }

  handleSubmit(): void {

    if (this.canFinish()) {
      this.isLoading = true;


      const formData = {
        ...this.basicInfoData,
        ...this.guaranteesData,
        ...this.documentsData
      };


      setTimeout(() => {
        this.isLoading = false;
        this.onSubmit.emit(formData);
      }, 2000);
    } else {

      const firstInvalidStepIndex = this.stepValidStates.findIndex(valid => !valid);
      if (firstInvalidStepIndex !== -1 && firstInvalidStepIndex !== this.currentStep) {

        const stepNames = ['Informações Básicas', 'Garantias', 'Documentos'];
        this.toastService.error(
          `Por favor, preencha todos os campos obrigatórios na etapa "${stepNames[firstInvalidStepIndex]}".`,
          'Formulário incompleto'
        );


        this.currentStep = firstInvalidStepIndex;

        setTimeout(() => {
          this.markCurrentStepAsTouched();
        }, 0);
      } else {

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
        // O componente ds-documents gerencia sua própria validação
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
    // O componente ds-documents gerencia sua própria validação
  }
}
