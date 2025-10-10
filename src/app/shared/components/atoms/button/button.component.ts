import { NgClass, NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { SpinnerComponent } from '../spinner/spinner.component';
@Component({
  selector: 'ds-button',
  standalone: true,
  imports: [NgStyle, NgClass, SpinnerComponent],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class ButtonComponent {

  @Input() label: string = '';
  @Input() variant: 'fill' | 'secondary' | 'outline' | 'ghost' = 'fill';
  @Input() icon: string = '';
  @Input() iconSize: string = '';
  @Input() fullWidth: boolean = false;
  @Input() rounded: boolean = false;
  @Input() isLoading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' = 'button';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() labelAlign: 'left' | 'center' | 'right' = 'center';
  @Input() rotateIcon: boolean = false;

  @Output() onClickEmitter = new EventEmitter();

  emitAction() {
    this.onClickEmitter.emit();
  }
}
