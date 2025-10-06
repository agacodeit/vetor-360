
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, forwardRef, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'ds-input',
  standalone: true,
  imports: [CommonModule, IconComponent, FormsModule],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements OnInit, OnDestroy, ControlValueAccessor {
  @Input() label: string = '';
  @Input() placeholder: string = '';
  @Input() type: string = 'text';
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() invalid: boolean = false;
  @Input() icon: string = '';
  @Input() iconPosition: 'left' | 'right' = 'left';
  @Input() maxlength: number | null = null;
  @Input() minlength: number | null = null;
  @Input() readonly: boolean = false;
  @Input() autocomplete: string = 'off';
  @Input() errorMessage: string = '';
  @Input() helperText: string = '';
  @Input() fullWidth: boolean = false;
  @Input() width: string = 'fit-content';


  @Input() ngModel: any;
  @Output() ngModelChange = new EventEmitter<any>();

  @Output() valueChanged = new EventEmitter<string>();

  value: string = '';
  isFocused: boolean = false;
  uniqueId: string = '';

  private onChange = (value: any) => { };
  private onTouched = () => { };

  constructor() {
    // Removido NgControl para evitar dependência circular
  }

  ngOnInit() {
    this.uniqueId = `ds-input-${Math.random().toString(36).substr(2, 9)}`;

    if (this.ngModel !== undefined && this.ngModel !== null) {
      this.value = String(this.ngModel);
    }
  }

  ngOnDestroy() { }


  writeValue(value: any): void {
    if (value === null || value === undefined) {
      this.value = '';
    } else {

      this.value = String(value);
    }
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


  onInputChange(target: any): void {
    if (!target) return;


    let newValue = String(target.value || '');


    if (this.type === 'number') {

      this.value = newValue;
      this.onChange(newValue);
      this.ngModelChange.emit(newValue);
      this.valueChanged.emit(newValue);
      return;
    }


    this.value = newValue;


    this.onChange(newValue);
    this.ngModelChange.emit(newValue);
    this.valueChanged.emit(newValue);
  }



  onInputFocus(): void {
    this.isFocused = true;
  }

  onInputBlur(): void {
    this.isFocused = false;
    this.onTouched();
  }


  get inputClasses(): string {
    const classes = ['input-field'];

    if (this.invalid) classes.push('invalid');
    if (this.disabled) classes.push('disabled');
    if (this.readonly) classes.push('readonly');
    if (this.icon) classes.push(`has-icon-${this.iconPosition}`);

    return classes.join(' ');
  }

  get labelClasses(): string {
    const classes = [];
    if (this.required) classes.push('required');
    return classes.join(' ');
  }

  get showError(): boolean {
    return this.invalid && !!this.errorMessage;
  }

  get showHelper(): boolean {
    return !this.showError && !!this.helperText;
  }




  get safeValue(): string {
    if (this.value === null || this.value === undefined) {
      return '';
    }
    return String(this.value);
  }


  get safeMaxlength(): number | null {
    return this.maxlength;
  }

  get safeMinlength(): number | null {
    return this.minlength;
  }
}
