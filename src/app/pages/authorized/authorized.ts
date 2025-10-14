import { Component } from '@angular/core';
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

  onProfileClick() { }

}
