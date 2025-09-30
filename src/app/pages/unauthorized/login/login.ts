import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { CardComponent, InputComponent } from '../../../shared';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    CardComponent,
    InputComponent
  ],
  standalone:true,
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

}
