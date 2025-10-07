import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent, TextareaComponent } from '../../../../shared';

@Component({
  selector: 'app-solicitation-modal',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonComponent,
    TextareaComponent
  ],
  standalone: true,
  templateUrl: './solicitation-modal.html',
  styleUrl: './solicitation-modal.scss'
})
export class SolicitationModal {
  @Output() onClose = new EventEmitter<void>();
  @Output() onSubmit = new EventEmitter<any>();

  solicitationForm: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) {
    this.solicitationForm = this.fb.group({
      purpose: ['', [Validators.required, Validators.maxLength(500)]],
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(1000)]]
    });
  }

  get purpose() {
    return this.solicitationForm.get('purpose');
  }

  get clientName() {
    return this.solicitationForm.get('clientName');
  }

  get clientEmail() {
    return this.solicitationForm.get('clientEmail');
  }

  get clientPhone() {
    return this.solicitationForm.get('clientPhone');
  }

  get amount() {
    return this.solicitationForm.get('amount');
  }

  handleSubmit() {
    if (this.solicitationForm.valid) {
      this.isLoading = true;
      this.onSubmit.emit(this.solicitationForm.value);
    } else {
      this.markFormGroupTouched();
    }
  }

  handleClose() {
    this.onClose.emit();
  }

  private markFormGroupTouched() {
    Object.keys(this.solicitationForm.controls).forEach(key => {
      const control = this.solicitationForm.get(key);
      control?.markAsTouched();
    });
  }

  handleIdentifyBestOperation() {

  }
}
