import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../../shared';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-authorized',
  imports: [
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './authorized.html',
  styleUrl: './authorized.scss'
})
export class Authorized {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onProfileClick() {
    this.authService.logout();
    this.router.navigate(['/unauthorized/login']);
  }

}
