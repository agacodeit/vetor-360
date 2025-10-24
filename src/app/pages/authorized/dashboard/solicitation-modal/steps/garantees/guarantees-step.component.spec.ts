import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuaranteesStepComponent } from './guarantees-step.component';

describe('GuaranteesStepComponent', () => {
    let component: GuaranteesStepComponent;
    let fixture: ComponentFixture<GuaranteesStepComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [GuaranteesStepComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GuaranteesStepComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize guaranteesForm', () => {
            expect(component.guaranteesForm).toBeDefined();
            expect(component.guaranteesForm.get('guarantees')).toBeDefined();
        });

        it('should emit initial form validity on ngOnInit', () => {
            spyOn(component.formValid, 'emit');

            component.ngOnInit();

            expect(component.formValid.emit).toHaveBeenCalledWith(false);
        });
    });

    describe('Form Field Getters', () => {
        it('should have getter for guarantees', () => {
            expect(component.guarantees).toBe(component.guaranteesForm.get('guarantees'));
        });
    });

    describe('Form Validation', () => {
        it('should be invalid when empty', () => {
            expect(component.guaranteesForm.valid).toBe(false);
        });

        it('should require guarantees field', () => {
            const guarantees = component.guaranteesForm.get('guarantees');
            expect(guarantees?.valid).toBe(false);
            expect(guarantees?.hasError('required')).toBe(true);

            guarantees?.setValue('Real estate property');
            expect(guarantees?.hasError('required')).toBe(false);
        });

        it('should validate guarantees maxLength', () => {
            const guarantees = component.guaranteesForm.get('guarantees');
            const longText = 'a'.repeat(1001);

            guarantees?.setValue(longText);
            expect(guarantees?.hasError('maxlength')).toBe(true);

            guarantees?.setValue('a'.repeat(1000));
            expect(guarantees?.hasError('maxlength')).toBe(false);
        });

        it('should be valid when guarantees field is properly filled', () => {
            component.guaranteesForm.patchValue({
                guarantees: 'Property located at Main Street, value $500,000'
            });

            expect(component.guaranteesForm.valid).toBe(true);
        });
    });

    describe('Form Data Change Events', () => {
        it('should emit formDataChange when form values change', (done) => {
            component.formDataChange.subscribe((data) => {
                expect(data.guarantees).toBe('New guarantee');
                done();
            });

            component.guaranteesForm.patchValue({ guarantees: 'New guarantee' });
        });

        it('should emit formValid as false when form is invalid', () => {
            spyOn(component.formValid, 'emit');

            component.guaranteesForm.patchValue({ guarantees: '' });

            expect(component.formValid.emit).toHaveBeenCalledWith(false);
        });

        it('should emit formValid as true when form becomes valid', () => {
            spyOn(component.formValid, 'emit');

            component.guaranteesForm.patchValue({
                guarantees: 'Valid guarantee description'
            });

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('Form Data Input', () => {
        it('should patch form with input data on ngOnInit', () => {
            component.formData = {
                guarantees: 'Existing guarantee'
            };

            component.ngOnInit();

            expect(component.guaranteesForm.get('guarantees')?.value).toBe('Existing guarantee');
        });

        it('should handle empty formData on ngOnInit', () => {
            component.formData = {};

            component.ngOnInit();

            expect(component.guaranteesForm.get('guarantees')?.value).toBe('');
        });

        it('should not emit formDataChange when patching with emitEvent: false', () => {
            spyOn(component.formDataChange, 'emit');

            component.formData = {
                guarantees: 'Test guarantee'
            };

            component.ngOnInit();

            expect(component.formDataChange.emit).not.toHaveBeenCalled();
        });
    });

    describe('Template Rendering', () => {
        it('should render form element', () => {
            const form = compiled.querySelector('form');
            expect(form).toBeTruthy();
        });

        it('should render textarea with correct label and placeholder', () => {
            const textarea = compiled.querySelector('ds-textarea[formControlName="guarantees"]');
            expect(textarea).toBeTruthy();

            // Check if the textarea has the correct label and placeholder attributes
            expect(textarea?.getAttribute('label')).toBe('Garantias');
            expect(textarea?.getAttribute('placeholder')).toContain('Descreva as garantias oferecidas para esta solicitação');
        });

        it('should render guarantees textarea', () => {
            const textarea = compiled.querySelector('ds-textarea[formControlName="guarantees"]');
            expect(textarea).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should complete full form flow', () => {
            // Start with empty form
            expect(component.guaranteesForm.valid).toBe(false);

            // Fill guarantees field
            component.guaranteesForm.patchValue({
                guarantees: 'Property: 123 Main St, Estimated value: $500,000. Additional guarantee: Vehicle 2020 Model X'
            });

            // Verify form is valid
            expect(component.guaranteesForm.valid).toBe(true);
            expect(component.guarantees?.value).toContain('Property');
            expect(component.guarantees?.value).toContain('Vehicle');
        });

        it('should reject text exceeding maximum length', () => {
            const longText = 'a'.repeat(1001);

            component.guaranteesForm.patchValue({
                guarantees: longText
            });

            expect(component.guaranteesForm.valid).toBe(false);
            expect(component.guarantees?.hasError('maxlength')).toBe(true);
        });

        it('should accept text at maximum length', () => {
            const maxText = 'a'.repeat(1000);

            component.guaranteesForm.patchValue({
                guarantees: maxText
            });

            expect(component.guaranteesForm.valid).toBe(true);
            expect(component.guarantees?.hasError('maxlength')).toBe(false);
        });
    });
});

