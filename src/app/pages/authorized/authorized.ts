import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent, MessageContainerComponent } from '../../shared';
import { AuthService } from '../../shared/services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authorized',
  imports: [
    RouterOutlet,
    HeaderComponent,
    MessageContainerComponent
  ],
  templateUrl: './authorized.html',
  styleUrl: './authorized.scss'
})
export class Authorized {

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onProfileClick() {


  }
}
