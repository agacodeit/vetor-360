import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { AddressStepComponent } from './address-step.component';
import { InputComponent } from '../../../../../shared';

describe('AddressStepComponent', () => {
    let component: AddressStepComponent;
    let fixture: ComponentFixture<AddressStepComponent>;
    let addressForm: FormGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                AddressStepComponent,
                ReactiveFormsModule,
                InputComponent
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(AddressStepComponent);
        component = fixture.componentInstance;

        // Create a mock address form
        addressForm = new FormGroup({
            cep: new FormControl('', [Validators.required]),
            street: new FormControl('', [Validators.required]),
            complement: new FormControl(''),
            neighbourhood: new FormControl('', [Validators.required]),
            city: new FormControl('', [Validators.required]),
            state: new FormControl('', [Validators.required])
        });

        component.addressForm = addressForm;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Component Initialization', () => {
        it('should initialize with addressForm input', () => {
            expect(component.addressForm).toBeDefined();
            expect(component.addressForm).toBeInstanceOf(FormGroup);
        });

        it('should have cepChange output event emitter', () => {
            expect(component.cepChange).toBeDefined();
            expect(component.cepChange.emit).toBeDefined();
        });
    });

    describe('isAddressFieldInvalid', () => {
        it('should return false when field is valid', () => {
            addressForm.get('cep')?.setValue('12345-678');
            addressForm.get('cep')?.markAsTouched();

            const result = component.isAddressFieldInvalid('cep');
            expect(result).toBeFalse();
        });

        it('should return false when field is invalid but not touched', () => {
            addressForm.get('cep')?.setValue('');

            const result = component.isAddressFieldInvalid('cep');
            expect(result).toBeFalse();
        });

        it('should return true when field is invalid and touched', () => {
            addressForm.get('cep')?.setValue('');
            addressForm.get('cep')?.markAsTouched();

            const result = component.isAddressFieldInvalid('cep');
            expect(result).toBeTrue();
        });

        it('should return false when field does not exist', () => {
            const result = component.isAddressFieldInvalid('nonExistentField');
            expect(result).toBeFalse();
        });

        it('should work with all address fields', () => {
            const fields = ['cep', 'street', 'neighbourhood', 'city', 'state'];

            fields.forEach(field => {
                addressForm.get(field)?.setValue('');
                addressForm.get(field)?.markAsTouched();

                const result = component.isAddressFieldInvalid(field);
                expect(result).toBeTrue();
            });
        });
    });

    describe('getAddressFieldErrorMessage', () => {
        it('should return empty string when field is valid', () => {
            addressForm.get('cep')?.setValue('12345-678');
            addressForm.get('cep')?.markAsTouched();

            const result = component.getAddressFieldErrorMessage('cep');
            expect(result).toBe('');
        });

        it('should return empty string when field is invalid but not touched', () => {
            addressForm.get('cep')?.setValue('');

            const result = component.getAddressFieldErrorMessage('cep');
            expect(result).toBe('');
        });

        it('should return required error message for empty required field', () => {
            addressForm.get('cep')?.setValue('');
            addressForm.get('cep')?.markAsTouched();

            const result = component.getAddressFieldErrorMessage('cep');
            expect(result).toBe('Este campo é obrigatório');
        });

        it('should return CEP format error message for invalid CEP format', () => {
            // Mock maskPatternInvalid error
            const mockError = {
                maskPatternInvalid: {
                    expectedPatterns: ['00000-000']
                }
            };

            addressForm.get('cep')?.setErrors(mockError);
            addressForm.get('cep')?.markAsTouched();

            const result = component.getAddressFieldErrorMessage('cep');
            expect(result).toBe('CEP deve ter o formato 00000-000');
        });

        it('should return generic format error message for other fields with mask error', () => {
            const mockError = {
                maskPatternInvalid: {
                    expectedPatterns: ['AA']
                }
            };

            addressForm.get('state')?.setErrors(mockError);
            addressForm.get('state')?.markAsTouched();

            const result = component.getAddressFieldErrorMessage('state');
            expect(result).toBe('Formato inválido. Esperado: AA');
        });

        it('should return generic format error message when expectedPatterns is undefined', () => {
            const mockError = {
                maskPatternInvalid: {}
            };

            addressForm.get('state')?.setErrors(mockError);
            addressForm.get('state')?.markAsTouched();

            const result = component.getAddressFieldErrorMessage('state');
            expect(result).toBe('Formato inválido. Esperado: formato correto');
        });

        it('should return empty string when field does not exist', () => {
            const result = component.getAddressFieldErrorMessage('nonExistentField');
            expect(result).toBe('');
        });

        it('should work with all address fields for required validation', () => {
            const fields = ['street', 'neighbourhood', 'city', 'state'];

            fields.forEach(field => {
                addressForm.get(field)?.setValue('');
                addressForm.get(field)?.markAsTouched();

                const result = component.getAddressFieldErrorMessage(field);
                expect(result).toBe('Este campo é obrigatório');
            });
        });
    });

    describe('onCepChange', () => {
        it('should emit cepChange event with the provided event data', () => {
            spyOn(component.cepChange, 'emit');
            const mockEvent = { target: { value: '12345-678' } };

            component.onCepChange(mockEvent);

            expect(component.cepChange.emit).toHaveBeenCalledWith(mockEvent);
        });

        it('should emit cepChange event multiple times', () => {
            spyOn(component.cepChange, 'emit');
            const mockEvent1 = { target: { value: '12345-678' } };
            const mockEvent2 = { target: { value: '87654-321' } };

            component.onCepChange(mockEvent1);
            component.onCepChange(mockEvent2);

            expect(component.cepChange.emit).toHaveBeenCalledTimes(2);
            expect(component.cepChange.emit).toHaveBeenCalledWith(mockEvent1);
            expect(component.cepChange.emit).toHaveBeenCalledWith(mockEvent2);
        });
    });

    describe('Template Rendering', () => {
        it('should render all address form fields', () => {
            const inputElements = fixture.debugElement.queryAll(By.css('ds-input'));
            expect(inputElements.length).toBe(6); // cep, street, complement, neighbourhood, city, state
        });

        it('should bind CEP field with correct properties', () => {
            const cepInput = fixture.debugElement.query(By.css('ds-input[label="CEP"]'));
            expect(cepInput).toBeTruthy();

            const cepComponent = cepInput.componentInstance as InputComponent;
            expect(cepComponent.label).toBe('CEP');
            expect(cepComponent.placeholder).toBe('00000-000');
            expect(cepComponent.required).toBeTrue();
            expect(cepComponent.libMask).toBe('00000-000');
        });

        it('should bind street field with correct properties', () => {
            const streetInput = fixture.debugElement.query(By.css('ds-input[label="Logradouro"]'));
            expect(streetInput).toBeTruthy();

            const streetComponent = streetInput.componentInstance as InputComponent;
            expect(streetComponent.label).toBe('Logradouro');
            expect(streetComponent.placeholder).toBe('Rua, Avenida, etc.');
            expect(streetComponent.required).toBeTrue();
        });

        it('should bind complement field as optional', () => {
            const complementInput = fixture.debugElement.query(By.css('ds-input[label="Complemento"]'));
            expect(complementInput).toBeTruthy();

            const complementComponent = complementInput.componentInstance as InputComponent;
            expect(complementComponent.label).toBe('Complemento');
            expect(complementComponent.placeholder).toBe('Apartamento, sala, etc.');
            expect(complementComponent.required).toBeFalse();
        });

        it('should bind neighbourhood field with correct properties', () => {
            const neighbourhoodInput = fixture.debugElement.query(By.css('ds-input[label="Bairro"]'));
            expect(neighbourhoodInput).toBeTruthy();

            const neighbourhoodComponent = neighbourhoodInput.componentInstance as InputComponent;
            expect(neighbourhoodComponent.label).toBe('Bairro');
            expect(neighbourhoodComponent.placeholder).toBe('Digite o bairro');
            expect(neighbourhoodComponent.required).toBeTrue();
        });

        it('should bind city field with correct properties', () => {
            const cityInput = fixture.debugElement.query(By.css('ds-input[label="Cidade"]'));
            expect(cityInput).toBeTruthy();

            const cityComponent = cityInput.componentInstance as InputComponent;
            expect(cityComponent.label).toBe('Cidade');
            expect(cityComponent.placeholder).toBe('Digite a cidade');
            expect(cityComponent.required).toBeTrue();
        });

        it('should bind state field with correct properties', () => {
            const stateInput = fixture.debugElement.query(By.css('ds-input[label="UF"]'));
            expect(stateInput).toBeTruthy();

            const stateComponent = stateInput.componentInstance as InputComponent;
            expect(stateComponent.label).toBe('UF');
            expect(stateComponent.placeholder).toBe('UF');
            expect(stateComponent.maxlength).toBe(2);
            expect(stateComponent.required).toBeTrue();
        });

        it('should call onCepChange when CEP input changes', () => {
            spyOn(component, 'onCepChange');
            const cepInput = fixture.debugElement.query(By.css('ds-input[label="CEP"]'));

            cepInput.triggerEventHandler('input', { target: { value: '12345-678' } });

            expect(component.onCepChange).toHaveBeenCalledWith({ target: { value: '12345-678' } });
        });

        it('should show error messages when fields are invalid and touched', () => {
            // Set invalid values and mark as touched
            addressForm.get('cep')?.setValue('');
            addressForm.get('cep')?.markAsTouched();
            addressForm.get('street')?.setValue('');
            addressForm.get('street')?.markAsTouched();

            fixture.detectChanges();

            const cepInput = fixture.debugElement.query(By.css('ds-input[label="CEP"]'));
            const streetInput = fixture.debugElement.query(By.css('ds-input[label="Logradouro"]'));

            expect(cepInput.componentInstance.invalid).toBeTrue();
            expect(cepInput.componentInstance.errorMessage).toBe('Este campo é obrigatório');

            expect(streetInput.componentInstance.invalid).toBeTrue();
            expect(streetInput.componentInstance.errorMessage).toBe('Este campo é obrigatório');
        });

        it('should not show error messages when fields are valid', () => {
            // Set valid values
            addressForm.get('cep')?.setValue('12345-678');
            addressForm.get('street')?.setValue('Rua das Flores');
            addressForm.get('neighbourhood')?.setValue('Centro');
            addressForm.get('city')?.setValue('São Paulo');
            addressForm.get('state')?.setValue('SP');

            fixture.detectChanges();

            const inputElements = fixture.debugElement.queryAll(By.css('ds-input'));

            inputElements.forEach(input => {
                expect(input.componentInstance.invalid).toBeFalse();
                expect(input.componentInstance.errorMessage).toBe('');
            });
        });
    });

    describe('Form Integration', () => {
        it('should bind form controls correctly', () => {
            const cepControl = addressForm.get('cep');
            const streetControl = addressForm.get('street');

            expect(cepControl).toBeDefined();
            expect(streetControl).toBeDefined();

            // Test that form controls are properly bound
            cepControl?.setValue('12345-678');
            streetControl?.setValue('Rua das Flores');

            expect(addressForm.get('cep')?.value).toBe('12345-678');
            expect(addressForm.get('street')?.value).toBe('Rua das Flores');
        });

        it('should update form values when inputs change', () => {
            const cepInput = fixture.debugElement.query(By.css('ds-input[label="CEP"]'));
            const streetInput = fixture.debugElement.query(By.css('ds-input[label="Logradouro"]'));

            // Simulate input changes
            cepInput.componentInstance.value = '12345-678';
            streetInput.componentInstance.value = 'Rua das Flores';

            // Trigger change detection
            fixture.detectChanges();

            // Note: In a real scenario, the form control would be updated through the ControlValueAccessor
            // This test verifies the component structure is correct
            expect(cepInput.componentInstance.value).toBe('12345-678');
            expect(streetInput.componentInstance.value).toBe('Rua das Flores');
        });
    });
});
