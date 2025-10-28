import { Component, forwardRef, Input, Output, EventEmitter, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface RadioOption {
  value: any;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ds-radio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio.component.html',
  styleUrls: ['./radio.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RadioComponent),
      multi: true
    }
  ]
})
export class RadioComponent implements ControlValueAccessor {
  @Input() options: RadioOption[] = [];
  @Input() name: string = '';
  @Input() disabled: boolean = false;
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'card' = 'default';

  @Output() valueChange = new EventEmitter<any>();

  value: any = null;
  uniqueId: string = '';

  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor() {
    this.uniqueId = `ds-radio-${Math.random().toString(36).substr(2, 9)}`;
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: (value: any) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onOptionChange(option: RadioOption): void {
    if (this.disabled || option.disabled) return;

    this.value = option.value;
    this.onChange(option.value);
    this.onTouched();
    this.valueChange.emit(option.value);
  }

  isOptionSelected(option: RadioOption): boolean {
    return this.value === option.value;
  }

  get radioClasses(): string {
    const classes = ['ds-radio'];

    if (this.orientation === 'horizontal') {
      classes.push('ds-radio--horizontal');
    }

    if (this.size) {
      classes.push(`ds-radio--${this.size}`);
    }

    if (this.variant) {
      classes.push(`ds-radio--${this.variant}`);
    }

    return classes.join(' ');
  }

  get optionClasses(): string {
    const classes = ['ds-radio__option'];

    if (this.variant === 'card') {
      classes.push('ds-radio__option--card');
    }

    if (this.size) {
      classes.push(`ds-radio__option--${this.size}`);
    }

    return classes.join(' ');
  }
}
