import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'ds-checkbox',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckboxComponent),
      multi: true
    }
  ]
})
export class CheckboxComponent implements OnInit, ControlValueAccessor {
  @Input() label: string = '';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() invalid: boolean = false;
  @Input() indeterminate: boolean = false;
  @Input() errorMessage: string = '';
  @Input() helperText: string = '';
  @Input() fullWidth: boolean = false;

  @Input() ngModel: boolean = false;
  @Output() ngModelChange = new EventEmitter<boolean>();

  @Output() valueChanged = new EventEmitter<boolean>();

  value: boolean = false;
  uniqueId: string = '';

  private onChange = (value: any) => { };
  private onTouched = () => { };

  ngOnInit() {
    this.uniqueId = `ds-checkbox-${Math.random().toString(36).substr(2, 9)}`;

    if (this.ngModel !== undefined && this.ngModel !== null) {
      this.value = this.ngModel;
    }
  }

  // ControlValueAccessor methods
  writeValue(value: any): void {
    this.value = !!value;
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

  // Event handlers
  onCheckboxChange(event: any): void {
    if (this.disabled) return;

    const newValue = event.target.checked;
    this.value = newValue;

    this.onChange(newValue);
    this.ngModelChange.emit(newValue);
    this.valueChanged.emit(newValue);
  }

  onCheckboxBlur(): void {
    this.onTouched();
  }

  // Computed properties
  get containerClasses(): string {
    const classes = ['checkbox-container'];

    if (this.fullWidth) classes.push('full-width');
    if (this.invalid) classes.push('invalid');

    return classes.join(' ');
  }

  get checkboxClasses(): string {
    const classes = ['checkbox-field'];

    if (this.invalid) classes.push('invalid');

    return classes.join(' ');
  }

  get labelClasses(): string {
    const classes = ['checkbox-label'];
    if (this.required) classes.push('required');
    return classes.join(' ');
  }

  get showError(): boolean {
    return this.invalid && !!this.errorMessage;
  }

  get showHelper(): boolean {
    return !this.showError && !!this.helperText;
  }
}
