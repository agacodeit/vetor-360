import { NgClass, NgStyle } from '@angular/common';
import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ds-icon',
  standalone: true,
  imports: [NgStyle, NgClass],
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class IconComponent {

  @Input() icon: string = '';
  @Input() fontSize: string = '';
  @Input() cursorType: string = '';
  @Input() color: string = '';

}
