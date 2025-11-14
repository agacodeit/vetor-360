import { Component, EventEmitter, Output, OnInit, ViewChild, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, ModalService, ErrorHandlerService } from '../../../../shared';
import { StepperComponent, StepperStep } from '../../../../shared/components/atoms/stepper/stepper.component';
import { BasicInfoStepComponent } from './steps/basic-info/basic-info-step.component';
import { GuaranteesStepComponent } from './steps/garantees/guarantees-step.component';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { OpportunityService, OpportunityCreateRequest } from '../../../../shared/services/opportunity/opportunity.service';

@Component({
  selector: 'app-solicitation-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    StepperComponent,
    BasicInfoStepComponent,
    GuaranteesStepComponent
  ],
  standalone: true,
  templateUrl: './solicitation-modal.html',
  styleUrl: './solicitation-modal.scss'
})
export class SolicitationModal implements OnInit {
  private toastService = inject(ToastService);
  private opportunityService = inject(OpportunityService);
  private modalService = inject(ModalService);
  private errorHandler = inject(ErrorHandlerService);

  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();
  @Output() onOpenDocuments = new EventEmitter<any>();


  @ViewChild(BasicInfoStepComponent) basicInfoStepComponent!: BasicInfoStepComponent;
  @ViewChild(GuaranteesStepComponent) guaranteesStepComponent!: GuaranteesStepComponent;


  mainForm: FormGroup;
  isLoading = false;
  currentStep = 0;

  basicInfoData: any = {};
  guaranteesData: any = {};
  solicitationData: any = null;

  constructor(private fb: FormBuilder) {
    this.mainForm = this.fb.group({});
  }

  stepValidStates = [false, false]; // Apenas 2 etapas agora

  stepperSteps: StepperStep[] = [
    {
      id: 'basic-info',
      title: 'Operação',
      description: 'Dados da operação'
    },
    {
      id: 'guarantees',
      title: 'Garantia',
      description: 'Garantias oferecidas'
    }
  ];

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


  canGoNext(): boolean {
    return this.stepValidStates[this.currentStep];
  }


  canGoPrevious(): boolean {
    return this.currentStep > 0;
  }


  canFinish(): boolean {
    return this.currentStep === 1 && this.stepValidStates.every(valid => valid);
  }


  goToNextStep(): void {

    this.markCurrentStepAsTouched();

    if (this.canGoNext() && this.currentStep < 1) {
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

      const requestData: OpportunityCreateRequest = {
        operation: this.basicInfoData.operationType,
        value: parseFloat(this.basicInfoData.amount.replace(/[^\d,]/g, '').replace(',', '.')),
        valueType: this.basicInfoData.currency,
        activityTypeEnum: this.basicInfoData.businessActivity,
        term: this.basicInfoData.term.toString(),
        country: this.basicInfoData.country,
        city: this.basicInfoData.city,
        state: this.basicInfoData.state,
        customerName: this.basicInfoData.customerName,
        guarantee: this.guaranteesData.guarantees
      };

      this.opportunityService.createOpportunity(requestData).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.toastService.success('Oportunidade criada com sucesso!', 'Sucesso');
          this.onSubmit.emit(response);

          // Montar dados completos da solicitação para passar ao fechar o modal
          const solicitationData = {
            ...response,
            customerName: this.basicInfoData.customerName,
            operation: this.basicInfoData.operationType,
            value: parseFloat(this.basicInfoData.amount.replace(/[^\d,]/g, '').replace(',', '.')),
            valueType: this.basicInfoData.currency,
            activityTypeEnum: this.basicInfoData.businessActivity,
            term: this.basicInfoData.term.toString(),
            country: this.basicInfoData.country,
            city: this.basicInfoData.city,
            state: this.basicInfoData.state,
            guarantee: this.guaranteesData.guarantees
          };

          // Fechar o modal passando os dados da solicitação criada
          // O dashboard abrirá o modal de documentos automaticamente quando receber esses dados
          this.modalService.close('create-solicitation', solicitationData);
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Erro ao criar oportunidade:', error);
          const errorMessage = this.errorHandler.getErrorMessage(error);
          this.toastService.error(errorMessage, 'Erro');
        }
      });
    } else {

      const firstInvalidStepIndex = this.stepValidStates.findIndex(valid => !valid);
      if (firstInvalidStepIndex !== -1 && firstInvalidStepIndex !== this.currentStep) {

        const stepNames = ['Operação', 'Garantia'];
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
    }
  }

  markAllStepsAsTouched(): void {
    if (this.basicInfoStepComponent?.basicInfoForm) {
      this.basicInfoStepComponent.basicInfoForm.markAllAsTouched();
    }
    if (this.guaranteesStepComponent?.guaranteesForm) {
      this.guaranteesStepComponent.guaranteesForm.markAllAsTouched();
    }
  }

}
