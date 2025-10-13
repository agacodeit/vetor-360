import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { Directive, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Login } from './login';
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

describe('Login', () => {
  let component: Login;
  let fixture: ComponentFixture<Login>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
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

    fixture = TestBed.createComponent(Login);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
  });

  it('should have email and password getters', () => {
    expect(component.email).toBe(component.loginForm.get('email'));
    expect(component.password).toBe(component.loginForm.get('password'));
  });

  it('should start with isLoading false', () => {
    expect(component.isLoading).toBe(false);
  });

  it('should start with empty errorMessage', () => {
    expect(component.errorMessage).toBe('');
  });

  it('should validate email as required', () => {
    const email = component.loginForm.get('email');
    email?.setValue('');
    expect(email?.hasError('required')).toBe(true);
  });

  it('should validate email format', () => {
    const email = component.loginForm.get('email');
    email?.setValue('invalid-email');
    expect(email?.hasError('email')).toBe(true);

    email?.setValue('valid@email.com');
    expect(email?.hasError('email')).toBe(false);
  });

  it('should validate password as required', () => {
    const password = component.loginForm.get('password');
    password?.setValue('');
    expect(password?.hasError('required')).toBe(true);
  });

  it('should validate password min length', () => {
    const password = component.loginForm.get('password');
    password?.setValue('12345');
    expect(password?.hasError('minlength')).toBe(true);

    password?.setValue('123456');
    expect(password?.hasError('minlength')).toBe(false);
  });
});
