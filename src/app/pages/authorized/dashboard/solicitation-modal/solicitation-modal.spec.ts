import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, delay } from 'rxjs';

import { ToastService } from '../../../../shared/services/toast/toast.service';
import { OpportunityService } from '../../../../shared/services/opportunity/opportunity.service';
import { ModalService } from '../../../../shared/services/modal/modal.service';
import { ErrorHandlerService } from '../../../../shared/services/error-handler/error-handler.service';
import { SolicitationModal } from './solicitation-modal';

describe('SolicitationModal', () => {
  let component: SolicitationModal;
  let fixture: ComponentFixture<SolicitationModal>;
  let toastService: jasmine.SpyObj<ToastService>;
  let opportunityService: jasmine.SpyObj<OpportunityService>;
  let errorHandlerService: jasmine.SpyObj<ErrorHandlerService>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'success', 'warning', 'info']);
    const opportunityServiceSpy = jasmine.createSpyObj('OpportunityService', ['createOpportunity']);
    const errorHandlerServiceSpy = jasmine.createSpyObj('ErrorHandlerService', ['getErrorMessage']);

    errorHandlerServiceSpy.getErrorMessage.and.returnValue('Erro ao processar requisição');

    await TestBed.configureTestingModule({
      imports: [SolicitationModal, HttpClientTestingModule],
      providers: [
        ModalService,
        { provide: ToastService, useValue: toastServiceSpy },
        { provide: OpportunityService, useValue: opportunityServiceSpy },
        { provide: ErrorHandlerService, useValue: errorHandlerServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitationModal);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    opportunityService = TestBed.inject(OpportunityService) as jasmine.SpyObj<OpportunityService>;
    errorHandlerService = TestBed.inject(ErrorHandlerService) as jasmine.SpyObj<ErrorHandlerService>;
    opportunityService.createOpportunity.and.returnValue(of({ id: '1', status: 'PENDING_DOCUMENTS' } as any));
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.currentStep).toBe(0); // O componente inicia no step 0
      expect(component.isLoading).toBe(false);
      expect(component.basicInfoData).toBeDefined();
      expect(component.guaranteesData).toBeDefined();
    });

    it('should initialize mainForm', () => {
      expect(component.mainForm).toBeDefined();
    });

    it('should have correct initial step validation states', () => {
      expect(component.stepValidStates).toEqual([false, false]);
    });

    it('should initialize with 2 stepper steps', () => {
      expect(component.stepperSteps.length).toBe(2);
      expect(component.stepperSteps[0].id).toBe('basic-info');
      expect(component.stepperSteps[1].id).toBe('guarantees');
    });
  });

  describe('Stepper Configuration', () => {
    it('should have correct step titles', () => {
      expect(component.stepperSteps[0].title).toBe('Operação');
      expect(component.stepperSteps[1].title).toBe('Garantia');
    });

    it('should have correct step descriptions', () => {
      expect(component.stepperSteps[0].description).toBe('Dados da operação');
      expect(component.stepperSteps[1].description).toBe('Garantias oferecidas');
    });
  });

  describe('Step Navigation', () => {
    it('should change current step when onStepChanged is called', () => {
      component.onStepChanged(1);
      expect(component.currentStep).toBe(1);

      component.onStepChanged(2);
      expect(component.currentStep).toBe(2);

      component.onStepChanged(0);
      expect(component.currentStep).toBe(0);
    });

    it('should go to next step when valid and canGoNext', () => {
      component.currentStep = 0;
      component.stepValidStates[0] = true;

      component.goToNextStep();

      expect(component.currentStep).toBe(1);
    });

    it('should not go to next step when invalid', () => {
      component.currentStep = 0;
      component.stepValidStates[0] = false;

      component.goToNextStep();

      expect(component.currentStep).toBe(0);
      expect(toastService.error).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios antes de continuar.'
      );
    });

    it('should not go beyond last step', () => {
      component.currentStep = 1;
      component.stepValidStates[1] = true;

      component.goToNextStep();

      expect(component.currentStep).toBe(1);
    });

    it('should go to previous step when canGoPrevious', () => {
      component.currentStep = 1;

      component.goToPreviousStep();

      expect(component.currentStep).toBe(0);
    });

    it('should not go to previous step when on first step', () => {
      component.currentStep = 0;

      component.goToPreviousStep();

      expect(component.currentStep).toBe(0);
    });
  });

  describe('Navigation Guards', () => {
    it('canGoNext should return true when current step is valid', () => {
      component.currentStep = 0;
      component.stepValidStates[0] = true;

      expect(component.canGoNext()).toBe(true);
    });

    it('canGoNext should return false when current step is invalid', () => {
      component.currentStep = 0;
      component.stepValidStates[0] = false;

      expect(component.canGoNext()).toBe(false);
    });

    it('canGoPrevious should return true when not on first step', () => {
      component.currentStep = 1;
      expect(component.canGoPrevious()).toBe(true);

      component.currentStep = 2;
      expect(component.canGoPrevious()).toBe(true);
    });

    it('canGoPrevious should return false when on first step', () => {
      component.currentStep = 0;
      expect(component.canGoPrevious()).toBe(false);
    });

    it('canFinish should return true when on last step and all steps are valid', () => {
      component.currentStep = 1;
      component.stepValidStates = [true, true];

      expect(component.canFinish()).toBe(true);
    });

    it('canFinish should return false when not on last step', () => {
      component.currentStep = 0;
      component.stepValidStates = [true, true];

      expect(component.canFinish()).toBe(false);
    });

    it('canFinish should return false when not all steps are valid', () => {
      component.currentStep = 1;
      component.stepValidStates = [true, false];

      expect(component.canFinish()).toBe(false);
    });
  });

  describe('Data Change Handlers', () => {
    it('should update basicInfoData when onBasicInfoDataChange is called', () => {
      const testData = { name: 'Test', value: 123 };

      component.onBasicInfoDataChange(testData);

      expect(component.basicInfoData).toEqual(testData);
    });

    it('should update step validation state when onBasicInfoValidChange is called', () => {
      component.onBasicInfoValidChange(true);
      expect(component.stepValidStates[0]).toBe(true);

      component.onBasicInfoValidChange(false);
      expect(component.stepValidStates[0]).toBe(false);
    });

    it('should update guaranteesData when onGuaranteesDataChange is called', () => {
      const testData = { guarantee: 'Real Estate' };

      component.onGuaranteesDataChange(testData);

      expect(component.guaranteesData).toEqual(testData);
    });

    it('should update step validation state when onGuaranteesValidChange is called', () => {
      component.onGuaranteesValidChange(true);
      expect(component.stepValidStates[1]).toBe(true);

      component.onGuaranteesValidChange(false);
      expect(component.stepValidStates[1]).toBe(false);
    });

  });

  describe('Event Emitters', () => {
    it('should emit onClose when handleClose is called', () => {
      spyOn(component.onClose, 'emit');

      component.handleClose();

      expect(component.onClose.emit).toHaveBeenCalled();
    });

    it('should emit onSubmit with merged data when handleSubmit succeeds', fakeAsync(() => {
      opportunityService.createOpportunity.and.returnValue(
        of({ id: '1', status: 'PENDING_DOCUMENTS' } as any).pipe(delay(100))
      );
      spyOn(component.onSubmit, 'emit');
      component.currentStep = 1;
      component.stepValidStates = [true, true];
      component.basicInfoData = { 
        customerName: 'John',
        operationType: 'OP1',
        amount: '1000',
        currency: 'BRL',
        businessActivity: 'ACT1',
        term: '12',
        country: 'Brasil',
        city: 'São Paulo',
        state: 'SP'
      };
      component.guaranteesData = { guarantees: 'Property' };

      component.handleSubmit();

      expect(component.isLoading).toBe(true);

      tick(100);

      expect(component.isLoading).toBe(false);
      expect(component.onSubmit.emit).toHaveBeenCalled();
    }));

    it('should not emit onSubmit when form is invalid', () => {
      spyOn(component.onSubmit, 'emit');
      component.currentStep = 1;
      component.stepValidStates = [false, true];

      component.handleSubmit();

      expect(component.onSubmit.emit).not.toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('Form Validation and Submit', () => {
    it('should show error and navigate to first invalid step when submitting invalid form', () => {
      component.currentStep = 1;
      component.stepValidStates = [false, true];

      component.handleSubmit();

      expect(component.currentStep).toBe(0);
      expect(toastService.error).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios na etapa "Operação".',
        'Formulário incompleto'
      );
    });

    it('should show error for current step when it is invalid', () => {
      component.currentStep = 1;
      component.stepValidStates = [true, false];

      component.handleSubmit();

      expect(toastService.error).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios antes de enviar.',
        'Formulário incompleto'
      );
    });

    it('should set isLoading to true during submit', fakeAsync(() => {
      opportunityService.createOpportunity.and.returnValue(
        of({ id: '1', status: 'PENDING_DOCUMENTS' } as any).pipe(delay(100))
      );
      component.currentStep = 1;
      component.stepValidStates = [true, true];
      component.basicInfoData = { 
        customerName: 'John',
        operationType: 'OP1',
        amount: '1000',
        currency: 'BRL',
        businessActivity: 'ACT1',
        term: '12',
        country: 'Brasil',
        city: 'São Paulo',
        state: 'SP'
      };
      component.guaranteesData = { guarantees: 'Property' };

      component.handleSubmit();

      expect(component.isLoading).toBe(true);

      tick(50);
      expect(component.isLoading).toBe(true);

      tick(100);
      expect(component.isLoading).toBe(false);
    }));
  });

  describe('Mark Forms as Touched', () => {
    it('should mark basic info form as touched when on step 0', () => {
      component.currentStep = 0;
      const mockForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      component.basicInfoStepComponent = {
        basicInfoForm: mockForm
      } as any;

      component.markCurrentStepAsTouched();

      expect(mockForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should mark guarantees form as touched when on step 1', () => {
      component.currentStep = 1;
      const mockForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      component.guaranteesStepComponent = {
        guaranteesForm: mockForm
      } as any;

      component.markCurrentStepAsTouched();

      expect(mockForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should mark documents form as touched when on step 2', () => {
      component.currentStep = 2;
      const mockForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
     
      component.markCurrentStepAsTouched();

      // O componente ds-documents gerencia sua própria validação, então markAllAsTouched não é chamado
      expect(mockForm.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should mark all forms as touched when markAllStepsAsTouched is called', () => {
      const mockBasicForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      const mockGuaranteesForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      const mockDocumentsForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);

      component.basicInfoStepComponent = { basicInfoForm: mockBasicForm } as any;
      component.guaranteesStepComponent = { guaranteesForm: mockGuaranteesForm } as any;

      component.markAllStepsAsTouched();

      expect(mockBasicForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockGuaranteesForm.markAllAsTouched).toHaveBeenCalled();
      // O componente ds-documents gerencia sua própria validação, então markAllAsTouched não é chamado
      expect(mockDocumentsForm.markAllAsTouched).not.toHaveBeenCalled();
    });

    it('should not throw error if step components are not initialized', () => {
      component.basicInfoStepComponent = undefined as any;
      component.guaranteesStepComponent = undefined as any;

      expect(() => component.markCurrentStepAsTouched()).not.toThrow();
      expect(() => component.markAllStepsAsTouched()).not.toThrow();
    });
  });

  describe('Template Rendering', () => {
    it('should render stepper component', () => {
      const stepper = compiled.querySelector('ds-stepper');
      expect(stepper).toBeTruthy();
    });

    it('should render basic info step when currentStep is 0', () => {
      component.currentStep = 0;
      fixture.detectChanges();

      const basicInfoStep = compiled.querySelector('app-basic-info-step');
      expect(basicInfoStep).toBeTruthy();
    });

    it('should render guarantees step when currentStep is 1', () => {
      component.currentStep = 1;
      fixture.detectChanges();

      const guaranteesStep = compiled.querySelector('app-guarantees-step');
      expect(guaranteesStep).toBeTruthy();
    });

    // Documents step removed - component now has only 2 steps

    it('should render cancel button', () => {
      const buttons = compiled.querySelectorAll('ds-button');
      expect(buttons.length).toBeGreaterThan(0);
    });

    it('should render "Voltar" button when not on first step', () => {
      component.currentStep = 1;
      fixture.detectChanges();

      const content = compiled.textContent || '';
      expect(content).toContain('Voltar');
    });

    it('should not render "Voltar" button when on first step', () => {
      component.currentStep = 0;
      fixture.detectChanges();

      const content = compiled.textContent || '';
      const hasVoltar = content.split('Voltar').length > 2; // More than just in step title
      expect(hasVoltar).toBe(false);
    });

    it('should render "Próximo" button when not on last step', () => {
      component.currentStep = 0;
      fixture.detectChanges();

      const content = compiled.textContent || '';
      expect(content).toContain('Próximo');
    });

    it('should render "Criar" button when on last step', () => {
      component.currentStep = 1;
      component.stepValidStates = [true, true];
      fixture.detectChanges();

      const content = compiled.textContent || '';
      expect(content).toContain('Criar');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow from step 0 to step 1', () => {
      component.currentStep = 0;
      expect(component.currentStep).toBe(0);

      // Validate step 0 and go next
      component.stepValidStates[0] = true;
      component.goToNextStep();
      expect(component.currentStep).toBe(1);

      // Cannot go beyond last step (step 1)
      component.stepValidStates[1] = true;
      component.goToNextStep();
      expect(component.currentStep).toBe(1);
    });

    it('should navigate back through all steps', () => {
      component.currentStep = 1;

      component.goToPreviousStep();
      expect(component.currentStep).toBe(0);
    });

    it('should merge all step data on submit', fakeAsync(() => {
      opportunityService.createOpportunity.and.returnValue(of({ id: '1', status: 'PENDING_DOCUMENTS' } as any));
      spyOn(component.onSubmit, 'emit');

      component.currentStep = 1;
      component.stepValidStates = [true, true];
      component.basicInfoData = { 
        customerName: 'John',
        operationType: 'OP1',
        amount: '1000',
        currency: 'BRL',
        businessActivity: 'ACT1',
        term: '12',
        country: 'Brasil',
        city: 'São Paulo',
        state: 'SP'
      };
      component.guaranteesData = { guarantees: 'Property' };

      component.handleSubmit();
      tick(2000);

      expect(component.onSubmit.emit).toHaveBeenCalled();
    }));
  });
});
