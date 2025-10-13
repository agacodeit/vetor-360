import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  loginForm!: FormGroup;
  isLoading = false;
  errorMessage = '';

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login({ email, password }).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.router.navigate(['/authorized/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;

          if (error.status === 401) {
            this.errorMessage = 'E-mail ou senha incorretos';
          } else if (error.status === 0) {
            this.errorMessage = 'Erro de conexão. Verifique sua internet';
          } else {
            this.errorMessage = 'Erro interno do servidor. Tente novamente';
          }
        }
      });
    } else {
      this.markFormGroupTouched();
      this.errorMessage = 'Por favor, preencha todos os campos corretamente';
    }
  }

  signup() {
    this.router.navigate(['/unauthorized/signup']);
  }

  forgotPassword() {
    this.router.navigate(['/unauthorized/forgot-password']);
  }

  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }
}
