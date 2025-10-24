import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, NgModel } from '@angular/forms';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';
import { Router } from '@angular/router';
import { AuthService } from '../../../shared/services';
import { MaskDirective } from 'mask-directive';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardComponent,
    InputComponent,
    ButtonComponent
  ],
  providers: [
    MaskDirective,
    NgModel
  ],
  standalone: true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  signupForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  ngOnInit() {
    this.initializeForm();
  }

  private initializeForm() {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      cellphone: ['', [Validators.required, Validators.pattern(/^\(\d{2}\)\s\d{4,5}-\d{4}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }


  signup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      this.successMessage = '';

      const { name, email, cellphone, password } = this.signupForm.value;

      this.authService.signup({
        name,
        email,
        cellphone,
        password
      }).subscribe({
        next: () => {
          this.isLoading = false;
          this.successMessage = 'Conta criada com sucesso! Redirecionando para o login...';

          this.router.navigate(['/unauthorized/login']);

        },
        error: (error) => {
          this.isLoading = false;

          if (error.status === 400) {
            this.errorMessage = 'Dados inválidos. Verifique as informações fornecidas';
          } else if (error.status === 409) {
            this.errorMessage = 'E-mail já cadastrado. Tente fazer login';
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

  goToLogin() {
    this.router.navigate(['/unauthorized/login']);
  }

  private markFormGroupTouched() {
    Object.keys(this.signupForm.controls).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  get name() {
    return this.signupForm.get('name');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get cellphone() {
    return this.signupForm.get('cellphone');
  }

  get password() {
    return this.signupForm.get('password');
  }
}
