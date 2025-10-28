import { CommonModule } from '@angular/common';
import { Directive, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IconComponent, InputComponent } from '../../../../../../shared';
import { BasicInfoStepComponent } from './basic-info-step.component';

// Mock da MaskDirective para evitar dependência de NgModel interno
@Directive({
    selector: '[libMask]',
    standalone: true
})
class MockMaskDirective {
    @Input() libMask: string = '';
    @Input() dropSpecialCharacters: boolean = false;
}

describe('BasicInfoStepComponent', () => {
    let component: BasicInfoStepComponent;
    let fixture: ComponentFixture<BasicInfoStepComponent>;
    let compiled: HTMLElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BasicInfoStepComponent, FormsModule]
        })
            .overrideComponent(InputComponent, {
                set: {
                    imports: [CommonModule, IconComponent, ReactiveFormsModule, FormsModule, MockMaskDirective]
                }
            })
            .compileComponents();

        fixture = TestBed.createComponent(BasicInfoStepComponent);
        component = fixture.componentInstance;
        compiled = fixture.nativeElement;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize basicInfoForm with all fields', () => {
            expect(component.basicInfoForm).toBeDefined();
            expect(component.basicInfoForm.get('purpose')).toBeDefined();
            expect(component.basicInfoForm.get('operationType')).toBeDefined();
            expect(component.basicInfoForm.get('amount')).toBeDefined();
            expect(component.basicInfoForm.get('currency')).toBeDefined();
            expect(component.basicInfoForm.get('businessActivity')).toBeDefined();
            expect(component.basicInfoForm.get('country')).toBeDefined();
            expect(component.basicInfoForm.get('state')).toBeDefined();
            expect(component.basicInfoForm.get('city')).toBeDefined();
            expect(component.basicInfoForm.get('term')).toBeDefined();
            expect(component.basicInfoForm.get('paymentMethod')).toBeDefined();
            expect(component.basicInfoForm.get('gracePeriod')).toBeDefined();
        });

        it('should initialize with showRestOfForm as false', () => {
            expect(component.showRestOfForm).toBe(false);
        });

        it('should have currency field defaulting to BRL', () => {
            expect(component.basicInfoForm.get('currency')?.value).toBe('BRL');
        });

        it('should emit initial form validity on ngOnInit', () => {
            spyOn(component.formValid, 'emit');

            component.ngOnInit();

            expect(component.formValid.emit).toHaveBeenCalledWith(false);
        });
    });

    describe('Form Field Getters', () => {
        it('should have getter for purpose', () => {
            expect(component.purpose).toBe(component.basicInfoForm.get('purpose'));
        });

        it('should have getter for operationType', () => {
            expect(component.operationType).toBe(component.basicInfoForm.get('operationType'));
        });

        it('should have getter for amount', () => {
            expect(component.amount).toBe(component.basicInfoForm.get('amount'));
        });

        it('should have getter for currency', () => {
            expect(component.currency).toBe(component.basicInfoForm.get('currency'));
        });

        it('should have getter for businessActivity', () => {
            expect(component.businessActivity).toBe(component.basicInfoForm.get('businessActivity'));
        });

        it('should have getter for country', () => {
            expect(component.country).toBe(component.basicInfoForm.get('country'));
        });

        it('should have getter for state', () => {
            expect(component.state).toBe(component.basicInfoForm.get('state'));
        });

        it('should have getter for city', () => {
            expect(component.city).toBe(component.basicInfoForm.get('city'));
        });

        it('should have getter for term', () => {
            expect(component.term).toBe(component.basicInfoForm.get('term'));
        });

        it('should have getter for paymentMethod', () => {
            expect(component.paymentMethod).toBe(component.basicInfoForm.get('paymentMethod'));
        });

        it('should have getter for gracePeriod', () => {
            expect(component.gracePeriod).toBe(component.basicInfoForm.get('gracePeriod'));
        });
    });

    describe('Options Configuration', () => {
        it('should have operation type options', () => {
            expect(component.operationTypeOptions.length).toBe(3);
            expect(component.operationTypeOptions[0]).toEqual({ value: 'financing', label: 'Financiamento' });
            expect(component.operationTypeOptions[1]).toEqual({ value: 'credit', label: 'Crédito' });
            expect(component.operationTypeOptions[2]).toEqual({ value: 'investment', label: 'Investimento' });
        });

        it('should have currency options', () => {
            expect(component.currencyOptions.length).toBe(3);
            expect(component.currencyOptions[0]).toEqual({ value: 'BRL', label: 'Real (R$)' });
            expect(component.currencyOptions[1]).toEqual({ value: 'USD', label: 'Dólar (US$)' });
            expect(component.currencyOptions[2]).toEqual({ value: 'EUR', label: 'Euro (€)' });
        });

        it('should have business activity options', () => {
            expect(component.businessActivityOptions.length).toBe(3);
            expect(component.businessActivityOptions[0]).toEqual({ value: 'industry', label: 'Indústria' });
            expect(component.businessActivityOptions[1]).toEqual({ value: 'commerce', label: 'Comércio' });
            expect(component.businessActivityOptions[2]).toEqual({ value: 'services', label: 'Serviços' });
        });

        it('should have country options', () => {
            expect(component.countryOptions.length).toBe(3);
            expect(component.countryOptions[0]).toEqual({ value: 'BR', label: 'Brasil' });
        });

        it('should have state options', () => {
            expect(component.stateOptions.length).toBe(3);
            expect(component.stateOptions[0]).toEqual({ value: 'SP', label: 'São Paulo' });
        });

        it('should have city options', () => {
            expect(component.cityOptions.length).toBe(3);
            expect(component.cityOptions[0]).toEqual({ value: 'sao-paulo', label: 'São Paulo' });
        });

        it('should have payment method options', () => {
            expect(component.paymentMethodOptions.length).toBe(3);
            expect(component.paymentMethodOptions[0]).toEqual({ value: 'installments', label: 'Parcelado' });
            expect(component.paymentMethodOptions[1]).toEqual({ value: 'lump-sum', label: 'À vista' });
            expect(component.paymentMethodOptions[2]).toEqual({ value: 'mixed', label: 'Misto' });
        });
    });

    describe('Form Validation', () => {
        it('should be invalid when empty', () => {
            expect(component.basicInfoForm.valid).toBe(false);
        });

        it('should require purpose field', () => {
            const purpose = component.basicInfoForm.get('purpose');
            expect(purpose?.valid).toBe(false);
            expect(purpose?.hasError('required')).toBe(true);

            purpose?.setValue('Test purpose');
            expect(purpose?.hasError('required')).toBe(false);
        });

        it('should validate purpose maxLength', () => {
            const purpose = component.basicInfoForm.get('purpose');
            const longText = 'a'.repeat(501);

            purpose?.setValue(longText);
            expect(purpose?.hasError('maxlength')).toBe(true);

            purpose?.setValue('a'.repeat(500));
            expect(purpose?.hasError('maxlength')).toBe(false);
        });

        it('should require operationType field', () => {
            const operationType = component.basicInfoForm.get('operationType');
            expect(operationType?.hasError('required')).toBe(true);

            operationType?.setValue('financing');
            expect(operationType?.hasError('required')).toBe(false);
        });

        it('should require amount field', () => {
            const amount = component.basicInfoForm.get('amount');
            expect(amount?.hasError('required')).toBe(true);

            amount?.setValue('1000');
            expect(amount?.hasError('required')).toBe(false);
        });

        it('should validate term minimum value', () => {
            const term = component.basicInfoForm.get('term');

            term?.setValue(0);
            expect(term?.hasError('min')).toBe(true);

            term?.setValue(1);
            expect(term?.hasError('min')).toBe(false);
        });

        it('should validate gracePeriod minimum value', () => {
            const gracePeriod = component.basicInfoForm.get('gracePeriod');

            gracePeriod?.setValue(-1);
            expect(gracePeriod?.hasError('min')).toBe(true);

            gracePeriod?.setValue(0);
            expect(gracePeriod?.hasError('min')).toBe(false);
        });

        it('should be valid when all required fields are filled', () => {
            component.basicInfoForm.patchValue({
                purpose: 'Test purpose',
                operationType: 'financing',
                amount: '10000',
                currency: 'BRL',
                businessActivity: 'industry',
                country: 'BR',
                state: 'SP',
                city: 'sao-paulo',
                term: 12,
                paymentMethod: 'installments',
                gracePeriod: 0
            });

            expect(component.basicInfoForm.valid).toBe(true);
        });
    });

    describe('IdentifyOperation Method', () => {
        it('should show rest of form when purpose is valid', () => {
            component.basicInfoForm.get('purpose')?.setValue('Valid purpose');
            component.showRestOfForm = false;

            component.identifyOperation();

            expect(component.showRestOfForm).toBe(true);
        });

        it('should not show rest of form when purpose is invalid', () => {
            component.basicInfoForm.get('purpose')?.setValue('');
            component.showRestOfForm = false;

            component.identifyOperation();

            expect(component.showRestOfForm).toBe(false);
        });

        it('should mark purpose as touched when invalid', () => {
            component.basicInfoForm.get('purpose')?.setValue('');

            component.identifyOperation();

            expect(component.purpose?.touched).toBe(true);
        });
    });

    describe('Form Data Change Events', () => {
        it('should emit formDataChange when form values change', (done) => {
            component.formDataChange.subscribe((data) => {
                expect(data.purpose).toBe('New purpose');
                done();
            });

            component.basicInfoForm.patchValue({ purpose: 'New purpose' });
        });

        it('should emit formValid when form validity changes', () => {
            spyOn(component.formValid, 'emit');

            component.basicInfoForm.patchValue({ purpose: 'Test' });

            expect(component.formValid.emit).toHaveBeenCalledWith(false);
        });

        it('should emit true when form becomes valid', () => {
            spyOn(component.formValid, 'emit');

            component.basicInfoForm.patchValue({
                purpose: 'Test purpose',
                operationType: 'financing',
                amount: '10000',
                currency: 'BRL',
                businessActivity: 'industry',
                country: 'BR',
                state: 'SP',
                city: 'sao-paulo',
                term: 12,
                paymentMethod: 'installments',
                gracePeriod: 0
            });

            expect(component.formValid.emit).toHaveBeenCalledWith(true);
        });
    });

    describe('Form Data Input', () => {
        it('should patch form with input data on ngOnInit', () => {
            component.formData = {
                purpose: 'Existing purpose',
                operationType: 'credit',
                amount: '5000'
            };

            component.ngOnInit();

            expect(component.basicInfoForm.get('purpose')?.value).toBe('Existing purpose');
            expect(component.basicInfoForm.get('operationType')?.value).toBe('credit');
            expect(component.basicInfoForm.get('amount')?.value).toBe('5000');
        });

        it('should show rest of form if formData has purpose on ngOnInit', () => {
            component.formData = {
                purpose: 'Existing purpose'
            };

            component.ngOnInit();

            expect(component.showRestOfForm).toBe(true);
        });

        it('should not show rest of form if formData is empty on ngOnInit', () => {
            component.formData = {};

            component.ngOnInit();

            expect(component.showRestOfForm).toBe(false);
        });

        it('should not emit formDataChange when patching with emitEvent: false', () => {
            spyOn(component.formDataChange, 'emit');

            component.formData = {
                purpose: 'Test'
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

        it('should render purpose textarea', () => {
            const textarea = compiled.querySelector('ds-textarea[formControlName="purpose"]');
            expect(textarea).toBeTruthy();
        });

        it('should render identify operation button', () => {
            const content = compiled.textContent || '';
            expect(content).toContain('Identificar melhor operação');
        });

        it('should not show rest of form initially', () => {
            component.showRestOfForm = false;
            fixture.detectChanges();

            const operationTypeSelect = compiled.querySelector('ds-select[formControlName="operationType"]');
            expect(operationTypeSelect).toBeFalsy();
        });

        it('should show rest of form when showRestOfForm is true', () => {
            component.showRestOfForm = true;
            fixture.detectChanges();

            const operationTypeSelect = compiled.querySelector('ds-select[formControlName="operationType"]');
            expect(operationTypeSelect).toBeTruthy();
        });
    });

    describe('Integration Tests', () => {
        it('should complete full form flow', () => {
            // Start with empty form
            expect(component.basicInfoForm.valid).toBe(false);
            expect(component.showRestOfForm).toBe(false);

            // Fill purpose and identify operation
            component.basicInfoForm.get('purpose')?.setValue('My business needs financing');
            component.identifyOperation();
            expect(component.showRestOfForm).toBe(true);

            // Fill remaining fields
            component.basicInfoForm.patchValue({
                operationType: 'financing',
                amount: '50000',
                currency: 'BRL',
                businessActivity: 'commerce',
                country: 'BR',
                state: 'SP',
                city: 'sao-paulo',
                term: 24,
                paymentMethod: 'installments',
                gracePeriod: 3
            });

            // Verify form is valid
            expect(component.basicInfoForm.valid).toBe(true);
        });
    });
});

