import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ButtonComponent, CardComponent, InputComponent } from '../../../shared';

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

  //private loginService = inject(LoginService);

  login() {

  }

  signup() {

  }
}
