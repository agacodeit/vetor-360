import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ForgotPasswordComponent } from './forgot-password.component';
import { InputComponent, IconComponent } from '../../../shared';

// Mock da MaskDirective para evitar dependência de NgModel interno
@Directive({
  selector: '[libMask]',
  standalone: true
})
class MockMaskDirective {
  @Input() libMask: string = '';
  @Input() dropSpecialCharacters: boolean = false;
}

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForgotPasswordComponent],
      providers: [provideRouter([])]
    })
      .overrideComponent(InputComponent, {
        set: {
          imports: [CommonModule, IconComponent, FormsModule, MockMaskDirective]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize forgot password form', () => {
    expect(component.forgotPasswordForm).toBeDefined();
    expect(component.forgotPasswordForm.get('email')).toBeDefined();
  });

  it('should have email getter', () => {
    expect(component.email).toBe(component.forgotPasswordForm.get('email'));
  });

  it('should start with isLoading false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should start with empty errorMessage and successMessage', () => {
    expect(component.errorMessage).toBe('');
    expect(component.successMessage).toBe('');
  });

  it('should validate email as required', () => {
    const email = component.forgotPasswordForm.get('email');
    email?.setValue('');
    expect(email?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const email = component.forgotPasswordForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue('valid@email.com');
    expect(email?.hasError('email')).toBe(false);
  });
});
