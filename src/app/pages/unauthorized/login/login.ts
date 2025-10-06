import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    CardComponent,
    InputComponent,
    ButtonComponent
  ],
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  router = inject(Router);

  //private loginService = inject(LoginService);

  login() {
    this.router.navigate(['/dashboard']);
  }

  signup() {
    this.router.navigate(['/unauthorized/signup']);
  }

  forgotPassword() {
    this.router.navigate(['/unauthorized/forgot-password']);
  }
}
