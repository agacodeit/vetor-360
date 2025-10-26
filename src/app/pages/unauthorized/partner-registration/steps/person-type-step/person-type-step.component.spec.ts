import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PersonTypeStepComponent } from './person-type-step.component';

describe('PersonTypeStepComponent', () => {
    let component: PersonTypeStepComponent;
    let fixture: ComponentFixture<PersonTypeStepComponent>;
    let personTypeControl: FormControl;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PersonTypeStepComponent, ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PersonTypeStepComponent);
        component = fixture.componentInstance;

        // Create a mock person type control
        personTypeControl = new FormControl('');
        component.personTypeControl = personTypeControl;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with personTypeControl input', () => {
            expect(component.personTypeControl).toBeDefined();
            expect(component.personTypeControl).toBe(personTypeControl);
        });

        it('should have personTypeChange EventEmitter', () => {
            expect(component.personTypeChange).toBeDefined();
            expect(typeof component.personTypeChange.emit).toBe('function');
        });

        it('should initialize personTypeOptions with correct values', () => {
            expect(component.personTypeOptions).toBeDefined();
            expect(component.personTypeOptions.length).toBe(2);
            expect(component.personTypeOptions[0]).toEqual({ value: 'F', label: 'Pessoa física' });
            expect(component.personTypeOptions[1]).toEqual({ value: 'J', label: 'Pessoa jurídica' });
        });
    });

    describe('personTypeOptions Property', () => {
        it('should have correct structure for pessoa física option', () => {
            const pessoaFisicaOption = component.personTypeOptions[0];
            expect(pessoaFisicaOption.value).toBe('F');
            expect(pessoaFisicaOption.label).toBe('Pessoa física');
        });

        it('should have correct structure for pessoa jurídica option', () => {
            const pessoaJuridicaOption = component.personTypeOptions[1];
            expect(pessoaJuridicaOption.value).toBe('J');
            expect(pessoaJuridicaOption.label).toBe('Pessoa jurídica');
        });

        it('should have correct array length', () => {
            expect(component.personTypeOptions.length).toBe(2);
        });
    });

    describe('onPersonTypeChange Method', () => {
        it('should emit personTypeChange event with F value', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('F');

            expect(component.personTypeChange.emit).toHaveBeenCalledWith('F');
            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(1);
        });

        it('should emit personTypeChange event with J value', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('J');

            expect(component.personTypeChange.emit).toHaveBeenCalledWith('J');
            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(1);
        });

        it('should emit multiple times with different values', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');
            component.onPersonTypeChange('F');

            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(3);
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('F');
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('J');
        });

        it('should emit with exact same value passed', () => {
            spyOn(component.personTypeChange, 'emit');
            const testValue: 'F' | 'J' = 'F';

            component.onPersonTypeChange(testValue);

            expect(component.personTypeChange.emit).toHaveBeenCalledWith(testValue);
        });
    });

    describe('Input Properties', () => {
        it('should accept different personTypeControl instances', () => {
            const newControl = new FormControl('F');
            component.personTypeControl = newControl;

            expect(component.personTypeControl).toBe(newControl);
            expect(component.personTypeControl).not.toBe(personTypeControl);
        });

        it('should work with FormControl with initial value', () => {
            const controlWithValue = new FormControl('J');
            component.personTypeControl = controlWithValue;

            expect(component.personTypeControl.value).toBe('J');
        });

        it('should work with FormControl with validation', () => {
            const controlWithValidation = new FormControl('', { validators: [] });
            component.personTypeControl = controlWithValidation;

            expect(component.personTypeControl).toBe(controlWithValidation);
        });
    });

    describe('EventEmitter Integration', () => {
        it('should maintain EventEmitter state across multiple calls', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');

            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(2);
        });

        it('should work with EventEmitter subscription', () => {
            let emittedValue: 'F' | 'J' | undefined;
            component.personTypeChange.subscribe(value => {
                emittedValue = value;
            });

            component.onPersonTypeChange('F');
            expect(emittedValue).toBe('F');

            component.onPersonTypeChange('J');
            expect(emittedValue).toBe('J');
        });

        it('should support multiple subscribers', () => {
            let value1: 'F' | 'J' | undefined;
            let value2: 'F' | 'J' | undefined;

            component.personTypeChange.subscribe(value => value1 = value);
            component.personTypeChange.subscribe(value => value2 = value);

            component.onPersonTypeChange('F');

            expect(value1).toBe('F');
            expect(value2).toBe('F');
        });
    });

    describe('Type Safety', () => {
        it('should only accept F or J values', () => {
            spyOn(component.personTypeChange, 'emit');

            // These should work
            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');

            expect(component.personTypeChange.emit).toHaveBeenCalledWith('F');
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('J');
        });

        it('should have correct TypeScript types', () => {
            expect(component.personTypeChange).toBeDefined();
            expect(typeof component.onPersonTypeChange).toBe('function');
            expect(Array.isArray(component.personTypeOptions)).toBe(true);
        });
    });

    describe('Component State', () => {
        it('should maintain state between method calls', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('F');
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('F');

            component.onPersonTypeChange('J');
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('J');
        });

        it('should not modify personTypeOptions during operation', () => {
            const originalOptions = [...component.personTypeOptions];

            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');

            expect(component.personTypeOptions).toEqual(originalOptions);
        });
    });

    describe('Edge Cases', () => {
        it('should handle rapid successive calls', () => {
            spyOn(component.personTypeChange, 'emit');

            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');
            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');

            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(4);
        });

        it('should work with null personTypeControl', () => {
            component.personTypeControl = null as any;

            // Should not throw error when calling onPersonTypeChange
            expect(() => {
                component.onPersonTypeChange('F');
            }).not.toThrow();
        });

        it('should work with undefined personTypeControl', () => {
            component.personTypeControl = undefined as any;

            // Should not throw error when calling onPersonTypeChange
            expect(() => {
                component.onPersonTypeChange('J');
            }).not.toThrow();
        });
    });

    describe('Integration with FormControl', () => {
        it('should work with FormControl value changes', () => {
            const control = new FormControl('');
            component.personTypeControl = control;

            control.setValue('F');
            expect(component.personTypeControl.value).toBe('F');

            control.setValue('J');
            expect(component.personTypeControl.value).toBe('J');
        });

        it('should work with FormControl validation states', () => {
            const control = new FormControl('');
            component.personTypeControl = control;

            expect(component.personTypeControl.valid).toBe(true);
            expect(component.personTypeControl.invalid).toBe(false);
        });

        it('should work with FormControl disabled state', () => {
            const control = new FormControl({ value: 'F', disabled: true });
            component.personTypeControl = control;

            expect(component.personTypeControl.disabled).toBe(true);
        });
    });

    describe('Method Consistency', () => {
        it('should have consistent behavior across multiple calls', () => {
            spyOn(component.personTypeChange, 'emit');

            // Call multiple times with same value
            component.onPersonTypeChange('F');
            component.onPersonTypeChange('F');
            component.onPersonTypeChange('F');

            expect(component.personTypeChange.emit).toHaveBeenCalledTimes(3);
            expect(component.personTypeChange.emit).toHaveBeenCalledWith('F');
        });

        it('should maintain component state after method calls', () => {
            const originalOptions = component.personTypeOptions;
            const originalControl = component.personTypeControl;

            component.onPersonTypeChange('F');
            component.onPersonTypeChange('J');

            expect(component.personTypeOptions).toBe(originalOptions);
            expect(component.personTypeControl).toBe(originalControl);
        });
    });
});
