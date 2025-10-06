import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  imports: [
    CommonModule,
    CardComponent,
    InputComponent,
    ButtonComponent],
  standalone: true,
  templateUrl: './signup.html',
  styleUrl: './signup.scss'
})
export class Signup {
  router = inject(Router);

  goToLogin() {
    this.router.navigate(['/unauthorized/login']);
  }

  signup() {

  }
}
