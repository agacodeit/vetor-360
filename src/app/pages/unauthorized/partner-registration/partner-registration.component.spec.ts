import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PartnerRegistrationComponent } from './partner-registration.component';
import { ToastService } from '../../../../shared/services/toast/toast.service';
import { PartnerRegistrationService } from '../../../../shared/services/partner-registration/partner-registration.service';

describe('PartnerRegistrationComponent', () => {
    let component: PartnerRegistrationComponent;
    let fixture: ComponentFixture<PartnerRegistrationComponent>;
    let mockRouter: jasmine.SpyObj<Router>;
    let mockToastService: jasmine.SpyObj<ToastService>;
    let mockPartnerRegistrationService: jasmine.SpyObj<PartnerRegistrationService>;

    beforeEach(async () => {
        const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        const toastSpy = jasmine.createSpyObj('ToastService', ['success', 'error']);
        const partnerServiceSpy = jasmine.createSpyObj('PartnerRegistrationService', [
            'createPartner', 'getCepInfo', 'validateCpf', 'validateCnpj', 'formatDataForApi'
        ]);

        await TestBed.configureTestingModule({
            imports: [PartnerRegistrationComponent, ReactiveFormsModule],
            providers: [
                { provide: Router, useValue: routerSpy },
                { provide: ToastService, useValue: toastSpy },
                { provide: PartnerRegistrationService, useValue: partnerServiceSpy }
            ]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PartnerRegistrationComponent);
        component = fixture.componentInstance;
        mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        mockToastService = TestBed.inject(ToastService) as jasmine.SpyObj<ToastService>;
        mockPartnerRegistrationService = TestBed.inject(PartnerRegistrationService) as jasmine.SpyObj<PartnerRegistrationService>;
        fixture.detectChanges();
    });

    describe('Component Initialization', () => {
        it('should create', () => {
            expect(component).toBeTruthy();
        });

        it('should initialize with step 0', () => {
            expect(component.currentStep).toBe(0);
        });

        it('should have 5 steps configured', () => {
            expect(component.steps.length).toBe(5);
            expect(component.steps[0].id).toBe('person-type');
            expect(component.steps[1].id).toBe('basic-info');
            expect(component.steps[2].id).toBe('address');
            expect(component.steps[3].id).toBe('documents');
            expect(component.steps[4].id).toBe('password');
        });

        it('should initialize form with required validators', () => {
            expect(component.registrationForm.get('personType')?.hasError('required')).toBe(true);
            expect(component.registrationForm.get('name')?.hasError('required')).toBe(true);
            expect(component.registrationForm.get('cpfCnpj')?.hasError('required')).toBe(true);
            expect(component.registrationForm.get('email')?.hasError('required')).toBe(true);
            expect(component.registrationForm.get('cellphone')?.hasError('required')).toBe(true);
        });
    });

    describe('Person Type Selection', () => {
        it('should update personType when selecting pessoa física', () => {
            component.onPersonTypeChange('F');
            expect(component.registrationForm.get('personType')?.value).toBe('F');
            expect(component.isPersonFisica).toBe(true);
            expect(component.isPersonJuridica).toBe(false);
        });

        it('should update personType when selecting pessoa jurídica', () => {
            component.onPersonTypeChange('J');
            expect(component.registrationForm.get('personType')?.value).toBe('J');
            expect(component.isPersonFisica).toBe(false);
            expect(component.isPersonJuridica).toBe(true);
        });

        it('should clear specific fields when switching to pessoa física', () => {
            component.registrationForm.patchValue({
                personType: 'J',
                comercialPhone: '123456789',
                responsibleCompanyName: 'Test Company'
            });

            component.onPersonTypeChange('F');

            expect(component.registrationForm.get('comercialPhone')?.value).toBe('');
            expect(component.registrationForm.get('responsibleCompanyName')?.value).toBe('');
        });
    });

    describe('Step Navigation', () => {
        it('should allow next step when person type is selected', () => {
            component.onPersonTypeChange('F');
            expect(component.canGoNext).toBe(true);
        });

        it('should not allow next step when person type is not selected', () => {
            expect(component.canGoNext).toBe(false);
        });

        it('should not allow back on first step', () => {
            expect(component.canGoBack).toBe(false);
        });

        it('should allow back on subsequent steps', () => {
            component.currentStep = 1;
            expect(component.canGoBack).toBe(true);
        });

        it('should advance to next step', () => {
            component.onPersonTypeChange('F');
            component.nextStep();
            expect(component.currentStep).toBe(1);
        });

        it('should go back to previous step', () => {
            component.currentStep = 1;
            component.previousStep();
            expect(component.currentStep).toBe(0);
        });

        it('should update step status when advancing', () => {
            component.onPersonTypeChange('F');
            component.nextStep();
            expect(component.steps[0].completed).toBe(true);
        });
    });

    describe('Form Validation', () => {
        it('should validate email format', () => {
            const emailControl = component.registrationForm.get('email');
            emailControl?.setValue('invalid-email');
            expect(emailControl?.hasError('email')).toBe(true);

            emailControl?.setValue('valid@email.com');
            expect(emailControl?.hasError('email')).toBe(false);
        });

        it('should validate password minimum length', () => {
            const passwordControl = component.registrationForm.get('password');
            passwordControl?.setValue('123');
            expect(passwordControl?.hasError('minlength')).toBe(true);

            passwordControl?.setValue('12345678');
            expect(passwordControl?.hasError('minlength')).toBe(false);
        });

        it('should validate password confirmation match', () => {
            component.registrationForm.patchValue({
                password: 'password123',
                confirmPassword: 'different123'
            });

            const confirmPasswordControl = component.registrationForm.get('confirmPassword');
            expect(confirmPasswordControl?.hasError('passwordMismatch')).toBe(true);

            component.registrationForm.patchValue({
                confirmPassword: 'password123'
            });

            expect(confirmPasswordControl?.hasError('passwordMismatch')).toBe(false);
        });
    });

    describe('Navigation Actions', () => {
        it('should navigate to login when clicking back to login', () => {
            component.onBackToLogin();
            expect(mockRouter.navigate).toHaveBeenCalledWith(['/login']);
        });
    });

    describe('Form Submission', () => {
        beforeEach(() => {
            // Setup valid form data
            component.registrationForm.patchValue({
                personType: 'F',
                name: 'João Silva',
                cpfCnpj: '12345678901',
                email: 'joao@email.com',
                cellphone: '11999999999',
                address: {
                    cep: '01234567',
                    street: 'Rua Teste',
                    neighbourhood: 'Centro',
                    city: 'São Paulo',
                    state: 'SP'
                },
                password: 'password123',
                confirmPassword: 'password123'
            });
        });

        it('should show error toast when form is invalid', async () => {
            component.registrationForm.patchValue({ name: '' }); // Make form invalid

            await component.onSubmit();

            expect(mockToastService.error).toHaveBeenCalledWith('Por favor, preencha todos os campos obrigatórios');
        });

        it('should set loading state during submission', async () => {
            const submitPromise = component.onSubmit();
            expect(component.isLoading).toBe(true);

            await submitPromise;
            expect(component.isLoading).toBe(false);
        });
    });
});
