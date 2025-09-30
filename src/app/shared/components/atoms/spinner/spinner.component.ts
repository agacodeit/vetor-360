import { NgIf, NgStyle } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ds-spinner',
  standalone: true,
  imports: [NgStyle],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class SpinnerComponent {

  @Input() variant: 'fill' | 'outline' | 'ghost' = 'fill';
  @Input() size: string = '24px';

  get color() {
    switch (this.variant) {
      case 'fill':
        return 'white';
      case 'outline':
        return 'tertiary'
      default:
        return 'tertiary'
    }
  }


}
