import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [
    CommonModule,
    CardComponent,
    InputComponent,
    ButtonComponent
  ],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  router = inject(Router);

  goToLogin() {
    this.router.navigate(['/unauthorized/login']);
  }

  confirm() {

  }
}
