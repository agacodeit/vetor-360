import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonComponent } from '../../../shared';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    ButtonComponent
  ],
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard {


  openCreateSolicitationModal() {

  }
}
