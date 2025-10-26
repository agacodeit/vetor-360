import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { BasicInfoStepComponent } from './basic-info-step.component';

describe('BasicInfoStepComponent', () => {
    let component: BasicInfoStepComponent;
    let fixture: ComponentFixture<BasicInfoStepComponent>;
    let basicInfoForm: FormGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [BasicInfoStepComponent, ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(BasicInfoStepComponent);
        component = fixture.componentInstance;

        // Setup form
        const fb = new FormBuilder();
        basicInfoForm = fb.group({
            name: ['', Validators.required],
            cpfCnpj: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            cellphone: ['', Validators.required],
            responsibleCompanyName: [''],
            comercialPhone: ['']
        });

        component.basicInfoForm = basicInfoForm;
        component.isPersonFisica = true;
        component.isPersonJuridica = false;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with required inputs', () => {
            expect(component.basicInfoForm).toBeDefined();
            expect(component.isPersonFisica).toBe(true);
            expect(component.isPersonJuridica).toBe(false);
        });
    });

    describe('Form Validation Methods', () => {
        describe('isFieldInvalid', () => {
            it('should return false when field is valid', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('João Silva');
                nameControl?.markAsTouched();

                expect(component.isFieldInvalid('name')).toBe(false);
            });

            it('should return true when field is invalid and touched', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('');
                nameControl?.markAsTouched();

                expect(component.isFieldInvalid('name')).toBe(true);
            });

            it('should return false when field is invalid but not touched', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('');

                expect(component.isFieldInvalid('name')).toBe(false);
            });

            it('should return false when field does not exist', () => {
                expect(component.isFieldInvalid('nonExistentField')).toBe(false);
            });
        });

        describe('getFieldErrorMessage', () => {
            it('should return empty string when field is valid', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('João Silva');
                nameControl?.markAsTouched();

                expect(component.getFieldErrorMessage('name')).toBe('');
            });

            it('should return empty string when field is invalid but not touched', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('');

                expect(component.getFieldErrorMessage('name')).toBe('');
            });

            it('should return required error message', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValue('');
                nameControl?.markAsTouched();

                expect(component.getFieldErrorMessage('name')).toBe('Este campo é obrigatório');
            });

            it('should return email error message', () => {
                const emailControl = basicInfoForm.get('email');
                emailControl?.setValue('invalid-email');
                emailControl?.markAsTouched();

                expect(component.getFieldErrorMessage('email')).toBe('E-mail inválido');
            });

            it('should return minlength error message', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setValidators([Validators.required, Validators.minLength(5)]);
                nameControl?.setValue('João');
                nameControl?.markAsTouched();

                expect(component.getFieldErrorMessage('name')).toBe('Mínimo de 5 caracteres');
            });

            it('should return CPF mask error message for pessoa física', () => {
                component.isPersonFisica = true;
                component.isPersonJuridica = false;

                const cpfControl = basicInfoForm.get('cpfCnpj');
                cpfControl?.setErrors({ maskPatternInvalid: { expectedPatterns: ['000.000.000-00'] } });
                cpfControl?.markAsTouched();

                expect(component.getFieldErrorMessage('cpfCnpj')).toBe('CPF deve ter o formato 000.000.000-00');
            });

            it('should return CNPJ mask error message for pessoa jurídica', () => {
                component.isPersonFisica = false;
                component.isPersonJuridica = true;

                const cnpjControl = basicInfoForm.get('cpfCnpj');
                cnpjControl?.setErrors({ maskPatternInvalid: { expectedPatterns: ['00.000.000/0000-00'] } });
                cnpjControl?.markAsTouched();

                expect(component.getFieldErrorMessage('cpfCnpj')).toBe('CNPJ deve ter o formato 00.000.000/0000-00');
            });

            it('should return cellphone mask error message', () => {
                const cellphoneControl = basicInfoForm.get('cellphone');
                cellphoneControl?.setErrors({ maskPatternInvalid: { expectedPatterns: ['(00) 00000-0000'] } });
                cellphoneControl?.markAsTouched();

                expect(component.getFieldErrorMessage('cellphone')).toBe('Celular deve ter o formato (00) 00000-0000');
            });

            it('should return comercial phone mask error message', () => {
                const comercialPhoneControl = basicInfoForm.get('comercialPhone');
                comercialPhoneControl?.setErrors({ maskPatternInvalid: { expectedPatterns: ['(00) 0000-0000'] } });
                comercialPhoneControl?.markAsTouched();

                expect(component.getFieldErrorMessage('comercialPhone')).toBe('Telefone deve ter o formato (00) 0000-0000');
            });

            it('should return generic mask error message for unknown field', () => {
                const nameControl = basicInfoForm.get('name');
                nameControl?.setErrors({ maskPatternInvalid: { expectedPatterns: ['unknown-pattern'] } });
                nameControl?.markAsTouched();

                expect(component.getFieldErrorMessage('name')).toBe('Formato inválido. Esperado: unknown-pattern');
            });

            it('should return empty string when field does not exist', () => {
                expect(component.getFieldErrorMessage('nonExistentField')).toBe('');
            });
        });
    });

});
