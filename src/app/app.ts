import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Design System Components

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('vetor-360');
}
