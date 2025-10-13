import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Signup } from './signup';
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

describe('Signup', () => {
  let component: Signup;
  let fixture: ComponentFixture<Signup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Signup],
      providers: [
        provideHttpClient(),
        provideRouter([])
      ]
    })
      .overrideComponent(InputComponent, {
        set: {
          imports: [CommonModule, IconComponent, FormsModule, MockMaskDirective]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(Signup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize signup form', () => {
    expect(component.signupForm).toBeDefined();
    expect(component.signupForm.get('name')).toBeDefined();
    expect(component.signupForm.get('email')).toBeDefined();
    expect(component.signupForm.get('cellphone')).toBeDefined();
    expect(component.signupForm.get('password')).toBeDefined();
  });

  it('should start with isLoading false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should start with empty errorMessage', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should validate email format', () => {
    const email = component.signupForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue('valid@email.com');
    expect(email?.hasError('email')).toBe(false);
  });

  it('should validate password min length', () => {
    const password = component.signupForm.get('password');
    password?.setValue('12345');
    expect(password?.hasError('minlength')).toBe(true);

    password?.setValue('123456');
    expect(password?.hasError('minlength')).toBe(false);
  });

  it('should have form getters', () => {
    expect(component.name).toBe(component.signupForm.get('name'));
    expect(component.email).toBe(component.signupForm.get('email'));
    expect(component.cellphone).toBe(component.signupForm.get('cellphone'));
    expect(component.password).toBe(component.signupForm.get('password'));
  });
});
