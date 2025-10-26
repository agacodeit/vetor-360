import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { PasswordStepComponent } from './password-step.component';

describe('PasswordStepComponent', () => {
    let component: PasswordStepComponent;
    let fixture: ComponentFixture<PasswordStepComponent>;
    let passwordForm: FormGroup;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PasswordStepComponent, ReactiveFormsModule],
            schemas: [NO_ERRORS_SCHEMA]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PasswordStepComponent);
        component = fixture.componentInstance;

        // Create a mock password form
        const fb = new FormBuilder();
        passwordForm = fb.group({
            password: ['', [Validators.required, Validators.minLength(6)]],
            confirmPassword: ['', [Validators.required]]
        });

        component.passwordForm = passwordForm;
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with passwordForm input', () => {
            expect(component.passwordForm).toBeDefined();
            expect(component.passwordForm).toBe(passwordForm);
        });
    });

    describe('isFieldInvalid Method', () => {
        it('should return false when field is valid', () => {
            passwordForm.patchValue({ password: 'validpassword123' });
            passwordForm.get('password')?.markAsTouched();

            expect(component.isFieldInvalid('password')).toBe(false);
        });

        it('should return true when field is invalid and touched', () => {
            passwordForm.patchValue({ password: '' });
            passwordForm.get('password')?.markAsTouched();

            expect(component.isFieldInvalid('password')).toBe(true);
        });

        it('should return false when field is invalid but not touched', () => {
            passwordForm.patchValue({ password: '' });
            // Don't mark as touched

            expect(component.isFieldInvalid('password')).toBe(false);
        });

        it('should return false when field does not exist', () => {
            expect(component.isFieldInvalid('nonexistent')).toBe(false);
        });

        it('should return true for confirmPassword when invalid and touched', () => {
            passwordForm.patchValue({ confirmPassword: '' });
            passwordForm.get('confirmPassword')?.markAsTouched();

            expect(component.isFieldInvalid('confirmPassword')).toBe(true);
        });

        it('should return false for confirmPassword when valid and touched', () => {
            passwordForm.patchValue({ confirmPassword: 'validpassword123' });
            passwordForm.get('confirmPassword')?.markAsTouched();

            expect(component.isFieldInvalid('confirmPassword')).toBe(false);
        });
    });

    describe('getFieldErrorMessage Method', () => {
        describe('Required Field Validation', () => {
            it('should return required error message for password', () => {
                passwordForm.patchValue({ password: '' });
                passwordForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('Este campo é obrigatório');
            });

            it('should return required error message for confirmPassword', () => {
                passwordForm.patchValue({ confirmPassword: '' });
                passwordForm.get('confirmPassword')?.markAsTouched();

                expect(component.getFieldErrorMessage('confirmPassword')).toBe('Este campo é obrigatório');
            });
        });

        describe('MinLength Validation', () => {
            it('should return minlength error message for password', () => {
                passwordForm.patchValue({ password: '123' });
                passwordForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('Mínimo de 6 caracteres');
            });

            it('should return minlength error message with correct length', () => {
                // Create form with different minlength
                const fb = new FormBuilder();
                const customForm = fb.group({
                    password: ['', [Validators.required, Validators.minLength(8)]],
                    confirmPassword: ['', [Validators.required]]
                });
                component.passwordForm = customForm;

                customForm.patchValue({ password: '123' });
                customForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('Mínimo de 8 caracteres');
            });
        });

        describe('Password Mismatch Validation', () => {
            it('should return passwordMismatch error message', () => {
                // Simulate password mismatch error
                passwordForm.get('confirmPassword')?.setErrors({ passwordMismatch: true });
                passwordForm.get('confirmPassword')?.markAsTouched();

                expect(component.getFieldErrorMessage('confirmPassword')).toBe('As senhas não coincidem');
            });

            it('should prioritize required over passwordMismatch error', () => {
                passwordForm.patchValue({ confirmPassword: '' });
                passwordForm.get('confirmPassword')?.setErrors({
                    required: true,
                    passwordMismatch: true
                });
                passwordForm.get('confirmPassword')?.markAsTouched();

                expect(component.getFieldErrorMessage('confirmPassword')).toBe('Este campo é obrigatório');
            });
        });

        describe('Error Message Priority', () => {
            it('should return required error when only required error exists', () => {
                passwordForm.patchValue({ password: '' });
                passwordForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('Este campo é obrigatório');
            });

            it('should return minlength error when both required and minlength errors exist', () => {
                passwordForm.patchValue({ password: '123' });
                passwordForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('Mínimo de 6 caracteres');
            });

            it('should return required error when all errors exist (required has priority)', () => {
                passwordForm.patchValue({ confirmPassword: '123' });
                passwordForm.get('confirmPassword')?.setErrors({
                    required: true,
                    minlength: { requiredLength: 6 },
                    passwordMismatch: true
                });
                passwordForm.get('confirmPassword')?.markAsTouched();

                expect(component.getFieldErrorMessage('confirmPassword')).toBe('Este campo é obrigatório');
            });
        });

        describe('No Error Cases', () => {
            it('should return empty string when field is valid', () => {
                passwordForm.patchValue({ password: 'validpassword123' });
                passwordForm.get('password')?.markAsTouched();

                expect(component.getFieldErrorMessage('password')).toBe('');
            });

            it('should return empty string when field is invalid but not touched', () => {
                passwordForm.patchValue({ password: '' });
                // Don't mark as touched

                expect(component.getFieldErrorMessage('password')).toBe('');
            });

            it('should return empty string when field does not exist', () => {
                expect(component.getFieldErrorMessage('nonexistent')).toBe('');
            });

            it('should throw error when passwordForm is null', () => {
                component.passwordForm = null as any;
                expect(() => component.getFieldErrorMessage('password')).toThrow();
            });
        });

        describe('Edge Cases', () => {
            it('should handle undefined errors object', () => {
                const control = passwordForm.get('password');
                if (control) {
                    Object.defineProperty(control, 'errors', { value: undefined });
                    control.markAsTouched();

                    expect(component.getFieldErrorMessage('password')).toBe('');
                }
            });

            it('should handle null errors object', () => {
                const control = passwordForm.get('password');
                if (control) {
                    Object.defineProperty(control, 'errors', { value: null });
                    control.markAsTouched();

                    expect(component.getFieldErrorMessage('password')).toBe('');
                }
            });

            it('should handle empty errors object', () => {
                const control = passwordForm.get('password');
                if (control) {
                    Object.defineProperty(control, 'errors', { value: {} });
                    control.markAsTouched();

                    expect(component.getFieldErrorMessage('password')).toBe('');
                }
            });
        });
    });

    describe('Form Integration', () => {
        it('should work with different form configurations', () => {
            const fb = new FormBuilder();
            const customForm = fb.group({
                password: ['', [Validators.required, Validators.minLength(10)]],
                confirmPassword: ['', [Validators.required]]
            });

            component.passwordForm = customForm;

            customForm.patchValue({ password: '123' });
            customForm.get('password')?.markAsTouched();

            expect(component.isFieldInvalid('password')).toBe(true);
            expect(component.getFieldErrorMessage('password')).toBe('Mínimo de 10 caracteres');
        });

        it('should handle form state changes', () => {
            // Initially valid
            passwordForm.patchValue({ password: 'validpassword123' });
            passwordForm.get('password')?.markAsTouched();
            expect(component.isFieldInvalid('password')).toBe(false);

            // Make invalid
            passwordForm.patchValue({ password: '' });
            expect(component.isFieldInvalid('password')).toBe(true);
            expect(component.getFieldErrorMessage('password')).toBe('Este campo é obrigatório');

            // Make valid again
            passwordForm.patchValue({ password: 'newvalidpassword123' });
            expect(component.isFieldInvalid('password')).toBe(false);
            expect(component.getFieldErrorMessage('password')).toBe('');
        });

        it('should handle multiple field validations simultaneously', () => {
            passwordForm.patchValue({
                password: '123',
                confirmPassword: ''
            });
            passwordForm.get('password')?.markAsTouched();
            passwordForm.get('confirmPassword')?.markAsTouched();

            expect(component.isFieldInvalid('password')).toBe(true);
            expect(component.isFieldInvalid('confirmPassword')).toBe(true);
            expect(component.getFieldErrorMessage('password')).toBe('Mínimo de 6 caracteres');
            expect(component.getFieldErrorMessage('confirmPassword')).toBe('Este campo é obrigatório');
        });
    });

    describe('Method Consistency', () => {
        it('should have consistent behavior between isFieldInvalid and getFieldErrorMessage', () => {
            passwordForm.patchValue({ password: '' });
            passwordForm.get('password')?.markAsTouched();

            const isInvalid = component.isFieldInvalid('password');
            const errorMessage = component.getFieldErrorMessage('password');

            expect(isInvalid).toBe(true);
            expect(errorMessage).toBeTruthy();
            expect(errorMessage).toBe('Este campo é obrigatório');
        });

        it('should return empty error message when field is not invalid', () => {
            passwordForm.patchValue({ password: 'validpassword123' });
            passwordForm.get('password')?.markAsTouched();

            const isInvalid = component.isFieldInvalid('password');
            const errorMessage = component.getFieldErrorMessage('password');

            expect(isInvalid).toBe(false);
            expect(errorMessage).toBe('');
        });
    });

    describe('Input Property', () => {
        it('should accept different passwordForm instances', () => {
            const fb = new FormBuilder();
            const newForm = fb.group({
                password: ['', [Validators.required]],
                confirmPassword: ['', [Validators.required]]
            });

            component.passwordForm = newForm;

            expect(component.passwordForm).toBe(newForm);
            expect(component.passwordForm).not.toBe(passwordForm);
        });

        it('should handle passwordForm with different field names', () => {
            const fb = new FormBuilder();
            const customForm = fb.group({
                userPassword: ['', [Validators.required]],
                userConfirmPassword: ['', [Validators.required]]
            });

            component.passwordForm = customForm;

            expect(component.isFieldInvalid('userPassword')).toBe(false);
            expect(component.getFieldErrorMessage('userPassword')).toBe('');
        });
    });
});
