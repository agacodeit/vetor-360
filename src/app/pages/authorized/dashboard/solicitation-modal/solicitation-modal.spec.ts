import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { ToastService } from '../../../../shared/services/toast/toast.service';
import { SolicitationModal } from './solicitation-modal';

describe('SolicitationModal', () => {
  let component: SolicitationModal;
  let fixture: ComponentFixture<SolicitationModal>;
  let toastService: jasmine.SpyObj<ToastService>;
  let compiled: HTMLElement;

  beforeEach(async () => {
    const toastServiceSpy = jasmine.createSpyObj('ToastService', ['error', 'success', 'warning', 'info']);

    await TestBed.configureTestingModule({
      imports: [SolicitationModal],
      providers: [
        { provide: ToastService, useValue: toastServiceSpy }
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(SolicitationModal);
    component = fixture.componentInstance;
    compiled = fixture.nativeElement;
    toastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.currentStep).toBe(0);
      expect(component.isLoading).toBe(false);
      expect(component.basicInfoData).toEqual({});
      expect(component.guaranteesData).toEqual({});
      expect(component.documentsData).toEqual({});
    });

    it('should initialize mainForm', () => {
      expect(component.mainForm).toBeDefined();
    });

    it('should have correct initial step validation states', () => {
      expect(component.stepValidStates).toEqual([false, false, true]);
    });

    it('should initialize with 3 stepper steps', () => {
      expect(component.stepperSteps.length).toBe(3);
      expect(component.stepperSteps[0].id).toBe('basic-info');
      expect(component.stepperSteps[1].id).toBe('guarantees');
      expect(component.stepperSteps[2].id).toBe('documents');
    });
  });

  describe('Stepper Configuration', () => {
    it('should have correct step titles', () => {
      expect(component.stepperSteps[0].title).toBe('Informações Básicas');
      expect(component.stepperSteps[1].title).toBe('Garantias');
      expect(component.stepperSteps[2].title).toBe('Documentos');
    });

    it('should have correct step descriptions', () => {
      expect(component.stepperSteps[0].description).toBe('Dados da solicitação');
      expect(component.stepperSteps[1].description).toBe('Garantias oferecidas');
      expect(component.stepperSteps[2].description).toBe('Anexos necessários');
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
      component.currentStep = 2;
      component.stepValidStates[2] = true;

      component.goToNextStep();

      expect(component.currentStep).toBe(2);
    });

    it('should go to previous step when canGoPrevious', () => {
      component.currentStep = 2;

      component.goToPreviousStep();

      expect(component.currentStep).toBe(1);
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
      component.currentStep = 2;
      component.stepValidStates = [true, true, true];

      expect(component.canFinish()).toBe(true);
    });

    it('canFinish should return false when not on last step', () => {
      component.currentStep = 0;
      component.stepValidStates = [true, true, true];

      expect(component.canFinish()).toBe(false);
    });

    it('canFinish should return false when not all steps are valid', () => {
      component.currentStep = 2;
      component.stepValidStates = [true, false, true];

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

    it('should update documentsData when onDocumentsDataChange is called', () => {
      const testData = { documents: ['doc1.pdf', 'doc2.pdf'] };

      component.onDocumentsDataChange(testData);

      expect(component.documentsData).toEqual(testData);
    });

    it('should update step validation state when onDocumentsValidChange is called', () => {
      component.onDocumentsValidChange(true);
      expect(component.stepValidStates[2]).toBe(true);

      component.onDocumentsValidChange(false);
      expect(component.stepValidStates[2]).toBe(false);
    });
  });

  describe('Event Emitters', () => {
    it('should emit onClose when handleClose is called', () => {
      spyOn(component.onClose, 'emit');

      component.handleClose();

      expect(component.onClose.emit).toHaveBeenCalled();
    });

    it('should emit onSubmit with merged data when handleSubmit succeeds', fakeAsync(() => {
      spyOn(component.onSubmit, 'emit');
      component.currentStep = 2;
      component.stepValidStates = [true, true, true];
      component.basicInfoData = { client: 'John' };
      component.guaranteesData = { guarantee: 'Property' };
      component.documentsData = { docs: ['file.pdf'] };

      component.handleSubmit();

      expect(component.isLoading).toBe(true);

      tick(2000);

      expect(component.isLoading).toBe(false);
      expect(component.onSubmit.emit).toHaveBeenCalledWith({
        client: 'John',
        guarantee: 'Property',
        docs: ['file.pdf']
      });
    }));

    it('should not emit onSubmit when form is invalid', () => {
      spyOn(component.onSubmit, 'emit');
      component.currentStep = 2;
      component.stepValidStates = [false, true, true];

      component.handleSubmit();

      expect(component.onSubmit.emit).not.toHaveBeenCalled();
      expect(toastService.error).toHaveBeenCalled();
    });
  });

  describe('Form Validation and Submit', () => {
    it('should show error and navigate to first invalid step when submitting invalid form', () => {
      component.currentStep = 2;
      component.stepValidStates = [false, true, true];

      component.handleSubmit();

      expect(component.currentStep).toBe(0);
      expect(toastService.error).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios na etapa "Informações Básicas".',
        'Formulário incompleto'
      );
    });

    it('should show error for current step when it is invalid', () => {
      component.currentStep = 1;
      component.stepValidStates = [true, false, true];

      component.handleSubmit();

      expect(toastService.error).toHaveBeenCalledWith(
        'Por favor, preencha todos os campos obrigatórios antes de enviar.',
        'Formulário incompleto'
      );
    });

    it('should set isLoading to true during submit', fakeAsync(() => {
      component.currentStep = 2;
      component.stepValidStates = [true, true, true];

      component.handleSubmit();

      expect(component.isLoading).toBe(true);

      tick(1000);
      expect(component.isLoading).toBe(true);

      tick(1000);
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
      component.documentsStepComponent = {
        documentsForm: mockForm
      } as any;

      component.markCurrentStepAsTouched();

      expect(mockForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should mark all forms as touched when markAllStepsAsTouched is called', () => {
      const mockBasicForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      const mockGuaranteesForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);
      const mockDocumentsForm = jasmine.createSpyObj('FormGroup', ['markAllAsTouched']);

      component.basicInfoStepComponent = { basicInfoForm: mockBasicForm } as any;
      component.guaranteesStepComponent = { guaranteesForm: mockGuaranteesForm } as any;
      component.documentsStepComponent = { documentsForm: mockDocumentsForm } as any;

      component.markAllStepsAsTouched();

      expect(mockBasicForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockGuaranteesForm.markAllAsTouched).toHaveBeenCalled();
      expect(mockDocumentsForm.markAllAsTouched).toHaveBeenCalled();
    });

    it('should not throw error if step components are not initialized', () => {
      component.basicInfoStepComponent = undefined as any;
      component.guaranteesStepComponent = undefined as any;
      component.documentsStepComponent = undefined as any;

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

    it('should render documents step when currentStep is 2', () => {
      component.currentStep = 2;
      fixture.detectChanges();

      const documentsStep = compiled.querySelector('app-documents-step');
      expect(documentsStep).toBeTruthy();
    });

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

    it('should render "Criar Solicitação" button when on last step', () => {
      component.currentStep = 2;
      fixture.detectChanges();

      const content = compiled.textContent || '';
      expect(content).toContain('Criar Solicitação');
    });
  });

  describe('Integration Tests', () => {
    it('should complete full flow from step 0 to step 2', () => {
      expect(component.currentStep).toBe(0);

      // Validate step 0 and go next
      component.stepValidStates[0] = true;
      component.goToNextStep();
      expect(component.currentStep).toBe(1);

      // Validate step 1 and go next
      component.stepValidStates[1] = true;
      component.goToNextStep();
      expect(component.currentStep).toBe(2);
    });

    it('should navigate back through all steps', () => {
      component.currentStep = 2;

      component.goToPreviousStep();
      expect(component.currentStep).toBe(1);

      component.goToPreviousStep();
      expect(component.currentStep).toBe(0);
    });

    it('should merge all step data on submit', fakeAsync(() => {
      spyOn(component.onSubmit, 'emit');

      component.currentStep = 2;
      component.stepValidStates = [true, true, true];
      component.basicInfoData = { field1: 'value1' };
      component.guaranteesData = { field2: 'value2' };
      component.documentsData = { field3: 'value3' };

      component.handleSubmit();
      tick(2000);

      expect(component.onSubmit.emit).toHaveBeenCalledWith({
        field1: 'value1',
        field2: 'value2',
        field3: 'value3'
      });
    }));
  });
});
